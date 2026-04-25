// app/page.tsx
import { HeroSection } from '@/components/public/HeroSection';
import { ValuePropsSection } from '@/components/public/ValuePropsSection';
import { CategorySlider } from '@/components/public/CategorySlider';
import { FeaturedProducts } from '@/components/public/FeaturedProducts';
import { B2BBanner } from '@/components/public/B2BBanner';
import { GallerySection } from '@/components/public/GallerySection';
import { NewsletterSection } from '@/components/public/NewsletterSection';

// SEO Metadata
export const metadata = {
  title: 'ManuFit | Custom Apparel & Branded Merchandise Kenya',
  description: 'Quality custom t-shirts, hoodies, kids wear, office décor, and branded merchandise. Kenya-wide delivery. Get a quote for bulk orders.',
  keywords: ['custom t-shirts Kenya', 'branded merchandise', 'corporate apparel', 'hoodies Nairobi', 'ManuFit'],
  openGraph: {
    title: 'ManuFit | Custom Apparel & Branded Merchandise',
    description: 'Quality custom apparel for individuals and organizations. Kenya-wide delivery.',
    type: 'website',
    locale: 'en_KE',
  },
};

// Structured Data (JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'ManuFit',
  description: 'Custom apparel and branded merchandise',
  url: 'https://manufit.co.ke',
  telephone: '+254706406009',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KE',
  },
  priceRange: 'KSh',
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Sections */}
      <HeroSection />
      <ValuePropsSection />
      <CategorySlider />
      <FeaturedProducts />
      <B2BBanner />
      <GallerySection />
      <NewsletterSection />
    </>
  );
}