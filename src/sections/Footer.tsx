'use client';

import { useTheme, BlockRenderer, resolveMenuUrl } from '@zevcommerce/storefront-api';
import { getSharedBlocks, withColumnSettings } from '@zevcommerce/theme-sdk';

// ─── Colours ─────────────────────────────────────────────────────────────────
const DARK_BG   = '#0D0C0B';
const GOLD      = '#C9A96E';
const HEADING   = '#EDE8E0';
const MUTED     = '#8A8279';
const BORDER    = '#252320';

export default function Footer({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();

  const {
    layout          = 'centered',
    description,
    // backgroundColor and textColor are schema-controlled but the Luxe footer
    // is always dark — we use the schema values only for the link colour override.
    backgroundColor = DARK_BG,
    textColor       = MUTED,
  } = settings;

  const storeName = storeConfig?.name || 'Store';
  const logoSrc   = storeConfig?.storeLogo;

  // ─── Logo / Brand block ───────────────────────────────────────────────────
  const BrandBlock = () => (
    <div className={layout === 'centered' ? 'text-center' : 'text-left'}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={storeName}
          className={`h-9 w-auto object-contain ${layout === 'centered' ? 'mx-auto' : ''}`}
        />
      ) : (
        <span
          className="text-2xl tracking-[0.06em] leading-none"
          style={{ fontFamily: 'var(--font-heading)', color: HEADING }}
        >
          {storeName}
        </span>
      )}
      {description && (
        <p
          className={`text-[13px] leading-relaxed mt-4 max-w-xs ${layout === 'centered' ? 'mx-auto' : ''}`}
          style={{ color: textColor, fontFamily: 'var(--font-body)' }}
        >
          {description}
        </p>
      )}
      {/* Thin gold rule below brand in centered layout */}
      {layout === 'centered' && (
        <div
          className="mx-auto mt-8 mb-2"
          style={{ width: '40px', height: '1px', backgroundColor: GOLD }}
          aria-hidden="true"
        />
      )}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <footer
      style={{
        backgroundColor: DARK_BG, // Always dark — ignores CSS var
        borderTop: `1px solid ${GOLD}`,
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="container mx-auto px-5 sm:px-8 pt-20 pb-12">
        {layout === 'centered' ? (
          /* ── Centered layout ─────────────────────────────────────────────── */
          <div className="flex flex-col items-center">
            {/* Brand */}
            <BrandBlock />

            {/* 4-column link grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10 w-full max-w-4xl mt-10 mb-14">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="space-y-3 [&_a]:block [&_a]:text-[12px] [&_a]:uppercase [&_a]:tracking-[0.12em] [&_a]:transition-colors [&_a]:py-0.5"
                  style={
                    {
                      '--link-color': textColor,
                      '--link-hover': GOLD,
                    } as React.CSSProperties
                  }
                >
                  <BlockRenderer blocks={blocks} columnIndex={idx} />
                </div>
              ))}
            </div>

            {/* Thin divider */}
            <div className="w-full mb-8" style={{ height: '1px', backgroundColor: BORDER }} />

            {/* Social icons row */}
            <SocialRow blocks={blocks} />
          </div>
        ) : (
          /* ── Standard layout: brand col + 3 link cols ────────────────────── */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Column 0: brand + social */}
              <div className="space-y-6">
                <BrandBlock />
                {/* Social in first col for standard layout */}
                <SocialRow blocks={blocks} justify="start" />
              </div>

              {/* Columns 1–3: link lists */}
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="space-y-3 [&_a]:block [&_a]:text-[12px] [&_a]:uppercase [&_a]:tracking-[0.12em] [&_a]:transition-colors [&_a]:py-0.5"
                >
                  <BlockRenderer blocks={blocks} columnIndex={idx} />
                </div>
              ))}
            </div>

            {/* Thin divider */}
            <div className="mt-16 mb-0" style={{ height: '1px', backgroundColor: BORDER }} />
          </div>
        )}
      </div>

      {/* Global link colour overrides — applied via CSS since BlockRenderer renders its own elements */}
      <style>{`
        footer .luxe-footer-link,
        footer a:not([class*="text-"]) {
          color: ${textColor};
          text-decoration: none;
          transition: color 0.2s ease;
        }
        footer a:not([class*="text-"]):hover,
        footer .luxe-footer-link:hover {
          color: ${GOLD};
        }
        footer [class*="text-xs"],
        footer [class*="text-sm"] {
          color: ${textColor};
        }
        /* Column heading style */
        footer h4, footer h5, footer strong {
          color: ${HEADING};
          font-family: var(--font-heading);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: block;
        }
      `}</style>
    </footer>
  );
}

// ─── Social icons row ─────────────────────────────────────────────────────────
function SocialRow({
  blocks,
  justify = 'center',
}: {
  blocks: any[];
  justify?: 'center' | 'start';
}) {
  const socialBlocks = blocks.filter((b) => b.type === 'social_link');
  if (socialBlocks.length === 0) return null;

  return (
    <div className={`flex items-center gap-5 ${justify === 'center' ? 'justify-center' : 'justify-start'}`}>
      {socialBlocks.map((block, i) => {
        const { platform, url, icon_color } = block.settings || {};
        const iconColor = icon_color || MUTED;
        return (
          <a
            key={i}
            href={url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            style={{ color: iconColor, transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = iconColor)}
          >
            <PlatformIcon platform={platform} />
          </a>
        );
      })}
    </div>
  );
}

// ─── Inline SVG platform icons ────────────────────────────────────────────────
function PlatformIcon({ platform }: { platform: string }) {
  const size = 18;
  switch (platform) {
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.04a8.28 8.28 0 0 0 4.84 1.55V7.14a4.85 4.85 0 0 1-1.07-.45z"/>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
  }
}

// ─── Schema ───────────────────────────────────────────────────────────────────
export const schema = {
  type: 'footer',
  name: 'Footer',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'centered', label: 'Centered' },
        { value: 'standard', label: 'Standard (4 Columns)' },
      ],
      default: 'centered',
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Store Description',
      default: 'Crafted for those who demand nothing less than exceptional.',
    },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#0D0C0B' },
    { type: 'color', id: 'textColor',       label: 'Link / Text Color', default: '#8A8279' },
  ],
  blocks: getSharedBlocks(
    [
      {
        type: 'link_list',
        name: 'Link List',
        settings: [
          { type: 'text',      id: 'title', label: 'Column Title', default: 'Quick Links' },
          { type: 'link_list', id: 'menu',  label: 'Select Menu',  default: 'footer' },
        ],
      },
      {
        type: 'social_link',
        name: 'Social Link',
        settings: [
          {
            type: 'select',
            id: 'platform',
            label: 'Platform',
            options: [
              { value: 'facebook',  label: 'Facebook'  },
              { value: 'twitter',   label: 'Twitter'   },
              { value: 'instagram', label: 'Instagram' },
              { value: 'linkedin',  label: 'LinkedIn'  },
              { value: 'youtube',   label: 'YouTube'   },
              { value: 'tiktok',    label: 'TikTok'    },
            ],
            default: 'instagram',
          },
          { type: 'text',  id: 'url',        label: 'Link URL',   default: 'https://instagram.com' },
          { type: 'color', id: 'icon_color', label: 'Icon Color', default: '#8A8279' },
        ],
      },
    ],
    withColumnSettings
  ),
};
