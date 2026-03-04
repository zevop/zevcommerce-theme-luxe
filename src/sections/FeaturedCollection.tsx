'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme, getCollection, ProductCard } from '@zevcommerce/storefront-api';

const scrollContainer = (container: HTMLElement | null, direction: 'left' | 'right') => {
  if (!container) return;
  const scrollAmount = container.clientWidth * 0.8;
  container.scrollTo({
    left: container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
    behavior: 'smooth',
  });
};

export default function FeaturedCollection({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const domain = storeConfig?.domain || storeConfig?.handle || '';
  const collectionHandle = settings.collection_handle || settings.collection || '';
  const limit = parseInt(settings.limit || '8');
  const columns = parseInt(settings.columns || '4');
  const layout = settings.layout || 'grid';
  const aspectRatio = settings.image_aspect_ratio || 'portrait';
  const showViewAll = settings.show_view_all !== false;
  const viewAllText = settings.view_all_text || 'View All';

  useEffect(() => {
    async function fetchData() {
      if (!domain || !collectionHandle) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const collection = await getCollection(domain, collectionHandle);
        if (collection) {
          setCollectionInfo(collection);
          const productList = collection.products?.map((p: any) => p.product || p) || [];
          setProducts(productList.slice(0, limit));
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          console.error('Error fetching collection:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [domain, collectionHandle, limit]);

  const gridColsMap: Record<number, string> = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  const gridColsClass = gridColsMap[columns] || 'lg:grid-cols-4';

  const sectionBg = settings.section_bg_color || 'var(--color-background)';

  if (!collectionHandle) {
    return (
      <section className="py-20" style={{ backgroundColor: sectionBg }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--color-text)' }}>
            Select a collection to display
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: sectionBg }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-10">
            <div className="h-10 w-48" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className={`grid grid-cols-2 ${gridColsClass} gap-6`}>
              {[...Array(columns)].map((_, i) => (
                <div key={i} className="aspect-[3/4]" style={{ backgroundColor: 'var(--color-border)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const title = settings.title || collectionInfo?.title;

  return (
    <section className="py-20 overflow-hidden" style={{ backgroundColor: sectionBg }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            {title && (
              <div>
                <h2
                  className="text-4xl md:text-5xl font-normal tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
                >
                  {title}
                </h2>
                {/* Gold underline rule */}
                <div
                  className="mt-4"
                  style={{
                    width: '40px',
                    height: '1px',
                    backgroundColor: 'var(--color-accent, #C9A96E)',
                  }}
                />
              </div>
            )}
          </div>
          {showViewAll && collectionInfo?.handle && (
            <Link
              href={`/collections/${collectionInfo.handle}`}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200"
              style={{
                border: '1px solid var(--color-heading, #EDE8E0)',
                color: 'var(--color-heading, #EDE8E0)',
                borderRadius: '0px',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent, #C9A96E)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent, #C9A96E)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-background, #0D0C0B)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-heading, #EDE8E0)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-heading, #EDE8E0)';
              }}
            >
              {viewAllText}
            </Link>
          )}
        </div>

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-px`} style={{ backgroundColor: 'var(--color-border)' }}>
            {products.map(product => (
              <div key={product.id} style={{ backgroundColor: sectionBg }}>
                <ProductCard
                  product={product}
                  domain={domain}
                  aspectRatio={aspectRatio}
                  borderRadius="none"
                />
              </div>
            ))}
          </div>
        )}

        {/* Editorial Layout */}
        {layout === 'editorial' && (
          <div className="flex flex-col lg:flex-row gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
            {/* Hero — large left image (~60%) */}
            <div className="w-full lg:w-[60%]" style={{ backgroundColor: sectionBg }}>
              {products[0] && (
                <ProductCard
                  product={products[0]}
                  domain={domain}
                  aspectRatio="portrait"
                  borderRadius="none"
                />
              )}
            </div>
            {/* 2x2 grid right side */}
            <div className="w-full lg:w-[40%] grid grid-cols-2 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
              {products.slice(1, 5).map(product => (
                <div key={product.id} style={{ backgroundColor: sectionBg }}>
                  <ProductCard
                    product={product}
                    domain={domain}
                    aspectRatio="square"
                    borderRadius="none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carousel Layout */}
        {layout === 'carousel' && (
          <div className="relative group/carousel">
            <button
              onClick={() => scrollContainer(scrollRef.current, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hidden md:flex"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-accent, #C9A96E)',
                color: 'var(--color-accent, #C9A96E)',
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollContainer(scrollRef.current, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hidden md:flex"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-accent, #C9A96E)',
                color: 'var(--color-accent, #C9A96E)',
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-px"
              style={{ backgroundColor: 'var(--color-border)' }}
            >
              {products.map(product => (
                <div
                  key={product.id}
                  className="snap-center shrink-0 w-[72vw] sm:w-[44vw] md:w-[30vw] lg:w-[22vw]"
                  style={{ backgroundColor: sectionBg }}
                >
                  <ProductCard
                    product={product}
                    domain={domain}
                    aspectRatio={aspectRatio}
                    borderRadius="none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile view all */}
        {showViewAll && collectionInfo?.handle && (
          <div className="mt-10 text-center md:hidden">
            <Link
              href={`/collections/${collectionInfo.handle}`}
              className="inline-flex items-center justify-center px-8 py-3 text-xs uppercase tracking-widest transition-colors duration-200"
              style={{
                border: '1px solid var(--color-heading, #EDE8E0)',
                color: 'var(--color-heading, #EDE8E0)',
                borderRadius: '0px',
                fontFamily: 'var(--font-body)',
              }}
            >
              {viewAllText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'featured_collection',
  name: 'Featured Collection',
  settings: [
    { type: 'header', label: 'Content' },
    { type: 'text', id: 'title', label: 'Heading', default: 'New Arrivals' },
    { type: 'collection_picker', id: 'collection_handle', label: 'Collection', default: 'all' },
    { type: 'checkbox', id: 'show_view_all', label: 'Show "View All" Button', default: true },
    { type: 'text', id: 'view_all_text', label: 'View All Button Text', default: 'View All' },
    { type: 'header', label: 'Layout' },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout Style',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'editorial', label: 'Editorial' },
        { value: 'carousel', label: 'Carousel' },
      ],
      default: 'grid',
    },
    {
      type: 'select',
      id: 'columns',
      label: 'Grid Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
      default: '4',
    },
    { type: 'range', id: 'limit', label: 'Number of Products', min: 4, max: 20, step: 4, default: 8 },
    {
      type: 'select',
      id: 'image_aspect_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'square', label: 'Square' },
        { value: 'portrait', label: 'Portrait' },
      ],
      default: 'portrait',
    },
    { type: 'header', label: 'Colors' },
    { type: 'color', id: 'section_bg_color', label: 'Section Background' },
  ],
};
