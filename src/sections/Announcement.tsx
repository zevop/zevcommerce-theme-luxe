'use client';

export default function Announcement({ settings }: { settings: any }) {
  const {
    text = 'Free shipping on orders over $100 · New arrivals weekly',
    backgroundColor = '#C9A96E',
    textColor = '#0D0C0B',
    link = '',
    linkText = '',
  } = settings;

  const content = (
    <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.15em] font-medium">{text}</p>
      {linkText && link && (
        <a
          href={link}
          className="text-[11px] uppercase tracking-[0.15em] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {linkText}
        </a>
      )}
    </div>
  );

  return (
    <div
      className="py-2.5"
      style={{ backgroundColor, color: textColor, fontFamily: 'var(--font-body)' }}
    >
      {link && !linkText ? (
        <a href={link} className="block hover:opacity-90 transition-opacity">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export const schema = {
  type: 'announcement',
  name: 'Announcement Bar',
  settings: [
    {
      type: 'text',
      id: 'text',
      label: 'Announcement Text',
      default: 'Free shipping on orders over $100 · New arrivals weekly',
    },
    { type: 'text', id: 'link', label: 'Link URL', default: '' },
    { type: 'text', id: 'linkText', label: 'Link Text', default: '' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#C9A96E' },
    { type: 'color', id: 'textColor', label: 'Text Color', default: '#0D0C0B' },
  ],
};
