'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Slideshow({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [current, setCurrent] = useState(0);

  const {
    height = 'full',
    autoPlay = true,
    interval = 5,
    alignment = 'center',
    vertical_alignment = 'center',
    transition = 'fade',
  } = settings;

  const slides = blocks.filter(b => b.type === 'slide');

  const heightMap: Record<string, string> = {
    small: 'min-h-[380px]',
    medium: 'min-h-[560px]',
    large: 'min-h-[720px]',
    full: 'min-h-screen',
  };
  const heightClass = heightMap[height] || heightMap.full;

  const next = useCallback(
    () => setCurrent(c => (c + 1) % Math.max(slides.length, 1)),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent(c => (c - 1 + slides.length) % Math.max(slides.length, 1)),
    [slides.length]
  );

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(next, interval * 1000);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, next]);

  const resolveImage = (img: any) => (typeof img === 'string' ? img : img?.url);

  // Alignment class maps
  const hAlignMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };
  const vAlignMap: Record<string, string> = {
    top: 'justify-start pt-24',
    center: 'justify-center',
    bottom: 'justify-end pb-24',
  };

  const hAlignClass = hAlignMap[alignment] || hAlignMap.center;
  const vAlignClass = vAlignMap[vertical_alignment] || vAlignMap.center;

  if (slides.length === 0) {
    return (
      <div
        className={`${heightClass} flex items-center justify-center`}
        style={{ backgroundColor: '#161513' }}
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text)' }}>
          Add slide blocks to this section
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative ${heightClass} overflow-hidden`}
      style={{ backgroundColor: '#0D0C0B' }}
    >
      {slides.map((slide, i) => {
        const s = slide.settings || {};
        const bgImage = resolveImage(s.image);
        const overlayOpacity = ((s.overlay_opacity ?? 50) / 100);
        const buttonStyle = s.button_style || 'outlined';

        // Transition classes
        const isActive = i === current;
        let transitionClass = '';
        if (transition === 'fade') {
          transitionClass = `transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`;
        } else {
          // slide transition: translate X
          const offset = i - current;
          transitionClass = `transition-transform duration-700 z-${isActive ? '10' : '0'}`;
          // For slide, use inline style below
        }

        const slideStyle: React.CSSProperties = {
          backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...(transition === 'slide'
            ? { transform: `translateX(${(i - current) * 100}%)`, transition: 'transform 700ms ease-in-out' }
            : {}),
        };

        return (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col ${hAlignClass} ${vAlignClass} ${transitionClass}`}
            style={slideStyle}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 sm:px-10 max-w-4xl">
              {s.heading && (
                <h2
                  className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
                >
                  {s.heading}
                </h2>
              )}

              {s.heading && (
                <div
                  className={`h-px mb-8 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}
                  style={{ width: '3rem', backgroundColor: 'var(--color-accent)' }}
                />
              )}

              {s.text && (
                <p
                  className="text-sm md:text-base leading-relaxed mb-8 max-w-xl opacity-90"
                  style={{
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-body)',
                    ...(alignment === 'center' ? { margin: '0 auto 2rem' } : {}),
                  }}
                >
                  {s.text}
                </p>
              )}

              {s.button_text && s.button_link && (
                <a
                  href={s.button_link}
                  className="inline-block text-xs tracking-widest uppercase px-8 py-3 transition-all duration-300"
                  style={
                    buttonStyle === 'filled'
                      ? {
                          backgroundColor: 'var(--color-accent)',
                          color: '#0D0C0B',
                          fontFamily: 'var(--font-body)',
                        }
                      : {
                          border: '1px solid var(--color-accent)',
                          color: 'var(--color-accent)',
                          fontFamily: 'var(--font-body)',
                        }
                  }
                >
                  {s.button_text}
                </a>
              )}
            </div>
          </div>
        );
      })}

      {/* Arrow navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? '1.75rem' : '0.375rem',
                height: '0.375rem',
                backgroundColor: i === current ? 'var(--color-accent)' : 'rgba(201,169,110,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const schema = {
  type: 'slideshow',
  name: 'Slideshow',
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'full', label: 'Full Screen' },
      ],
      default: 'full',
    },
    { type: 'checkbox', id: 'autoPlay', label: 'Auto-advance', default: true },
    {
      type: 'range',
      id: 'interval',
      label: 'Interval (seconds)',
      min: 2,
      max: 10,
      step: 1,
      default: 5,
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Horizontal Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'center',
    },
    {
      type: 'select',
      id: 'vertical_alignment',
      label: 'Vertical Alignment',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
      default: 'center',
    },
    {
      type: 'select',
      id: 'transition',
      label: 'Transition',
      options: [
        { value: 'fade', label: 'Fade' },
        { value: 'slide', label: 'Slide' },
      ],
      default: 'fade',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'slide',
      name: 'Slide',
      settings: [
        { type: 'image', id: 'image', label: 'Background Image' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'The Art of Luxury' },
        { type: 'textarea', id: 'text', label: 'Subtext' },
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Shop Now' },
        { type: 'text', id: 'button_link', label: 'Button Link', default: '/collections/all' },
        {
          type: 'select',
          id: 'button_style',
          label: 'Button Style',
          options: [
            { value: 'outlined', label: 'Outlined' },
            { value: 'filled', label: 'Filled (Gold)' },
          ],
          default: 'outlined',
        },
        {
          type: 'range',
          id: 'overlay_opacity',
          label: 'Overlay Opacity',
          min: 0,
          max: 100,
          step: 5,
          default: 50,
        },
      ],
    },
  ]),
};
