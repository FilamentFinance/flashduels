// services/hermesPriceService.ts
import { COIN_DUAL_ASSETS } from '@/constants/dual';
import { HermesClient } from '@pythnetwork/hermes-client';

interface PriceState {
  [key: string]: number;
}

type PriceUpdateCallback = (prices: PriceState) => void;

export class HermesPriceService {
  private client: HermesClient;
  private eventSource: EventSource | null = null;
  private isConnected: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly callbacks: Set<PriceUpdateCallback> = new Set();
  private currentPrices: PriceState = {};
  private readonly addressToSymbol: Record<string, string> = Object.keys(COIN_DUAL_ASSETS).reduce(
    (acc, key) => {
      const asset = COIN_DUAL_ASSETS[key];
      acc[asset.address] = asset.symbol;
      return acc;
    },
    {} as Record<string, string>,
  );

  constructor(
    private readonly endpoint: string = 'https://hermes.pyth.network',
    private readonly priceIds: string[] = Object.values(COIN_DUAL_ASSETS).map(
      (asset) => asset.address,
    ),
    private readonly reconnectDelay: number = 5000,
  ) {
    this.client = new HermesClient(endpoint, {});
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const eventSource = await this.client.getPriceUpdatesStream(this.priceIds);

      if (!eventSource) {
        throw new Error('Failed to create event source');
      }

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const priceUpdate = JSON.parse(event.data).parsed;
          this.handlePriceUpdate(priceUpdate);
        } catch (error) {
          console.error('Error parsing price update:', error);
        }
      };

      eventSource.onerror = (error: Event) => {
        console.error('Stream connection error:', error);
        this.handleDisconnect();
      };

      this.eventSource = eventSource;
      this.isConnected = true;
      console.log('Connected to Hermes price stream');
    } catch (error) {
      console.error('Failed to connect to Hermes:', error);
      this.handleDisconnect();
    }
  }

  private handlePriceUpdate(priceUpdate: { id: string; price: { price: number } }[]): void {
    priceUpdate.forEach((item) => {
      if (item?.price?.price != null) {
        this.currentPrices[item.id] = item.price.price;
      }
    });

    // Notify all subscribers
    this.callbacks.forEach((callback) => callback({ ...this.currentPrices }));
  }

  private handleDisconnect(): void {
    this.isConnected = false;
    const eventSource = this.eventSource;
    if (eventSource) {
      eventSource.close();
      this.eventSource = null;
    }

    // Attempt to reconnect after delay
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, this.reconnectDelay);
  }

  subscribe(callback: PriceUpdateCallback): () => void {
    this.callbacks.add(callback);

    // If we have current prices, immediately send them to the new subscriber
    if (Object.keys(this.currentPrices).length > 0) {
      callback({ ...this.currentPrices });
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  getCurrentPrices(): PriceState {
    return { ...this.currentPrices };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const eventSource = this.eventSource;
    if (eventSource) {
      eventSource.close();
      this.eventSource = null;
    }

    this.isConnected = false;
    this.callbacks.clear();
  }
}
