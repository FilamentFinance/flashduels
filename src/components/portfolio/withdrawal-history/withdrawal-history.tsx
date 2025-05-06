import React, { useEffect, useState } from 'react';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';
import { formatTokenAmount } from '@/utils/token';
// import { sei } from 'viem/chains';

interface WithdrawalRequest {
  requestId: string;
  amount: string;
  status: string;
  timestamp: string;
  updatedAt?: string;
  tokenSymbol?: string;
}
const MIN_AMOUNT = 5;

const WithdrawalHistory: React.FC<{ address: string }> = ({ address }) => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();
  const defaultSymbol = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${SERVER_CONFIG.API_URL}/user/withdrawal-requests?minAmount=${MIN_AMOUNT}&user=${address}`,
        );
        if (!res.ok) throw new Error('Failed to fetch withdrawal requests');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [address]);

  // Use 1/5 width for each column
  const colClass = 'w-1/5 px-2';

  return (
    <div className="flex flex-col h-full w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
      {/* Table Header - always visible */}
      <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
        <div className={colClass}>Request ID</div>
        <div className={colClass}>Amount ({defaultSymbol})</div>
        <div className={colClass}>Request Time</div>
        <div className={colClass}>Approval Time</div>
        <div className={colClass}>Status</div>
      </div>
      {/* Table Rows or message */}
      <div className="flex flex-col w-full">
        {loading ? (
          <div className="text-center text-gray-400 py-6">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No withdrawal requests found.</div>
        ) : (
          requests.map((req) => (
            <div
              key={req.requestId}
              className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800"
            >
              <div className={colClass + ' font-mono text-xs truncate'}>{req.requestId}</div>
              <div className={colClass}>
                {formatTokenAmount(BigInt(req.amount), chainId, req.tokenSymbol || defaultSymbol)}
              </div>
              <div className={colClass}>{new Date(req.timestamp).toLocaleString()}</div>
              <div className={colClass}>
                {req.status === 'approved' && req.updatedAt
                  ? new Date(req.updatedAt).toLocaleString()
                  : '-'}
              </div>
              <div className={colClass + ' capitalize'}>{req.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;
