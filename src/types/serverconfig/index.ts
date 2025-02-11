export type EnvConfig = {
  NEXT_PUBLIC_PRODUCTION: string;
  PRIVATE_KEY: string;
  NEXT_PUBLIC_API_PRODUCTION: string;
  NEXT_PUBLIC_API_WS_PRODUCTION: string;
  NEXT_PUBLIC_API: string;
  NEXT_PUBLIC_API_WS: string;
  NEXT_PUBLIC_FLASH_USDC: string;
  NEXT_PUBLIC_TIMER_BOT_URL: string;
  NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION: string;
  NEXT_PUBLIC_RPC_URL: string;
  NEXT_PUBLIC_DIAMOND: string;
};

export type ServerConfig = {
  [K in keyof EnvConfig as K extends `NEXT_PUBLIC_${infer R}` ? R : K]: string;
};
