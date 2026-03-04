import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react', 'react-dom', 'next', 'next/link', 'next/dynamic', 'next/navigation', 'next/image',
    '@zevcommerce/storefront-api', '@zevcommerce/theme-sdk', '@zevcommerce/theme-prime',
    '@tanstack/react-query', 'lucide-react', 'sonner',
  ],
  jsx: 'automatic',
});
