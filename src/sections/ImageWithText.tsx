'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ImageWithText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    image_position = 'left',
    min_height = 500,
    section_bg_color,
  } = settings;

  const resolveImage = (img: any): string | undefined => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const imgSrc = resolveImage(settings.image);
  const isReversed = image_position === 'right';
  const sectionBg = section_bg_color || 'var(--color-background)';

  return (
    <section style={{ backgroundColor: sectionBg }}>
      <div
        className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
        style={{ minHeight: `${min_height}px` }}
      >
        {/* Image — 60% width on desktop, full width stacked on mobile */}
        <div className="w-full lg:w-[60%] relative overflow-hidden" style={{ minHeight: '300px' }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
          )}
        </div>

        {/* Text Panel — 40% width on desktop */}
        <div
          className="w-full lg:w-[40%] flex flex-col justify-center px-8 py-14 md:px-12 lg:px-16 relative"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          {/* Gold top accent border — 2px, full width of panel */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '2px',
              backgroundColor: 'var(--color-accent, #C9A96E)',
            }}
          />

          <BlockRenderer
            blocks={blocks}
            sectionSettings={settings}
            className="flex flex-col items-start text-left gap-1"
          />
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'image_with_text',
  name: 'Image with Text',
  max_blocks: 5,
  settings: [
    { type: 'header', label: 'Media' },
    { type: 'image', id: 'image', label: 'Image' },
    {
      type: 'select',
      id: 'image_position',
      label: 'Image Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
    },
    { type: 'header', label: 'Layout' },
    {
      type: 'range',
      id: 'min_height',
      label: 'Minimum Height (px)',
      min: 400,
      max: 800,
      step: 50,
      default: 500,
    },
    { type: 'header', label: 'Colors' },
    { type: 'color', id: 'section_bg_color', label: 'Section Background' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Crafted with Purpose' },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'text',
      name: 'Description',
      settings: [
        {
          type: 'textarea',
          id: 'text',
          label: 'Text',
          default: 'Every piece in our collection is thoughtfully designed to stand the test of time. Refined materials, meticulous craftsmanship, and an unwavering commitment to quality.',
        },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'button',
      name: 'Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button Text', default: 'Discover More' },
        { type: 'text', id: 'link', label: 'Button Link', default: '/collections/all' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
  ]),
};
