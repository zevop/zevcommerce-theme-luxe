'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme, getCollections, getStorePermalink } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function CollectionList({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const domain = storeConfig?.handle || '';

  const { layout = 'grid', columns = 3, title, description, padding_y = 'large' } = settings;

  const paddingMap: Record<string, string> = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24',
  };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  const collectionItems = blocks.filter(b => b.type === 'collection_item');

  useEffect(() => {
    async function load() {
      if (!domain) { setLoading(false); return; }
      try {
        const data = await getCollections(domain);
        setCollections(data || []);
      } catch { /* empty */ } finally { setLoading(false); }
    }
    if (collectionItems.length === 0) load();
    else setLoading(false);
  }, [domain, collectionItems.length]);

  const items = collectionItems.length > 0
    ? collectionItems.map(b => ({
        title: b.settings?.title || 'Collection',
        handle: b.settings?.collection || '',
        image: typeof b.settings?.image === 'string' ? b.settings?.image : b.settings?.image?.url,
      }))
    : collections.map(c => ({
        title: c.title,
        handle: c.handle,
        image: c.image?.url,
      }));

  const gridColsMap: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-3';

  if (loading) {
    return (
      <div
        className={`${sectionPadding}`}
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-10">
            {/* Heading skeleton */}
            <div className="space-y-3 max-w-2xl mx-auto text-center">
              <div
                className="h-10 w-64 mx-auto"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              <div
                className="mx-auto"
                style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            {/* Grid skeleton */}
            <div className={`grid grid-cols-2 ${gridCols} gap-5 md:gap-7`}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="aspect-[3/4]"
                  style={{ backgroundColor: 'var(--color-border)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={sectionPadding}
      style={{ backgroundColor: 'var(--color-background)', fontFamily: 'var(--font-body)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && (
              <>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
                >
                  {title}
                </h2>
                {/* Gold line accent below heading */}
                <div
                  className="mx-auto mt-5"
                  style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent)' }}
                />
              </>
            )}
            {description && (
              <p
                className="mt-6 text-base"
                style={{ color: 'var(--color-text)' }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {layout === 'grid' && (
          <div className={`grid grid-cols-2 ${gridCols} gap-5 md:gap-7`}>
            {items.map((item, i) => (
              <CollectionCard key={i} item={item} domain={domain} />
            ))}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="columns-2 md:columns-3 gap-5 space-y-5">
            {items.map((item, i) => (
              <Link
                key={i}
                href={getStorePermalink(domain, `/collections/${item.handle}`)}
                className="group block break-inside-avoid"
              >
                <MasonryCard item={item} index={i} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Grid card with gold border on hover
function CollectionCard({ item, domain }: { item: { title: string; handle: string; image?: string }; domain: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={getStorePermalink(domain, `/collections/${item.handle}`)}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden aspect-[3/4] transition-all duration-300"
        style={{
          border: hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
        }}
      >
        {/* Image */}
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {!item.image && (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--color-border)' }} />
        )}

        {/* Heavy dark overlay — dramatic luxury feel */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(13,12,11,0.92) 0%, rgba(13,12,11,0.45) 50%, rgba(13,12,11,0.15) 100%)'
              : 'linear-gradient(to top, rgba(13,12,11,0.85) 0%, rgba(13,12,11,0.35) 60%, rgba(13,12,11,0.05) 100%)',
          }}
        />

        {/* Card content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <h3
            className="text-xl md:text-2xl lg:text-3xl font-normal tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
          >
            {item.title}
          </h3>
          {/* Shop Now link in gold */}
          <span
            className="mt-3 text-xs tracking-widest uppercase transition-opacity duration-300 inline-block"
            style={{
              color: 'var(--color-accent)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            Shop Now
          </span>
        </div>
      </div>
    </Link>
  );
}

// Masonry card — simpler, no hover state hook needed
function MasonryCard({ item, index }: { item: { title: string; handle: string; image?: string }; index: number }) {
  return (
    <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {!item.image && (
        <div className="w-full h-full" style={{ backgroundColor: 'var(--color-border)' }} />
      )}
      {/* Heavy dramatic overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(13,12,11,0.88) 0%, rgba(13,12,11,0.3) 60%, transparent 100%)',
        }}
      />
      {/* Gold border on hover via group */}
      <div
        className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-accent)] transition-colors duration-300 pointer-events-none"
        style={{ borderColor: 'transparent' }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
        <h3
          className="text-lg md:text-xl font-normal tracking-wide"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
        >
          {item.title}
        </h3>
        <span
          className="mt-2 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: 'var(--color-accent)' }}
        >
          Shop Now
        </span>
      </div>
    </div>
  );
}

export const schema = {
  type: 'collection_list',
  name: 'Collection List',
  settings: [
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'textarea', id: 'description', label: 'Description' },
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [{ value: 'grid', label: 'Grid' }, { value: 'masonry', label: 'Masonry' }],
      default: 'grid',
    },
    { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, step: 1, default: 3 },
    {
      type: 'select', id: 'padding_y', label: 'Padding',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      default: 'large',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'collection_item', name: 'Collection',
      settings: [
        { type: 'collection_picker', id: 'collection', label: 'Collection' },
        { type: 'text', id: 'title', label: 'Custom Title' },
        { type: 'image', id: 'image', label: 'Custom Image' },
      ],
    },
  ]),
};
