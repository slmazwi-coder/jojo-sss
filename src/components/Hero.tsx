import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const slides = [
  { url: '/assets/hero/images (2).jpeg', caption: 'Academic excellence' },
  { url: '/assets/hero/images (1).jpeg', caption: 'Discipline and pride' },
  { url: '/assets/hero/3e7e487a933835fd2aa5936d57c7cdd6.png', caption: 'Our team and community' },
  { url: '/assets/hero/d8d53f724e0b195658e83c643a6b491e.png', caption: 'Celebrating achievements' },
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentIndex];
  const showImage = !!slide.url && !failed[currentIndex];

  return (
    <div className="relative h-[650px] w-full overflow-hidden" style={{ background: '#7B1C2E' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.995 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {showImage ? (
            <img
              src={slide.url}
              alt={slide.caption}
              className="h-full w-full object-cover object-center opacity-40"
              onError={() => setFailed((p) => ({ ...p, [currentIndex]: true }))}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center opacity-80"
              style={{ background: 'linear-gradient(135deg, #7B1C2E 0%, #540D1C 50%, #3A0812 100%)' }}>
              <div className="text-center px-6" style={{ color: 'rgba(200,164,0,0.5)' }}>
                <div className="mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(200,164,0,0.1)', border: '1px solid rgba(200,164,0,0.2)' }}>
                  <ImageIcon />
                </div>
                <div className="font-semibold">Hero image placeholder</div>
                <div className="text-sm" style={{ color: 'rgba(200,164,0,0.4)' }}>
                  Add images to <span className="font-mono">public/assets/hero/</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(58,8,18,0.85) 0%, rgba(123,28,46,0.5) 50%, transparent 100%)' }} />

          <div className="absolute bottom-20 left-0 right-0 text-center z-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`caption-${currentIndex}`}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-lg md:text-xl font-medium tracking-wide uppercase"
              style={{ color: 'rgba(200,164,0,0.9)' }}
            >
              {slide.caption}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" style={{ zIndex: 10 }}>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl md:text-6xl font-bold mb-4 uppercase"
          style={{ color: '#C8A400' }}
        >
          Ludidi SSS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className="text-lg md:text-2xl font-light italic"
          style={{ color: 'rgba(200,164,0,0.8)' }}
        >
          "Amidst difficulties we rise"
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          className="mt-8 flex gap-4"
        >
          <a href="/admissions"
            className="px-6 py-2 font-semibold transition-colors"
            style={{ background: '#C8A400', color: '#7B1C2E', borderRadius: '0.5rem' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F0C800')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C8A400')}
          >
            Admissions
          </a>
          <a href="/about"
            className="px-6 py-2 font-semibold transition-colors"
            style={{ border: '2px solid #C8A400', color: '#C8A400', borderRadius: '0.5rem', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,164,0,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Learn More
          </a>
        </motion.div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
        style={{ background: 'rgba(200,164,0,0.2)', color: '#C8A400' }}
        aria-label="Previous slide"
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,164,0,0.4)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,164,0,0.2)')}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
        style={{ background: 'rgba(200,164,0,0.2)', color: '#C8A400' }}
        aria-label="Next slide"
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,164,0,0.4)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,164,0,0.2)')}
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 30 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="h-2 w-2 rounded-full transition-colors"
            style={{ background: i === currentIndex ? '#C8A400' : 'rgba(200,164,0,0.35)' }}
          />
        ))}
      </div>
    </div>
  );
};
