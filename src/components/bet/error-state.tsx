'use client';

import { ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="mx-auto p-4">
    {/* Back Button */}
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
    </div>

    {/* Error Card */}
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-red-500/20" />
            </div>
            {/* <h2 className="text-xl font-semibold text-red-400">Error Loading Duel</h2> */}
            {/* <p className="text-zinc-400 max-w-md">{error}</p> */}
            <p className="text-zinc-400 font-semibold max-w-md">{error}</p>
          </div>
        </div>
      </div>

      {/* Placeholder for Place Order Card to maintain layout */}
      <div className="w-full max-w-md bg-zinc-900/50 rounded-xl border-zinc-800/50 border-2 p-6">
        <div className="h-[500px] flex items-center justify-center">
          <p className="text-zinc-600 text-sm">Unable to load order form</p>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorState;
