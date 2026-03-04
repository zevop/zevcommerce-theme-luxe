'use client';

import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ProductList({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();

  return (
    <section
      className="py-10 md:py-16"
      style={{ backgroundColor: 'var(--color-background)', fontFamily: 'var(--font-body)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <BlockRenderer
          blocks={blocks}
          sectionSettings={{ ...settings, storeHandle: storeConfig?.handle }}
          className="space-y-6"
        />
      </div>
    </section>
  );
}

export const schema = {
  type: 'product-list',
  name: 'Collection Products',
  settings: [],
  blocks: getSharedBlocks([
    { type: 'collection_heading', name: 'Collection Heading', settings: [] },
    { type: 'collection_description', name: 'Collection Description', settings: [] },
    {
      type: 'product_grid', name: 'Product Grid',
      settings: [
        {
          type: 'select', id: 'columns', label: 'Columns',
          options: [
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
          ],
          default: '4',
        },
      ],
    },
  ]),
};
