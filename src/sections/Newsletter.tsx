'use client';
import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Newsletter({ settings, blocks }: { settings: any; blocks: any[] }) {
  const backgroundColor = settings.backgroundColor || '#0D0C0B';
  const overlayOpacity = (settings.overlayOpacity ?? 80) / 100;
  const padding = settings.padding || 'medium';

  const paddingMap: Record<string, string> = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-32',
  };
  const sectionPadding = paddingMap[padding] || paddingMap.medium;

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(settings.backgroundImage);

  // Separate email_signup blocks so we can render them with custom input UI
  const contentBlocks = blocks.filter(b => b.type !== 'email_signup');
  const emailBlocks = blocks.filter(b => b.type === 'email_signup');

  return (
    <section
      className={`relative ${sectionPadding} overflow-hidden`}
      style={{
        backgroundColor,
        backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Background overlay */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: '#0D0C0B', opacity: overlayOpacity }}
        />
      )}

      <div className="relative z-10 container mx-auto px-6 sm:px-8 text-center max-w-2xl">
        {/* Gold separator above heading */}
        <div
          className="mx-auto mb-8"
          style={{ width: '60px', height: '2px', backgroundColor: '#C9A96E' }}
        />

        {/* Heading + text blocks */}
        {contentBlocks.length > 0 && (
          <BlockRenderer
            blocks={contentBlocks}
            sectionSettings={settings}
            className="flex flex-col items-center text-center gap-3 mb-10"
          />
        )}

        {/* Email signup blocks — rendered with Luxe-styled input */}
        {emailBlocks.map((block, i) => {
          const placeholder = block.settings?.placeholder || 'Your email address';
          const buttonText = block.settings?.button_text || 'Subscribe';

          return (
            <form
              key={i}
              className="flex flex-col sm:flex-row items-stretch gap-0 w-full max-w-lg mx-auto"
              onSubmit={e => e.preventDefault()}
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder={placeholder}
                  className="w-full h-14 px-5 text-sm outline-none"
                  style={{
                    backgroundColor: '#161513',
                    color: '#C4BDB4',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: '2px solid #C9A96E',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.04em',
                  }}
                />
              </div>
              <button
                type="submit"
                className="h-14 px-10 text-[11px] font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-80 flex-shrink-0"
                style={{
                  backgroundColor: '#C9A96E',
                  color: '#0D0C0B',
                  borderRadius: 0,
                  fontFamily: 'var(--font-body)',
                  border: 'none',
                }}
              >
                {buttonText}
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}

export const schema = {
  type: 'newsletter',
  name: 'Newsletter',
  max_blocks: 4,
  settings: [
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#0D0C0B' },
    { type: 'image', id: 'backgroundImage', label: 'Background Image' },
    {
      type: 'range',
      id: 'overlayOpacity',
      label: 'Image Overlay Opacity',
      min: 0,
      max: 100,
      step: 5,
      default: 80,
    },
    {
      type: 'select',
      id: 'padding',
      label: 'Section Padding',
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
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Join the Inner Circle' },
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
          default: 'Be first to discover new arrivals and exclusive offers.',
        },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'email_signup',
      name: 'Email Signup',
      settings: [
        { type: 'text', id: 'placeholder', label: 'Placeholder', default: 'Your email address' },
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Subscribe' },
      ],
    },
  ]),
};
