import { FC } from 'react';
import Image from 'next/image';
// import { ArrowRight } from 'lucide-react';

const Banner: FC = () => {
  return (
    <div
      className="w-full bg-[#4C3D4D] border-2 border-[#F19ED2]/30 rounded-lg mb-6 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)',
      }}
    >
      <div className="flex justify-between h-[140px]">
        <div className="flex-1 px-8 flex flex-col justify-center h-full space-y-2">
          <div className="flex items-center">
            <p className="text-gray-100 font-bold text-base">
              Formula1 Markets for Monaco GP 2025 are live on{' '}
              <span className="inline-flex items-center align-middle">
                <Image
                  src="/chain-icons/base.png"
                  alt="Base Chain Icon"
                  width={15}
                  height={15}
                  className="mx-1"
                />
                <span className="text-blue-400">Base</span>.
              </span>
            </p>
          </div>
          <p className="text-gray-100 font-medium text-sm leading-relaxed">
            Long/Short your favourite markets. To create markets, please apply for the Creator role.
          </p>
        </div>
        <div className="w-1/2 h-full relative flex gap-px rounded-r-lg overflow-hidden">
          <div className="w-1/3 h-full relative">
            <Image
              src="/banners/monacogp2.png"
              alt="Formula 1 car on track"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-1/3 h-full relative">
            <Image
              src="/banners/monacogp3.png"
              alt="Formula 1 cars racing"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-1/3 h-full relative">
            <Image
              src="/banners/monacogp4.png"
              alt="Another Formula 1 scene"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
