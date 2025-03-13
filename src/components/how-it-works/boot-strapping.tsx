'use client';
import * as React from 'react';

interface BootstrappingProps {
  imageUrl?: string;
  title?: string;
  descriptions?: string[];
  progressPercentage?: number;
}

/**
 * Bootstrapping component displays information about the bootstrapping process
 */
const Bootstrapping: React.FC<BootstrappingProps> = ({
  // imageUrl = '/icons/bootstrapping-icon.svg',
  title = 'Bootstrapping',
  descriptions = [
    'After approval duel moves to bootstrapping stage',
    'If duel volume reaches 50 credits it moves to live duels',
    'If bootstrapping condition is not reached in 30 minutes, funds are returned to users',
  ],
  progressPercentage = 30,
}) => {
  return (
    <article
      className="flex overflow-hidden flex-col px-12 p-4 rounded-3xl bg-[linear-gradient(180deg,#141217_0%,#0E0D10_100%)] w-full h-full"
      style={{
        border: '1px solid transparent',
        borderRadius: '24px',
        backgroundImage: 'linear-gradient(180deg,#141217_0%,#0E0D10_100%)',
        backgroundClip: 'padding-box',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          padding: '1px',
          background: 'linear-gradient(180deg, #F19ED2 0%, #241820 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />

      <figure className="flex items-center self-center max-w-full bg-white bg-opacity-0 shadow-[0px_70px_139px_rgba(241,158,210,0.15)]">
        {/* <img src={imageUrl} alt="Bootstrapping illustration" className="rounded-md w-[180px] h-[180px]" /> */}
        <div className="px-4 py-3.5 self-center rounded-xl border border-solid shadow-2xl bg-zinc-900 border-zinc-700 w-[290px] mt-8">
          <div className="flex justify-between mb-2.5">
            <span className="text-xs font-medium tracking-normal text-white">Bootstrapping</span>
            <span className="text-xs font-medium tracking-normal text-white">
              {progressPercentage}%
            </span>
          </div>
          <div
            className="relative w-full h-2 rounded-lg bg-zinc-100 bg-opacity-20"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-pink-300 rounded-lg shadow-md"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </figure>

      {/* <div className="px-4 py-3.5 self-center rounded-xl border border-solid shadow-2xl bg-zinc-900 border-zinc-700 w-[290px] mt-8">
        <div className="flex justify-between mb-2.5">
          <span className="text-xs font-medium tracking-normal text-white">Bootstrapping</span>
          <span className="text-xs font-medium tracking-normal text-white">
            {progressPercentage}%
          </span>
        </div>
        <div
          className="relative w-full h-2 rounded-lg bg-zinc-100 bg-opacity-20"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-pink-300 rounded-lg shadow-md"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div> */}

      <div className='mt-28'>
        <h2 className="self-center mt-8 text-2xl font-semibold text-stone-200">{title}</h2>

        <div className="flex flex-col gap-3 mt-4">
          {descriptions.map((description, index) => (
            <p
              key={index}
              className="text-xs font-medium tracking-normal leading-4 text-stone-200 text-opacity-80"
            >
              {description}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default Bootstrapping;
