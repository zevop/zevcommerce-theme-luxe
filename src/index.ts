import { defineTheme } from '@zevcommerce/theme-sdk';
import { settingsSchema } from './settings';
import { luxeSectionRegistry } from './registry';
import { luxeBlockRegistry } from './blocks';
import preset from './preset.json';

const theme = defineTheme({
  handle: 'luxe',
  name: 'Luxe',
  version: '2.0.0',
  author: {
    name: 'ZevCommerce',
    url: 'https://zevcommerce.com',
  },
  description: 'Sophisticated and high-end — a premium ZevCommerce theme.',
  tags: ['luxury', 'high-end', 'sophisticated', 'premium', 'responsive'],
  settingsSchema,
  defaultPreset: preset as any,
  registry: {
    sections: luxeSectionRegistry,
    blocks: luxeBlockRegistry,
  },
});

export default theme;
export { settingsSchema } from './settings';
export { luxeSectionRegistry } from './registry';
export { luxeBlockRegistry } from './blocks';
