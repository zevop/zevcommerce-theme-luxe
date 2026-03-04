'use client';
import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Hero({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const storeName = storeConfig?.name || 'Store';

  const processedBlocks = blocks.map(block => {
    if (block.type === 'heading' && block.settings?.text) {
      return { ...block, settings: { ...block.settings, text: block.settings.text.replace(/\{\{store_name\}\}/g, storeName) } };
    }
    return block;
  });

  const heightMap: Record<string, string> = {
    small: 'min-h-[500px]',
    medium: 'min-h-[650px]',
    large: 'min-h-[800px]',
    full: 'min-h-screen',
  };
  const heightClass = heightMap[settings.height] || heightMap.full;

  const alignMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };
  const alignClass = alignMap[settings.alignment] || alignMap.left;

  const vAlignMap: Record<string, string> = {
    top: 'justify-start pt-32',
    center: 'justify-center',
    bottom: 'justify-end pb-20 md:pb-28',
  };
  const vAlignClass = vAlignMap[settings.vertical_alignment] || vAlignMap.bottom;

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(settings.bg_image);
  const overlayColor = settings.overlay_color || '#0D0C0B';
  const overlayOpacity = (settings.overlay_opacity ?? 65) / 100;
  const sectionBgColor = settings.section_bg_color || '#0D0C0B';

  const layout = settings.layout || 'overlay';

  // Decorative gold rule rendered after heading blocks
  const blocksWithRule: any[] = [];
  let ruleInserted = false;
  for (const block of processedBlocks) {
    blocksWithRule.push(block);
    if (!ruleInserted && block.type === 'heading') {
      blocksWithRule.push({ __goldRule: true });
      ruleInserted = true;
    }
  }

  const GoldRule = () => (
    <div
      style={{
        width: '60px',
        height: '1px',
        backgroundColor: '#C9A96E',
        flexShrink: 0,
      }}
    />
  );

  // Split layout
  if (layout === 'split') {
    return (
      <div
        className={`${heightClass} flex flex-col md:flex-row`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {/* Left dark panel */}
        <div
          className="flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20 w-full md:w-1/2 flex-shrink-0"
          style={{ backgroundColor: sectionBgColor }}
        >
          <div className="flex flex-col items-start text-left gap-5 max-w-lg">
            {blocksWithRule.map((block, i) =>
              (block as any).__goldRule ? (
                <GoldRule key={`rule-${i}`} />
              ) : (
                <BlockRenderer
                  key={i}
                  blocks={[block]}
                  sectionSettings={settings}
                  className="w-full flex flex-col items-start text-left gap-1"
                />
              )
            )}
          </div>
        </div>
        {/* Right image panel */}
        <div
          className="relative flex-1 min-h-[300px] md:min-h-0"
          style={
            bgImage
              ? { backgroundImage: `url("${bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: '#161513' }
          }
        >
          {!bgImage && <div className="absolute inset-0" style={{ backgroundColor: '#161513' }} />}
        </div>
      </div>
    );
  }

  // Text-only layout
  if (layout === 'text_only') {
    return (
      <div
        className={`relative flex flex-col w-full ${heightClass} items-center justify-center`}
        style={{ backgroundColor: sectionBgColor, fontFamily: 'var(--font-body)' }}
      >
        <div className="container mx-auto px-6 sm:px-8 py-20">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            {blocksWithRule.map((block, i) =>
              (block as any).__goldRule ? (
                <GoldRule key={`rule-${i}`} />
              ) : (
                <BlockRenderer
                  key={i}
                  blocks={[block]}
                  sectionSettings={settings}
                  className="w-full flex flex-col items-center text-center gap-1"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: overlay layout
  const sectionStyle: React.CSSProperties = {
    backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: !bgImage ? sectionBgColor : undefined,
    fontFamily: 'var(--font-body)',
  };

  const isCenter = settings.alignment === 'center';
  const isRight = settings.alignment === 'right';

  return (
    <div
      className={`relative flex flex-col w-full ${heightClass} ${vAlignClass}`}
      style={sectionStyle}
    >
      {/* Dark overlay */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />
      )}

      <div className="relative z-10 container mx-auto px-6 sm:px-8 py-16 w-full">
        <div
          className={`flex flex-col gap-5 max-w-2xl ${isCenter ? 'mx-auto' : isRight ? 'ml-auto' : ''}`}
        >
          <div className={`flex flex-col ${alignClass} gap-5`}>
            {blocksWithRule.map((block, i) =>
              (block as any).__goldRule ? (
                <GoldRule key={`rule-${i}`} />
              ) : (
                <BlockRenderer
                  key={i}
                  blocks={[block]}
                  sectionSettings={settings}
                  className={`w-full flex flex-col ${alignClass} gap-1`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'hero',
  name: 'Hero Banner',
  max_blocks: 6,
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Section Height',
      options: [
        { value: 'small', label: 'Small (500px)' },
        { value: 'medium', label: 'Medium (650px)' },
        { value: 'large', label: 'Large (800px)' },
        { value: 'full', label: 'Full Screen' },
      ],
      default: 'full',
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'overlay', label: 'Text Over Image' },
        { value: 'split', label: 'Split (Dark Panel + Image)' },
        { value: 'text_only', label: 'Text Only (No Image)' },
      ],
      default: 'overlay',
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
    },
    {
      type: 'select',
      id: 'vertical_alignment',
      label: 'Vertical Position',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
      default: 'bottom',
    },
    { type: 'image', id: 'bg_image', label: 'Background Image' },
    { type: 'color', id: 'overlay_color', label: 'Overlay Color', default: '#0D0C0B' },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Overlay Opacity',
      min: 0,
      max: 100,
      step: 5,
      default: 65,
    },
    { type: 'color', id: 'section_bg_color', label: 'Background Color (no image)', default: '#0D0C0B' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Crafted for the Discerning' },
        {
          type: 'select',
          id: 'tag',
          label: 'HTML Tag',
          options: [
            { value: 'h1', label: 'H1' },
            { value: 'h2', label: 'H2' },
          ],
          default: 'h1',
        },
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
          label: 'Text content',
          default: 'Exclusive collections for those who appreciate the exceptional.',
        },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'button',
      name: 'Primary Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button text', default: 'Explore Collection' },
        { type: 'text', id: 'link', label: 'Button link', default: '/collections/all' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
    {
      type: 'button',
      name: 'Secondary Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button text', default: 'Our Story' },
        { type: 'text', id: 'link', label: 'Button link', default: '/pages/about' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
  ]),
};
