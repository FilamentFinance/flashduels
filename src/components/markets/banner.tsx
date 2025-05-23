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
      <div className="flex justify-between h-[120px]">
        <div className="flex-1 px-6 flex flex-col justify-center h-full">
          <p className="text-gray-100 font-extrabold text-xl leading-tight">
            Formula1 Markets for Monaco GP 2025 are live on{' '}
            <span className="text-blue-400 inline-flex items-center">
              Base{' '}
              <Image
                src="/chain-icons/base.png"
                alt="Base Chain Icon"
                width={18}
                height={18}
                className="ml-1"
              />
            </span>
          </p>
          <p className="text-[#F19ED2] font-extrabold text-xl leading-tight mt-1">
            <span className="text-green-400">Long</span>/<span className="text-red-400">Short</span>{' '}
            your favourite markets
          </p>
          <p className="text-gray-300 text-sm font-semibold flex items-center mt-2">
            To create markets, please apply for the Creator
            role {/* <ArrowRight className="ml-1 w-4 h-4" /> */}
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
