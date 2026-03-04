'use client';

import { useState, useEffect, useRef } from 'react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Testimonials({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const backgroundColor = settings.backgroundColor || '#0D0C0B';
  const textColor = settings.textColor || '#EDE8E0';
  const autoPlay = settings.autoPlay !== false;
  const intervalSeconds = settings.interval ?? 5;

  const testimonials = blocks.filter(b => b.type === 'testimonial');

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const goTo = (index: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 300);
  };

  const prev = () => {
    goTo((current - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    goTo((current + 1) % testimonials.length);
  };

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(c => (c + 1) % testimonials.length);
        setVisible(true);
      }, 300);
    }, intervalSeconds * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, intervalSeconds, testimonials.length, current]);

  if (testimonials.length === 0) {
    return (
      <section
        className="py-24 text-center"
        style={{ backgroundColor, fontFamily: 'var(--font-body)' }}
      >
        <p className="text-sm uppercase tracking-widest" style={{ color: '#5A5550' }}>
          Add testimonial blocks to this section
        </p>
      </section>
    );
  }

  const active = testimonials[current]?.settings || {};
  const photoUrl = resolveImage(active.photo);

  // Navigation arrow SVG (thin, minimal)
  const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor, fontFamily: 'var(--font-body)' }}
    >
      <div className="container mx-auto px-6 sm:px-8 max-w-4xl text-center">
        {/* Decorative oversized quote mark — absolute, faint gold */}
        <div
          className="absolute left-1/2 select-none pointer-events-none"
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
            fontSize: '200px',
            lineHeight: 1,
            color: '#C9A96E',
            opacity: 0.10,
            top: '20px',
            transform: 'translateX(-50%)',
            userSelect: 'none',
          }}
        >
          &ldquo;
        </div>

        {/* Quote + author — cross-fade via opacity transition */}
        <div
          className="relative z-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {/* Quote text */}
          <blockquote
            className="text-5xl md:text-6xl leading-tight font-light mb-12"
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              color: textColor,
              fontStyle: 'italic',
            }}
          >
            {active.quote || 'Add a quote in the block settings.'}
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center gap-3">
            {photoUrl && (
              <img
                src={photoUrl}
                alt={active.author || ''}
                className="w-10 h-10 rounded-full object-cover"
                style={{ filter: 'grayscale(100%)' }}
              />
            )}

            {active.author && (
              <p
                className="uppercase tracking-[0.2em] text-[11px] font-medium"
                style={{ color: '#C9A96E' }}
              >
                {active.author}
              </p>
            )}

            {active.title && (
              <p className="text-xs" style={{ color: '#5A5550', letterSpacing: '0.05em' }}>
                {active.title}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-14">
            {/* Prev */}
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                border: '1px solid #C9A96E',
                borderRadius: 0,
                color: '#C9A96E',
                backgroundColor: 'transparent',
              }}
              aria-label="Previous testimonial"
            >
              <ArrowLeft />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === current ? '20px' : '6px',
                    height: '2px',
                    backgroundColor: i === current ? '#C9A96E' : '#3A3530',
                    border: 'none',
                    borderRadius: 0,
                    padding: 0,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                border: '1px solid #C9A96E',
                borderRadius: 0,
                color: '#C9A96E',
                backgroundColor: 'transparent',
              }}
              aria-label="Next testimonial"
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'testimonials',
  name: 'Testimonials',
  settings: [
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#0D0C0B' },
    { type: 'color', id: 'textColor', label: 'Quote Text Color', default: '#EDE8E0' },
    { type: 'checkbox', id: 'autoPlay', label: 'Auto-Advance Slides', default: true },
    {
      type: 'range',
      id: 'interval',
      label: 'Interval (seconds)',
      min: 3,
      max: 10,
      step: 1,
      default: 5,
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'testimonial',
      name: 'Testimonial',
      settings: [
        {
          type: 'textarea',
          id: 'quote',
          label: 'Quote',
          default: 'An unparalleled experience. The craftsmanship is exceptional in every detail.',
        },
        { type: 'text', id: 'author', label: 'Author Name', default: 'Alexandra R.' },
        { type: 'text', id: 'title', label: 'Author Title', default: 'Verified Client' },
        { type: 'image', id: 'photo', label: 'Author Photo' },
      ],
    },
  ]),
};
