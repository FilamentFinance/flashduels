import { EnvConfig, ServerConfig } from '@/types/serverconfig';
import { AppError } from '@/utils/error';
import { STATUS_CODES } from '@/constants/statusCodes';
import { ERRORS } from '@/constants/error';

const getEnvVar = (key: keyof EnvConfig): string => {
  const value = process.env[key] || window?.__NEXT_DATA__?.props?.env?.[key];
  if (!value?.toString()?.trim()) {
    throw new AppError({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      type: ERRORS.MISSING_ENV_VARIABLE,
      message: `Missing required environment variable: ${key}`,
    });
  }
  return value.toString();
};
const validateEnvVariables = (): void => {
  const requiredVars = Object.keys({} as EnvConfig) as Array<keyof EnvConfig>;
  const missingVars = requiredVars.filter((key) => !process.env[key]?.trim());
  if (missingVars.length > 0) {
    throw new AppError({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      type: ERRORS.MISSING_ENV_VARIABLE,
      message: [
        'Missing required environment variables:',
        ...missingVars,
        '\nPlease check your .env file and ensure all required variables are defined.',
      ].join('\n'),
    });
  }
};

const configMapping: Record<keyof ServerConfig, keyof EnvConfig> = {
  PRODUCTION: 'NEXT_PUBLIC_PRODUCTION',
  PRIVATE_KEY: 'PRIVATE_KEY',
  API_PRODUCTION: 'NEXT_PUBLIC_API_PRODUCTION',
  API_WS_PRODUCTION: 'NEXT_PUBLIC_API_WS_PRODUCTION',
  API: 'NEXT_PUBLIC_API',
  API_WS: 'NEXT_PUBLIC_API_WS',
  FLASH_USDC: 'NEXT_PUBLIC_FLASH_USDC',
  TIMER_BOT_URL: 'NEXT_PUBLIC_TIMER_BOT_URL',
  TIMER_BOT_URL_PRODUCTION: 'NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION',
  RPC_URL: 'NEXT_PUBLIC_RPC_URL',
  DIAMOND: 'NEXT_PUBLIC_DIAMOND',
};

const createServerConfig = (): Readonly<ServerConfig> => {
  validateEnvVariables();

  const config = {} as ServerConfig;
  (Object.keys(configMapping) as Array<keyof ServerConfig>).forEach((key) => {
    const envKey = configMapping[key];
    config[key] = getEnvVar(envKey);
  });

  return Object.freeze(config);
};

export const SERVER_CONFIG = createServerConfig();
