import Header from './sections/Header';
import { schema as HeaderSchema } from './sections/Header';
import Announcement from './sections/Announcement';
import { schema as AnnouncementSchema } from './sections/Announcement';
import Hero from './sections/Hero';
import { schema as HeroSchema } from './sections/Hero';
import Footer from './sections/Footer';
import { schema as FooterSchema } from './sections/Footer';
import Copyright from './sections/Copyright';
import { schema as CopyrightSchema } from './sections/Copyright';
import FeaturedCollection from './sections/FeaturedCollection';
import { schema as FeaturedCollectionSchema } from './sections/FeaturedCollection';
import ImageWithText from './sections/ImageWithText';
import { schema as ImageWithTextSchema } from './sections/ImageWithText';
import RichText from './sections/RichText';
import { schema as RichTextSchema } from './sections/RichText';
import Multicolumn from './sections/Multicolumn';
import { schema as MulticolumnSchema } from './sections/Multicolumn';
import Newsletter from './sections/Newsletter';
import { schema as NewsletterSchema } from './sections/Newsletter';
import Testimonials from './sections/Testimonials';
import { schema as TestimonialsSchema } from './sections/Testimonials';
import FAQ from './sections/FAQ';
import { schema as FAQSchema } from './sections/FAQ';
import Video from './sections/Video';
import { schema as VideoSchema } from './sections/Video';
import IconsWithText from './sections/IconsWithText';
import { schema as IconsWithTextSchema } from './sections/IconsWithText';
import ProductDetail from './sections/ProductDetail';
import { schema as ProductDetailSchema } from './sections/ProductDetail';
import ProductGrid from './sections/ProductGrid';
import { schema as ProductGridSchema } from './sections/ProductGrid';
import ProductList from './sections/ProductList';
import { schema as ProductListSchema } from './sections/ProductList';
import CollectionList from './sections/CollectionList';
import { schema as CollectionListSchema } from './sections/CollectionList';
import Slideshow from './sections/Slideshow';
import { schema as SlideshowSchema } from './sections/Slideshow';
import Marquee from './sections/Marquee';
import { schema as MarqueeSchema } from './sections/Marquee';

import { primeSectionRegistry } from '@zevcommerce/theme-prime';

export const luxeSectionRegistry: Record<string, { component: any; schema: any }> = {
  // Luxe-specific sections
  'header': { component: Header as any, schema: HeaderSchema },
  'announcement': { component: Announcement as any, schema: AnnouncementSchema },
  'hero': { component: Hero as any, schema: HeroSchema },
  'footer': { component: Footer as any, schema: FooterSchema },
  'copyright': { component: Copyright as any, schema: CopyrightSchema },
  'featured_collection': { component: FeaturedCollection as any, schema: FeaturedCollectionSchema },
  'image_with_text': { component: ImageWithText as any, schema: ImageWithTextSchema },
  'rich_text': { component: RichText as any, schema: RichTextSchema },
  'multicolumn': { component: Multicolumn as any, schema: MulticolumnSchema },
  'newsletter': { component: Newsletter as any, schema: NewsletterSchema },
  'testimonials': { component: Testimonials as any, schema: TestimonialsSchema },
  'faq': { component: FAQ as any, schema: FAQSchema },
  'video': { component: Video as any, schema: VideoSchema },
  'icons_with_text': { component: IconsWithText as any, schema: IconsWithTextSchema },
  'product-detail': { component: ProductDetail as any, schema: ProductDetailSchema },
  'product-grid': { component: ProductGrid as any, schema: ProductGridSchema },
  'product-list': { component: ProductList as any, schema: ProductListSchema },
  'collection_list': { component: CollectionList as any, schema: CollectionListSchema },
  'slideshow': { component: Slideshow as any, schema: SlideshowSchema },
  'marquee': { component: Marquee as any, schema: MarqueeSchema },

  // Shared functional sections from Prime
  'cart-page': primeSectionRegistry['cart-page'],
  'checkout-page': primeSectionRegistry['checkout-page'],
  'thank-you-page': primeSectionRegistry['thank-you-page'],
  'auth-section': primeSectionRegistry['auth-section'],
  'account-section': primeSectionRegistry['account-section'],
  'order-details-section': primeSectionRegistry['order-details-section'],
  'search-section': primeSectionRegistry['search-section'],
  'not-found-section': primeSectionRegistry['not-found-section'],
  'spacer': primeSectionRegistry['spacer'],
  'divider': primeSectionRegistry['divider'],
  'featured_blog': primeSectionRegistry['featured_blog'],
  'recommended_products': primeSectionRegistry['recommended_products'],
};
