'use client';

const SPEED_MAP: Record<string, number> = {
  slow: 50,
  medium: 30,
  fast: 15,
};

export default function Marquee({ settings }: { settings: any }) {
  const {
    mode = 'gold_on_dark',
    speed = 'medium',
    separator = '◆',
    backgroundColor = '',
    textColor = '',
    items = 'New Arrivals|Exclusive Pieces|Free Shipping Over $100|Handcrafted Quality',
  } = settings;

  const isGoldOnDark = mode === 'gold_on_dark';

  const resolvedBg = backgroundColor || (isGoldOnDark ? '#0D0C0B' : '#C9A96E');
  const resolvedText = textColor || (isGoldOnDark ? '#C9A96E' : '#0D0C0B');

  const parsedItems: string[] = items
    .split('|')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const durationSeconds = SPEED_MAP[speed] ?? 30;

  // Build a single flat list of tokens: item, sep, item, sep … for one track
  const tokens: { type: 'item' | 'sep'; value: string }[] = [];
  parsedItems.forEach((item, idx) => {
    tokens.push({ type: 'item', value: item });
    if (idx < parsedItems.length - 1 || parsedItems.length > 1) {
      tokens.push({ type: 'sep', value: separator });
    }
  });

  const trackContent = (keyOffset: number) =>
    tokens.map((token, i) => (
      <span
        key={`${keyOffset}-${i}`}
        className={
          token.type === 'sep'
            ? 'mx-5 opacity-60 text-[9px]'
            : 'text-[11px] uppercase tracking-widest font-medium'
        }
      >
        {token.value}
      </span>
    ));

  return (
    <section
      className="w-full overflow-hidden py-3"
      style={{
        backgroundColor: resolvedBg,
        fontFamily: 'var(--font-body)',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes luxe-marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .luxe-marquee-track {
              animation: luxe-marquee ${durationSeconds}s linear infinite;
              will-change: transform;
            }
          `,
        }}
      />

      <div className="flex whitespace-nowrap">
        {/* Track 1 */}
        <div
          className="luxe-marquee-track flex shrink-0 min-w-full items-center"
          style={{ color: resolvedText }}
          aria-hidden="false"
        >
          {trackContent(0)}
          {/* trailing separator to bridge into track 2 */}
          <span className="mx-5 opacity-60 text-[9px]">{separator}</span>
        </div>

        {/* Track 2 — clone for seamless loop */}
        <div
          className="luxe-marquee-track flex shrink-0 min-w-full items-center"
          style={{ color: resolvedText }}
          aria-hidden="true"
        >
          {trackContent(1)}
          <span className="mx-5 opacity-60 text-[9px]">{separator}</span>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'marquee',
  name: 'Marquee',
  settings: [
    {
      type: 'text',
      id: 'items',
      label: 'Items (pipe-separated)',
      default: 'New Arrivals|Exclusive Pieces|Free Shipping Over $100|Handcrafted Quality',
      info: 'Separate each item with a | character.',
    },
    {
      type: 'select',
      id: 'mode',
      label: 'Appearance',
      options: [
        { value: 'gold_on_dark', label: 'Gold on Dark' },
        { value: 'dark_on_gold', label: 'Dark on Gold' },
      ],
      default: 'gold_on_dark',
    },
    {
      type: 'select',
      id: 'speed',
      label: 'Speed',
      options: [
        { value: 'slow', label: 'Slow' },
        { value: 'medium', label: 'Medium' },
        { value: 'fast', label: 'Fast' },
      ],
      default: 'medium',
    },
    {
      type: 'text',
      id: 'separator',
      label: 'Separator Character',
      default: '◆',
    },
    {
      type: 'color',
      id: 'backgroundColor',
      label: 'Background Color Override',
      default: '',
      info: 'Leave empty to use the mode default.',
    },
    {
      type: 'color',
      id: 'textColor',
      label: 'Text Color Override',
      default: '',
      info: 'Leave empty to use the mode default.',
    },
  ],
};
