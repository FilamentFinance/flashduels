interface WebSocketManagerOptions<T = unknown> {
  address: string; // Now we pass the address instead of the token
  url: string;
  onMessage?: (message: T) => void;
  onOpen?: (event: Event) => void;
  onError?: (error: Event | Error) => void;
  onClose?: (event: CloseEvent) => void;
}

class WebSocketManager<T = unknown> {
  private token: string;
  private url: string;
  private onMessage?: (message: T) => void;
  private onOpen?: (event: Event) => void;
  private onError?: (error: Event | Error) => void;
  private onClose?: (event: CloseEvent) => void;
  private socket: WebSocket | null = null;

  constructor(options: WebSocketManagerOptions<T>) {
    // Retrieve the token automatically from localStorage using the provided address.
    const token = localStorage.getItem(`Bearer_${options.address.toLowerCase()}`);
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    this.token = token;

    // Append the token as a query parameter to the URL.
    this.url = `${options.url}?token=${token}`;
    this.onMessage = options.onMessage;
    this.onOpen = options.onOpen;
    this.onError = options.onError;
    this.onClose = options.onClose;
  }

  public connect(): WebSocket {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event: Event) => {
      console.info('Connected to the WebSocket server');
      if (this.onOpen) {
        this.onOpen(event);
      }
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        // Parse the message data into the generic type T.
        const message = JSON.parse(event.data) as T;
        if (this.onMessage) {
          this.onMessage(message);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket Error:', error);
      if (this.onError) {
        this.onError(error);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log('Disconnected from the WebSocket server');
      if (this.onClose) {
        this.onClose(event);
      }
    };

    return this.socket;
  }

  public send(data: unknown): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Here you can send any data, and the token is already embedded in the URL.
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Unable to send data:', data);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketManager;
