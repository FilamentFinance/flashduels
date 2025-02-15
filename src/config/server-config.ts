interface ServerConfig {
  PRODUCTION: boolean;
  RPC_URL: string;
  API_URL: string;
  API_WS_URL: string;
  TIMER_BOT_URL: string;
  DIAMOND: string;
  FLASH_USDC: string;
  WALLET_CONNECT_PROJECT_ID: string;
}

const createConfig = (): ServerConfig => {
  const production = process.env.NEXT_PUBLIC_PRODUCTION === 'true';
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;
  const apiProduction = process.env.NEXT_PUBLIC_API_PRODUCTION as string;
  const apiWsProduction = process.env.NEXT_PUBLIC_API_WS_PRODUCTION as string;
  const api = process.env.NEXT_PUBLIC_API as string;
  const apiWs = process.env.NEXT_PUBLIC_API_WS as string;
  const timerBotUrl = process.env.NEXT_PUBLIC_TIMER_BOT_URL as string;
  const timerBotUrlProduction = process.env.NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION as string;
  const diamond = process.env.NEXT_PUBLIC_DIAMOND as string;
  const flashUsdc = process.env.NEXT_PUBLIC_FLASH_USDC as string;
  const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

  // Validate required environment variables
  const missingVars = [];
  if (!rpcUrl) missingVars.push('NEXT_PUBLIC_RPC_URL');
  if (!apiProduction) missingVars.push('NEXT_PUBLIC_API_PRODUCTION');
  if (!apiWsProduction) missingVars.push('NEXT_PUBLIC_API_WS_PRODUCTION');
  if (!api) missingVars.push('NEXT_PUBLIC_API');
  if (!apiWs) missingVars.push('NEXT_PUBLIC_API_WS');
  if (!timerBotUrl) missingVars.push('NEXT_PUBLIC_TIMER_BOT_URL');
  if (!timerBotUrlProduction) missingVars.push('NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION');
  if (!diamond) missingVars.push('NEXT_PUBLIC_DIAMOND');
  if (!flashUsdc) missingVars.push('NEXT_PUBLIC_FLASH_USDC');
  if (!walletConnectProjectId) missingVars.push('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    PRODUCTION: production,
    RPC_URL: rpcUrl,
    API_URL: production ? apiProduction : api,
    API_WS_URL: production ? apiWsProduction : apiWs,
    TIMER_BOT_URL: production ? timerBotUrlProduction : timerBotUrl,
    DIAMOND: diamond,
    FLASH_USDC: flashUsdc,
    WALLET_CONNECT_PROJECT_ID: walletConnectProjectId,
  };
};

export const SERVER_CONFIG = createConfig();
