'use client';

const LoadingSkeleton = () => (
  <div className="mx-auto p-4">
    {/* Back Button */}
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-zinc-400">
        <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse" />
        <div className="w-10 h-4 bg-zinc-800 rounded animate-pulse" />
      </div>
    </div>

    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 space-y-4">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between items-center px-4 py-2">
            <div className="space-y-2">
              <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="w-24 h-5 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="w-20 h-5 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-zinc-800 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Book */}
        <div className="mt-4 bg-neutral-900 border-2 border-stone-900 rounded-xl">
          <div className="h-[300px] flex divide-x-2 divide-stone-900">
            <div className="flex-1 p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex-1 p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-4 bg-neutral-900 border-2 border-neutral-800 rounded-xl">
          <div className="border-b border-zinc-800 p-2">
            <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-[200px] p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-24 h-8 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Place Order Card */}
      <div className="w-full max-w-md bg-zinc-900 rounded-xl border-zinc-800 border-2 p-6 space-y-6">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-zinc-800 pb-2">
            <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse" />
            <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Position Buttons */}
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="flex-1 h-10 bg-zinc-800 rounded-lg animate-pulse" />
          </div>

          {/* Price Labels */}
          <div className="flex justify-between px-1">
            <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="h-14 bg-zinc-800 rounded-xl animate-pulse" />
          </div>

          {/* Order Summary */}
          <div className="p-3 bg-neutral-900 border border-white/10 rounded-lg">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Action Button */}
          <div className="h-14 bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
