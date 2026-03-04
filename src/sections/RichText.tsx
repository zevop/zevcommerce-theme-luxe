'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function RichText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    alignment = 'center',
    showAccentLine = true,
    padding = 'medium',
    backgroundColor,
  } = settings;

  const paddingMap: Record<string, string> = {
    small: 'py-10',
    medium: 'py-20',
    large: 'py-32',
  };
  const sectionPadding = paddingMap[padding] || paddingMap.medium;

  const alignMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center mx-auto',
  };
  const alignClass = alignMap[alignment] || alignMap.center;

  const accentAlignClass = alignment === 'center' ? 'mx-auto' : '';

  return (
    <section
      className={sectionPadding}
      style={{ backgroundColor: backgroundColor || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`max-w-2xl ${alignClass}`}>
          {/* Optional gold accent line above heading */}
          {showAccentLine && (
            <div
              className={`mb-8 ${accentAlignClass}`}
              style={{
                width: '60px',
                height: '1px',
                backgroundColor: 'var(--color-accent, #C9A96E)',
              }}
            />
          )}

          <BlockRenderer
            blocks={blocks}
            sectionSettings={settings}
            className={`flex flex-col ${alignClass} gap-1`}
          />
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'rich_text',
  name: 'Rich Text',
  max_blocks: 6,
  settings: [
    { type: 'header', label: 'Layout' },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'center',
    },
    {
      type: 'select',
      id: 'padding',
      label: 'Vertical Padding',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      default: 'medium',
    },
    { type: 'header', label: 'Accent' },
    { type: 'checkbox', id: 'showAccentLine', label: 'Show Gold Accent Line', default: true },
    { type: 'header', label: 'Colors' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Our Story' },
        { type: 'color', id: 'color', label: 'Color' },
      ],
    },
    {
      type: 'text',
      name: 'Text',
      settings: [
        {
          type: 'textarea',
          id: 'text',
          label: 'Text',
          default: 'Share your brand story with your customers.',
        },
        { type: 'color', id: 'color', label: 'Color' },
      ],
    },
    {
      type: 'button',
      name: 'Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button Text', default: 'Learn More' },
        { type: 'text', id: 'link', label: 'Link', default: '/' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
  ]),
};
