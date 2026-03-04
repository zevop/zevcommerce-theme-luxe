'use client';

import { useTheme } from '@zevcommerce/storefront-api';

export default function Copyright({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const storeName = storeConfig?.name || 'Store';
  const year = new Date().getFullYear();

  const {
    copyrightText = '',
    backgroundColor = '#0D0C0B',
    textColor = '#5A5550',
    showBorder = true,
  } = settings;

  return (
    <div
      className={`py-5 ${showBorder ? 'border-t' : ''}`}
      style={{
        backgroundColor,
        color: textColor,
        borderColor: '#252320',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.15em]">
          {copyrightText || `© ${year} ${storeName}. All rights reserved.`}
        </p>
      </div>
    </div>
  );
}

export const schema = {
  type: 'copyright',
  name: 'Copyright Bar',
  settings: [
    { type: 'text', id: 'copyrightText', label: 'Copyright Text', default: '' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#0D0C0B' },
    { type: 'color', id: 'textColor', label: 'Text Color', default: '#5A5550' },
    { type: 'checkbox', id: 'showBorder', label: 'Show Top Border', default: true },
  ],
};
