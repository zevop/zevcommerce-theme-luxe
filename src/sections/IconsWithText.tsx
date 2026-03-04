import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function IconsWithText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    title,
    columns = 3,
    iconStyle = 'badge',
    backgroundColor,
    padding = 'medium',
  } = settings;

  const paddingMap: Record<string, string> = {
    small: 'py-10',
    medium: 'py-20',
    large: 'py-32',
  };
  const sectionPadding = paddingMap[padding] || paddingMap.medium;

  const gridColsMap: Record<number | string, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-3';

  const items = blocks.filter(b => b.type === 'icon_item');

  return (
    <section
      className={sectionPadding}
      style={{ backgroundColor: backgroundColor || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {title && (
          <div className="text-center mb-14">
            <h2
              className="text-2xl md:text-3xl tracking-widest uppercase mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
            >
              {title}
            </h2>
            <div className="w-12 h-px mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols} gap-10`}>
          {items.map((block, i) => {
            const s = block.settings || {};
            const icon = s.icon || '◆';

            return (
              <div key={i} className="text-center flex flex-col items-center">
                {/* Icon */}
                {iconStyle === 'badge' ? (
                  <div
                    className="w-14 h-14 flex items-center justify-center mb-5 flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    <span
                      className="text-xl leading-none select-none"
                      style={{ color: '#0D0C0B', fontFamily: 'var(--font-body)' }}
                    >
                      {icon}
                    </span>
                  </div>
                ) : (
                  <div className="mb-5 flex-shrink-0">
                    <span
                      className="text-2xl leading-none select-none"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {icon}
                    </span>
                  </div>
                )}

                {/* Gold rule between icon and heading */}
                <div
                  className="w-8 h-px mb-5"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />

                {s.heading && (
                  <h3
                    className="text-xl mb-3 tracking-wide"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
                  >
                    {s.heading}
                  </h3>
                )}
                {s.text && (
                  <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                  >
                    {s.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'icons_with_text',
  name: 'Icons with Text',
  settings: [
    { type: 'text', id: 'title', label: 'Section Title' },
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
      id: 'iconStyle',
      label: 'Icon Style',
      options: [
        { value: 'badge', label: 'Badge (gold square)' },
        { value: 'minimal', label: 'Minimal (character only)' },
      ],
      default: 'badge',
    },
    { type: 'color', id: 'backgroundColor', label: 'Background Color' },
    {
      type: 'select',
      id: 'padding',
      label: 'Padding',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      default: 'medium',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'icon_item',
      name: 'Icon Item',
      settings: [
        { type: 'text', id: 'icon', label: 'Icon (emoji or symbol)', default: '◆' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'Crafted Excellence' },
        {
          type: 'textarea',
          id: 'text',
          label: 'Description',
          default: 'Every detail considered, every material chosen with intention.',
        },
      ],
    },
  ]),
};
