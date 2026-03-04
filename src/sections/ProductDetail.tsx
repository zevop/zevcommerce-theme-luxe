'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, getProduct, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ProductDetail({ id, settings, blocks }: { id: string; settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const router = useRouter();
  const domain = storeConfig?.handle || '';
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const slug = window.location.pathname.split('/products/')[1];
        if (slug && domain) {
          const data = await getProduct(domain, slug);
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [domain]);

  if (loading) {
    return (
      <div
        className="container mx-auto px-4 sm:px-6 py-16"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 animate-pulse">
          {/* Image skeleton */}
          <div className="space-y-3">
            <div className="aspect-[3/4]" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="aspect-[3/4]" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
          {/* Info skeleton */}
          <div className="space-y-5 pt-4">
            <div className="h-3 w-1/3" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="h-8 w-2/3" style={{ backgroundColor: 'var(--color-border)' }} />
            <div
              style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent)' }}
            />
            <div className="h-6 w-1/4" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="h-12 w-full" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="container mx-auto px-4 sm:px-6 py-24 text-center"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-text)' }}>
          Product not found
        </p>
      </div>
    );
  }

  // Always sticky for Luxe — luxury layout is always the "editorial" stacked+sticky style
  const imageBlocks = blocks.filter(b => b.type === 'product_images');
  const infoBlocks = blocks.filter(b => b.type !== 'product_images');

  return (
    <div
      style={{ backgroundColor: 'var(--color-background)', fontFamily: 'var(--font-body)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase mb-10" style={{ color: 'var(--color-text)' }}>
          <a
            href="/"
            className="transition-colors"
            style={{ color: 'var(--color-text)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
          >
            Home
          </a>
          <span style={{ color: 'var(--color-accent)' }}>/</span>
          <a
            href="/collections/all"
            className="transition-colors"
            style={{ color: 'var(--color-text)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
          >
            Products
          </a>
          <span style={{ color: 'var(--color-accent)' }}>/</span>
          <span style={{ color: 'var(--color-heading)' }}>{product.title}</span>
        </nav>

        {/* Two-column layout: stacked images left, sticky info right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 lg:gap-16 items-start">
          {/* Left: Stacked images */}
          <div>
            <BlockRenderer
              blocks={imageBlocks}
              sectionSettings={{ ...settings, product }}
              className="space-y-3"
            />
          </div>

          {/* Right: Sticky info column */}
          <div className="lg:sticky lg:top-24">
            {/* Decorative gold rule above title */}
            <div
              style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent)', marginBottom: '24px' }}
            />
            <BlockRenderer
              blocks={infoBlocks}
              sectionSettings={{ ...settings, product }}
              className="space-y-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'product-detail',
  name: 'Product Detail',
  settings: [
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: '2-col', label: 'Standard (2 Column)' },
        { value: 'sticky-sidebar', label: 'Sticky Sidebar' },
      ],
      default: 'sticky-sidebar',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'product_images', name: 'Product Images',
      settings: [
        { type: 'select', id: 'layout', label: 'Gallery Layout', options: [{ value: 'stacked', label: 'Stacked' }, { value: 'carousel', label: 'Carousel' }, { value: 'grid', label: 'Grid' }], default: 'stacked' },
        { type: 'checkbox', id: 'enable_zoom', label: 'Enable Zoom', default: true },
        { type: 'checkbox', id: 'show_thumbnails', label: 'Show Thumbnails', default: true },
      ],
    },
    { type: 'product_title', name: 'Product Title', settings: [{ type: 'checkbox', id: 'show_vendor', label: 'Show Vendor', default: true }] },
    { type: 'product_price', name: 'Product Price', settings: [{ type: 'checkbox', id: 'show_compare_at', label: 'Show Compare-at Price', default: true }] },
    { type: 'product_variants', name: 'Variant Selector', settings: [{ type: 'select', id: 'style', label: 'Style', options: [{ value: 'buttons', label: 'Buttons' }, { value: 'dropdown', label: 'Dropdown' }], default: 'buttons' }] },
    { type: 'add_to_cart', name: 'Add to Cart', settings: [{ type: 'checkbox', id: 'show_quantity', label: 'Show Quantity', default: true }, { type: 'text', id: 'button_text', label: 'Button Text', default: 'Add to Cart' }] },
    { type: 'product_description', name: 'Description', settings: [{ type: 'checkbox', id: 'collapsible', label: 'Collapsible', default: true }] },
  ]),
};
