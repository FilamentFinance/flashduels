'use client';
import * as React from 'react';

interface CreateADuelProps {
  imageUrl?: string;
  title?: string;
  descriptions?: string[];
}

/**
 * CreateADuel component displays information about creating a duel
 */
const CreateADuel: React.FC<CreateADuelProps> = ({
  imageUrl = '/icons/create-a-duel.png',
  title = 'Create a Duel',
  descriptions = [
    'When a Coin Duel is created in instantly goes to Bootstrapping phase',
    'When Flash Duel is created it is sent to admin dashboard after getting approved (30 min~), it moves to bootstrapping phase',
  ],
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
        <img src={imageUrl} alt="Create a duel illustration" className="rounded-md " />
      </figure>

      <h2 className="self-center mt-14 text-2xl font-semibold text-stone-200">{title}</h2>

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
    </article>
  );
};

export default CreateADuel;
