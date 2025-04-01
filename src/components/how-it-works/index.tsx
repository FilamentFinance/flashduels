'use client';
import { FC, useCallback, useEffect, useState } from 'react';
import Bootstrapping from './boot-strapping';
import Conclusion from './conclusion';
import CreateADuel from './create-a-duel';

interface HowItWorksProps {
  onClose?: () => void;
}

const HowItWorks: FC<HowItWorksProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setCurrentSlide((prev) => (prev - 1 + 3) % 3);
          setIsAutoPlay(false);
          break;
        case 'ArrowRight':
          setCurrentSlide((prev) => (prev + 1) % 3);
          setIsAutoPlay(false);
          break;
        case 'Space':
          e.preventDefault();
          setIsAutoPlay((prev) => !prev);
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const slides = [
    { component: <CreateADuel />, id: 0 },
    { component: <Bootstrapping />, id: 1 },
    { component: <Conclusion />, id: 2 },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    setIsAutoPlay(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
    setIsAutoPlay(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="howItWorksTitle"
    >
      <div className="relative w-full max-w-[1400px] h-[600px] flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-pink-300 bg-opacity-20 hover:bg-opacity-30 transition-all"
          aria-label="Close how it works"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <h1 id="howItWorksTitle" className="text-4xl font-bold text-stone-200 mb-16">
          How it Works
        </h1>

        <div className="relative w-full h-full flex items-center justify-center">
          {/* Carousel Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            role="region"
            aria-roledescription="carousel"
            aria-label="How it works steps"
          >
            {slides.map((slide, index) => {
              const diff = (index - currentSlide + 3) % 3;
              const transformStyles = {
                0: 'scale(1) translateX(0) translateZ(0) rotateY(0deg)',
                1: 'scale(0.85) translateX(50%) translateZ(-100px) rotateY(15deg)',
                2: 'scale(0.85) translateX(-50%) translateZ(-100px) rotateY(-15deg)',
              };

              return (
                <div
                  key={slide.id}
                  className="absolute transition-all duration-500 ease-in-out w-[413px] h-[500px]"
                  style={{
                    transform: transformStyles[diff as keyof typeof transformStyles],
                    opacity: diff === 0 ? 1 : 0.6,
                    zIndex: 3 - diff,
                  }}
                  role="tabpanel"
                  aria-hidden={currentSlide !== index}
                  tabIndex={currentSlide === index ? 0 : -1}
                >
                  <div className="w-full h-full">{slide.component}</div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-pink-300 bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all z-10"
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-300 bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all z-10"
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2"
            role="tablist"
            aria-label="Slides"
          >
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlay(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-pink-300' : 'bg-gray-500'
                }`}
                role="tab"
                aria-selected={currentSlide === index}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
