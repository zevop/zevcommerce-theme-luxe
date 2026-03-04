'use client';

import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Multicolumn({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    columns = 3,
    title,
    description,
    backgroundColor,
    show_card_bg = true,
    card_bg = '#161513',
    section_padding = 'medium',
    image_ratio = 'square',
  } = settings;

  const paddingMap: Record<string, string> = {
    small: 'py-10',
    medium: 'py-20',
    large: 'py-32',
  };
  const sectionPadding = paddingMap[section_padding] || paddingMap.medium;

  const gridColsMap: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-3';

  const aspectMap: Record<string, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    circle: 'aspect-square',
  };
  const aspectClass = aspectMap[image_ratio] || 'aspect-square';
  const isCircle = image_ratio === 'circle';

  const cards = blocks.filter(b => b.type === 'card');
  const resolveImg = (img: any) => (typeof img === 'string' ? img : img?.url);

  return (
    <section
      className={sectionPadding}
      style={{ backgroundColor: backgroundColor || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {(title || description) && (
          <div className="text-center mb-14 max-w-2xl mx-auto">
            {title && (
              <h2
                className="text-2xl md:text-3xl tracking-widest uppercase mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
              >
                {title}
              </h2>
            )}
            {title && (
              <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: 'var(--color-accent)' }} />
            )}
            {description && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {cards.map((block, i) => {
            const s = block.settings || {};
            const imgSrc = resolveImg(s.image);

            return (
              <div
                key={i}
                className="group flex flex-col"
                style={
                  show_card_bg
                    ? {
                        backgroundColor: card_bg,
                        borderTop: '2px solid var(--color-accent)',
                      }
                    : { borderTop: '2px solid var(--color-accent)' }
                }
              >
                {imgSrc && (
                  <div
                    className={`overflow-hidden ${aspectClass} ${isCircle ? 'rounded-full mx-auto mt-6 w-32 h-32' : 'w-full'}`}
                    style={{ flexShrink: 0 }}
                  >
                    <img
                      src={imgSrc}
                      alt={s.heading || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  </div>
                )}

                <div className={`flex flex-col flex-1 ${show_card_bg ? 'p-6' : 'pt-6'}`}>
                  {s.heading && (
                    <h3
                      className="text-base tracking-widest uppercase mb-3"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
                    >
                      {s.heading}
                    </h3>
                  )}
                  {s.text && (
                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {s.text}
                    </p>
                  )}
                  {s.link_text && s.link && (
                    <a
                      href={s.link}
                      className="inline-block mt-5 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                    >
                      {s.link_text} &rarr;
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'multicolumn',
  name: 'Multi-Column',
  settings: [
    { type: 'text', id: 'title', label: 'Section Title' },
    { type: 'textarea', id: 'description', label: 'Section Description' },
    {
      type: 'select',
      id: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
      default: '3',
    },
    {
      type: 'select',
      id: 'image_ratio',
      label: 'Image Ratio',
      options: [
        { value: 'square', label: 'Square (1:1)' },
        { value: 'portrait', label: 'Portrait (3:4)' },
        { value: 'landscape', label: 'Landscape (16:9)' },
        { value: 'circle', label: 'Circle' },
      ],
      default: 'square',
    },
    { type: 'checkbox', id: 'show_card_bg', label: 'Show Card Background', default: true },
    { type: 'color', id: 'card_bg', label: 'Card Background Color', default: '#161513' },
    {
      type: 'select',
      id: 'section_padding',
      label: 'Section Padding',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      default: 'medium',
    },
    { type: 'color', id: 'backgroundColor', label: 'Section Background' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'card',
      name: 'Card',
      settings: [
        { type: 'image', id: 'image', label: 'Image' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'Card Heading' },
        { type: 'textarea', id: 'text', label: 'Text', default: 'Describe this feature or collection.' },
        { type: 'text', id: 'link', label: 'Link URL' },
        { type: 'text', id: 'link_text', label: 'Link Text' },
      ],
    },
  ]),
};
