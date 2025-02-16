# Signature-Based Authentication for Decentralized Trading

## Overview

This document describes a decentralized, signature‑based authentication approach that replaces centralized JWT tokens. In this approach, every trade request is authorized by signing a canonical message (containing trade details and a timestamp) using the user's main wallet. A child wallet is derived deterministically from the user's wallet address and the signature using viem's hashing functions. This example implements a client‑side solution in TypeScript using viem and wagmi without persisting sensitive keys in local storage.

## Security Considerations

### 1. Signature Replay Protection

- Each signature includes a timestamp to prevent replay attacks
- Backend must enforce a short validity window for signatures (e.g., 5 minutes)
- Signatures should be single-use and tracked on the backend
- Include a nonce in the canonical message for additional security

### 2. Child Wallet Security

- Child wallets are derived on-demand and never stored
- Private keys exist only in memory during the trade execution
- Each trade uses a unique child wallet, preventing correlation
- Child wallet derivation is deterministic but unpredictable

### 3. Message Canonicalization

- All messages must be canonicalized before signing to ensure consistency
- Use JSON.stringify with sorted keys to create deterministic messages
- Include all relevant trade parameters in the signed message
- Validate message format on both client and server

## Client-Side Implementation

### Flow Summary

1. **On-Demand Child Wallet Derivation:**

   - When the user initiates a trade, they are prompted to sign a canonical message (which contains the trade payload and a timestamp) using their main wallet.
   - The child wallet is then derived deterministically from the user's wallet address and the obtained signature. This is done using viem's hashing functions (`keccak256`) and account derivation (`privateKeyToAccount`).
   - No persistent storage is used for the derived child wallet; the derivation occurs on-demand for each trade request.

2. **Trade Request Submission:**
   - The client constructs a canonical message by JSON-stringifying an object that includes the trade payload (order ID, trade amount, trade price) and the current timestamp.
   - The canonical message is signed using wagmi's `useSignMessage`.
   - The derived child wallet's public address, along with the timestamp, trade payload, and signature, is sent to the backend for processing.

### Enhanced TradeButton Component (TypeScript, TSX)

````tsx
// TradeButton.tsx
'use client';

import React, { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { parseUnits } from 'viem';
import { Button } from '@/shadcn/components/ui/button';
import { keccak256, privateKeyToAccount } from 'viem/accounts';

interface CanonicalMessage {
  payload: TradeRequestPayload;
  timestamp: number;
  nonce: string; // Added for replay protection
  chainId: number; // Added for cross-chain protection
}

//
// Deterministically derive a child wallet from the user's wallet address and a signature.
// Enhanced with additional entropy and validation.
//
function deriveChildWallet(
  userAddress: string,
  signature: string,
  timestamp: number
): { address: string; privateKey: string } {
  // Validate inputs
  if (!userAddress || !signature) {
    throw new Error('Invalid inputs for child wallet derivation');
  }

  // Add timestamp to derivation for additional entropy
  const combined = `${userAddress.toLowerCase()}-${signature}-${timestamp}`;
  const derivedPrivateKey = keccak256(new TextEncoder().encode(combined));

  try {
    const account = privateKeyToAccount(derivedPrivateKey);
    return {
      address: account.address,
      privateKey: derivedPrivateKey
    };
  } catch (error) {
    throw new Error('Failed to derive child wallet: ' + error);
  }
}

// Canonicalize message with sorted keys for consistency
function createCanonicalMessage(
  payload: TradeRequestPayload,
  timestamp: number,
  chainId: number
): string {
  const nonce = keccak256(new TextEncoder().encode(Date.now().toString()));
  const message: CanonicalMessage = {
    payload: {
      orderId: payload.orderId,
      tradeAmount: payload.tradeAmount,
      tradePrice: payload.tradePrice
    },
    timestamp,
    nonce,
    chainId
  };

  return JSON.stringify(message, Object.keys(message).sort());
}

export interface TradeRequestPayload {
  orderId: number;
  tradeAmount: string;
  tradePrice: string;
}

export interface SignedTradeRequest {
  childWalletAddress: string;
  timestamp: number;
  nonce: string;
  chainId: number;
  payload: TradeRequestPayload;
  signature: string;
}

interface TradeButtonProps {
  orderId: number;
  tradeAmount: string;
  tradePrice: string;
  chainId: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

const TradeButton: React.FC<TradeButtonProps> = ({
  orderId,
  tradeAmount,
  tradePrice,
  chainId,
  onSuccess,
  onError
}) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>('');

  const validateTradeParams = () => {
    if (!orderId || orderId <= 0) throw new Error('Invalid order ID');
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) throw new Error('Invalid trade amount');
    if (!tradePrice || parseFloat(tradePrice) <= 0) throw new Error('Invalid trade price');
  };

  const handleTrade = async () => {
    if (!address) {
      const error = new Error('Wallet not connected.');
      onError?.(error);
      setResponseMsg(error.message);
      return;
    }

    setIsLoading(true);
    try {
      // Validate trade parameters
      validateTradeParams();

      const timestamp: number = Date.now();
      const payload: TradeRequestPayload = { orderId, tradeAmount, tradePrice };

      // Create canonical message with sorted keys
      const canonicalMessage = createCanonicalMessage(payload, timestamp, chainId);

      // Prompt the user to sign the canonical message with their main wallet
      const signature: string = await signMessageAsync({
        message: canonicalMessage
      });

      // Derive the child wallet on the fly with additional entropy
      const childWallet = deriveChildWallet(address, signature, timestamp);

      // Construct the signed trade request
      const signedRequest: SignedTradeRequest = {
        childWalletAddress: childWallet.address,
        timestamp,
        nonce: JSON.parse(canonicalMessage).nonce,
        chainId,
        payload,
        signature,
      };

      // Send the signed request to the backend
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Chain-Id': chainId.toString()
        },
        body: JSON.stringify(signedRequest),
      });

      if (!response.ok) {
        throw new Error(`Trade failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseMsg(data.message || 'Trade executed successfully');
      onSuccess?.(data.txHash);
    } catch (err: any) {
      const error = new Error('Trade failed: ' + (err.message || 'Unknown error'));
      console.error(error);
      setResponseMsg(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleTrade}
        disabled={isLoading || !address}
        className="w-full"
      >
        {isLoading ? 'Processing Trade...' : 'Trade'}
      </Button>
      {responseMsg && (
        <p className="mt-2 text-sm text-gray-600">
          {responseMsg}
        </p>
      )}
    </div>
  );
};

export default TradeButton;

## Backend Validation Requirements

### 1. Signature Verification
```typescript
interface SignatureVerification {
  // Verify the signature matches the canonical message
  isValidSignature: boolean;
  // Check if signature was used before (prevent replay)
  isUnusedSignature: boolean;
  // Verify timestamp is within acceptable window
  isValidTimestamp: boolean;
  // Verify chain ID matches expected network
  isValidChainId: boolean;
}
````

### 2. Child Wallet Validation

- Verify child wallet is derived correctly from signature
- Ensure child wallet has sufficient permissions
- Validate child wallet has not been used before
- Check child wallet balance for trade execution

### 3. Trade Parameter Validation

- Validate all trade parameters are within acceptable ranges
- Check order exists and is still valid
- Verify price hasn't moved beyond slippage tolerance
- Ensure trade amount meets minimum/maximum requirements

## Error Handling

### Client-Side Errors

1. Wallet Connection Errors

   - Handle disconnected wallet scenarios
   - Manage wallet switching between networks
   - Handle signature rejection by user

2. Trade Validation Errors

   - Invalid trade parameters
   - Insufficient balance
   - Price movement beyond tolerance
   - Network-specific errors

3. Child Wallet Errors
   - Derivation failures
   - Invalid signatures
   - Timestamp validation failures

### Backend Errors

1. Signature Verification Errors

   - Invalid signatures
   - Expired timestamps
   - Replay attempts
   - Chain ID mismatches

2. Trade Execution Errors
   - Order filled or cancelled
   - Insufficient liquidity
   - Price impact too high
   - Gas estimation failures

## Best Practices

1. **Security**

   - Never store private keys
   - Use short signature validity windows
   - Implement rate limiting
   - Add multi-layer replay protection

2. **User Experience**

   - Clear error messages
   - Loading states for all actions
   - Transaction status updates
   - Retry mechanisms for failed trades

3. **Performance**

   - Optimize message canonicalization
   - Efficient signature verification
   - Quick child wallet derivation
   - Proper error handling and recovery

4. **Monitoring**
   - Log all trade attempts
   - Track signature usage
   - Monitor child wallet creation
   - Alert on suspicious patterns

## Testing Considerations

1. **Unit Tests**

   - Message canonicalization
   - Child wallet derivation
   - Signature verification
   - Parameter validation

2. **Integration Tests**

   - End-to-end trade flow
   - Network switching
   - Error scenarios
   - Race conditions

3. **Security Tests**
   - Replay attack prevention
   - Signature manipulation
   - Timestamp tampering
   - Child wallet security

## Backend Implementation

### Core Server Implementation

```typescript
// server.ts
import express, { Request, Response } from 'express';
import { verifyMessage } from 'viem';
import { redis } from './redis';
import { validateTradeParameters } from './validators';
import { executeTradeOnChain } from './blockchain';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_TIME_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 100;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: MAX_REQUESTS_PER_WINDOW,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(bodyParser.json());
app.use(limiter);

// Types
interface CanonicalMessage {
  payload: TradeRequestPayload;
  timestamp: number;
  nonce: string;
  chainId: number;
}

interface TradeRequestPayload {
  orderId: number;
  tradeAmount: string;
  tradePrice: string;
}

interface SignedTradeRequest {
  childWalletAddress: string;
  timestamp: number;
  nonce: string;
  chainId: number;
  payload: TradeRequestPayload;
  signature: string;
}

// Signature verification middleware
const verifySignature = async (req: Request, res: Response, next: Function) => {
  try {
    const { childWalletAddress, timestamp, nonce, chainId, payload, signature } =
      req.body as SignedTradeRequest;

    // 1. Verify timestamp
    if (Date.now() - timestamp > ALLOWED_TIME_WINDOW) {
      return res.status(401).json({
        error: 'SIGNATURE_EXPIRED',
        message: 'Signature has expired',
      });
    }

    // 2. Verify chain ID
    const expectedChainId = Number(process.env.CHAIN_ID);
    if (chainId !== expectedChainId) {
      return res.status(401).json({
        error: 'INVALID_CHAIN',
        message: 'Invalid chain ID',
      });
    }

    // 3. Check for signature replay
    const signatureKey = `signature:${signature}`;
    const nonceKey = `nonce:${nonce}`;
    const [usedSignature, usedNonce] = await Promise.all([
      redis.get(signatureKey),
      redis.get(nonceKey),
    ]);

    if (usedSignature || usedNonce) {
      return res.status(401).json({
        error: 'REPLAY_DETECTED',
        message: 'Signature or nonce already used',
      });
    }

    // 4. Verify signature
    const message: CanonicalMessage = { payload, timestamp, nonce, chainId };
    const canonicalMessage = JSON.stringify(message, Object.keys(message).sort());

    const recoveredAddress = await verifyMessage({
      message: canonicalMessage,
      signature,
    });

    if (recoveredAddress.toLowerCase() !== childWalletAddress.toLowerCase()) {
      return res.status(401).json({
        error: 'INVALID_SIGNATURE',
        message: 'Invalid signature',
      });
    }

    // 5. Store signature and nonce
    await Promise.all([
      redis.setex(signatureKey, ALLOWED_TIME_WINDOW / 1000, '1'),
      redis.setex(nonceKey, ALLOWED_TIME_WINDOW / 1000, '1'),
    ]);

    next();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return res.status(500).json({
      error: 'VERIFICATION_FAILED',
      message: 'Signature verification failed',
    });
  }
};

// Trade execution endpoint
app.post('/api/trade', verifySignature, async (req: Request, res: Response) => {
  try {
    const { childWalletAddress, payload } = req.body as SignedTradeRequest;

    // Execute trade on-chain
    const txHash = await executeTradeOnChain({
      walletAddress: childWalletAddress,
      orderId: payload.orderId,
      amount: payload.tradeAmount,
      price: payload.tradePrice,
    });

    return res.status(200).json({
      message: 'Trade executed successfully',
      txHash,
    });
  } catch (error) {
    console.error('Trade execution failed:', error);
    return res.status(500).json({
      error: 'EXECUTION_FAILED',
      message: 'Trade execution failed',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Redis Configuration

```typescript
// redis.ts
import Redis from 'ioredis';

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export const redis = new Redis(REDIS_CONFIG);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});
```

### Blockchain Interaction

```typescript
// blockchain.ts
import { Contract } from 'ethers';
import { provider } from './provider';
import { TRADE_CONTRACT_ABI, TRADE_CONTRACT_ADDRESS } from './constants';

interface TradeExecutionParams {
  walletAddress: string;
  orderId: number;
  amount: string;
  price: string;
}

export async function executeTradeOnChain(params: TradeExecutionParams): Promise<string> {
  try {
    const contract = new Contract(TRADE_CONTRACT_ADDRESS, TRADE_CONTRACT_ABI, provider);

    // Estimate gas for the transaction
    const gasEstimate = await contract.estimateGas.executeTrade(
      params.orderId,
      params.amount,
      params.price,
      { from: params.walletAddress },
    );

    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate.mul(120).div(100);

    // Execute the trade
    const tx = await contract.executeTrade(params.orderId, params.amount, params.price, {
      from: params.walletAddress,
      gasLimit,
    });

    // Wait for confirmation
    const receipt = await tx.wait(1);

    return receipt.transactionHash;
  } catch (error) {
    console.error('Trade execution error:', error);
    throw new Error('Failed to execute trade on-chain');
  }
}
```

### Environment Configuration

```bash
# .env
PORT=3000
CHAIN_ID=1
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
TRADE_CONTRACT_ADDRESS=0x...
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your_api_key
```

### Backend Security Features

1. **Signature Verification**

   - Validates message signatures using viem
   - Prevents replay attacks with Redis
   - Enforces timestamp freshness
   - Verifies chain ID

2. **Rate Limiting**

   - Prevents DoS attacks
   - Configurable time windows
   - IP-based rate limiting
   - Custom error messages

3. **Data Validation**

   - Input sanitization
   - Parameter validation
   - Type checking
   - Error handling

4. **Redis Integration**
   - Fast signature/nonce tracking
   - Persistent storage
   - Connection pooling
   - Error recovery

### Deployment Considerations

1. **Environment Setup**

   - Use secure environment variables
   - Configure Redis securely
   - Set up monitoring
   - Configure logging

2. **Scaling**

   - Use load balancers
   - Implement caching
   - Optimize database queries
   - Monitor performance

3. **Maintenance**
   - Regular security updates
   - Backup strategies
   - Monitoring alerts
   - Documentation updates

### Error Handling

```typescript
// types/errors.ts
export enum TradeErrorType {
  SIGNATURE_EXPIRED = 'SIGNATURE_EXPIRED',
  INVALID_CHAIN = 'INVALID_CHAIN',
  REPLAY_DETECTED = 'REPLAY_DETECTED',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  INVALID_TRADE_PARAMS = 'INVALID_TRADE_PARAMS',
  EXECUTION_FAILED = 'EXECUTION_FAILED',
}

export interface TradeError {
  type: TradeErrorType;
  message: string;
  details?: any;
}
```

### Testing

1. **Unit Tests**

```typescript
// __tests__/signature.test.ts
import { verifySignature } from '../middleware/signature';

describe('Signature Verification', () => {
  test('should verify valid signatures', async () => {
    // Test implementation
  });

  test('should reject expired signatures', async () => {
    // Test implementation
  });

  test('should prevent replay attacks', async () => {
    // Test implementation
  });
});
```

2. **Integration Tests**

```typescript
// __tests__/trade.test.ts
import { executeTradeOnChain } from '../blockchain';

describe('Trade Execution', () => {
  test('should execute valid trades', async () => {
    // Test implementation
  });

  test('should handle failed trades', async () => {
    // Test implementation
  });
});
```

### Monitoring and Logging

1. **Prometheus Metrics**

```typescript
// metrics.ts
import client from 'prom-client';

export const tradeCounter = new client.Counter({
  name: 'trades_total',
  help: 'Total number of trades',
});

export const signatureVerificationDuration = new client.Histogram({
  name: 'signature_verification_duration_seconds',
  help: 'Duration of signature verification',
});
```

2. **Logging**

```typescript
// logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```
