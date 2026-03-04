'use client';

import { useEffect, useState } from 'react';
import { useTheme, getProducts, ProductCard, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ProductGrid({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const domain = storeConfig?.handle || '';

  const headingBlock = blocks.find(b => b.type === 'heading');
  const gridBlock = blocks.find(b => b.type === 'product_grid_items');
  const limit = parseInt(gridBlock?.settings?.limit || settings.limit || '8');
  const columns = gridBlock?.settings?.columns_desktop || settings.columns_desktop || '4';
  const imageRatio = gridBlock?.settings?.image_ratio || settings.image_ratio || 'portrait';
  const paddingTop = settings.padding_top ?? 80;
  const paddingBottom = settings.padding_bottom ?? 80;

  useEffect(() => {
    async function load() {
      if (!domain) { setLoading(false); return; }
      try {
        const { data } = await getProducts(domain, 1, limit);
        setProducts(data || []);
      } catch { /* empty */ } finally { setLoading(false); }
    }
    load();
  }, [domain, limit]);

  const gridColsMap: Record<string, string> = {
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
    '5': 'lg:grid-cols-5',
  };
  const gridCols = gridColsMap[columns] || 'lg:grid-cols-4';

  const headingText = headingBlock?.settings?.text || 'Featured Collection';
  const headingAlignment = headingBlock?.settings?.alignment || 'left';
  const headingAlignClass = headingAlignment === 'center' ? 'text-center mx-auto' : 'text-left';

  if (loading) {
    return (
      <div
        className="container mx-auto px-4 sm:px-6"
        style={{ paddingTop, paddingBottom, backgroundColor: 'var(--color-background)' }}
      >
        <div className="animate-pulse space-y-10">
          {/* Heading skeleton */}
          <div className="space-y-3">
            <div className="h-10 w-64" style={{ backgroundColor: 'var(--color-border)' }} />
            <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent)' }} />
          </div>
          {/* Grid skeleton */}
          <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols} gap-5 md:gap-7`}>
            {[...Array(parseInt(columns))].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4]"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ paddingTop, paddingBottom, backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {headingBlock && (
          <div className={`mb-10 max-w-2xl ${headingAlignClass}`}>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
            >
              {headingText}
            </h2>
            {/* Gold thin line accent */}
            <div
              style={{
                width: '60px',
                height: '1px',
                backgroundColor: 'var(--color-accent)',
                marginTop: '20px',
              }}
            />
          </div>
        )}

        <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols} gap-5 md:gap-7`}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              domain={domain}
              aspectRatio={imageRatio}
              borderRadius="none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'product-grid',
  name: 'Product Grid',
  settings: [
    { type: 'range', id: 'padding_top', label: 'Padding Top', min: 0, max: 160, step: 8, default: 80 },
    { type: 'range', id: 'padding_bottom', label: 'Padding Bottom', min: 0, max: 160, step: 8, default: 80 },
    {
      type: 'select', id: 'image_ratio', label: 'Image Ratio',
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'square', label: 'Square' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'landscape', label: 'Landscape' },
      ],
      default: 'portrait',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading', name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Featured Collection' },
        { type: 'select', id: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'lg', label: 'Large' }], default: 'lg' },
        { type: 'select', id: 'alignment', label: 'Alignment', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }], default: 'left' },
      ],
    },
    {
      type: 'product_grid_items', name: 'Product Grid',
      settings: [
        { type: 'range', id: 'limit', label: 'Products', min: 4, max: 24, step: 4, default: 8 },
        { type: 'select', id: 'columns_desktop', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }], default: '4' },
      ],
    },
  ]),
};
