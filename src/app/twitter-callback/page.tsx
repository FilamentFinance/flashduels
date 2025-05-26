'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';

export default function TwitterCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chainId = useChainId();

  useEffect(() => {
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');

    if (!oauth_token || !oauth_verifier) {
      router.push('/?twitterShareError=missing_data');
      return;
    }

    // The backend will handle the OAuth flow and redirect to the tweet
    window.location.href = `${SERVER_CONFIG.getApiUrl(chainId)}/twitter/callback?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`;
  }, [searchParams, router, chainId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-zinc-800 max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Loading Animation */}
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-400/20 animate-ping" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold text-white">Completing Twitter Share...</h1>
            <p className="text-zinc-400">Please wait while we process your tweet</p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full max-w-[200px] h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
          </div>

          {/* Help Text */}
          <p className="text-xs text-zinc-500 text-center">
            This may take a few moments. You'll be redirected automatically when ready.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
