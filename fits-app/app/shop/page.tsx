// app/shop/page.tsx
import { getProductsAction } from '@/actions/product-actions';
import { ShopHeader } from '@/components/public/shop/ShopHeader';
// import { FilterSidebar } from '@/components/public/shop/FilterSidebar';
import { FilterDrawer } from '@/components/public/shop/FilterDrawer';
import { ProductFilters } from '@/components/public/shop/ProductFilters';
import { SortDropdown } from '@/components/public/shop/SortDropdown';
import { ProductGrid } from '@/components/public/shop/ProductGrid';
import { EmptyState } from '@/components/public/shop/EmptyState';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { ShopProductGrid } from '@/components/public/shop/ShopProductGrid';

// SEO Metadata
export const metadata = {
  title: 'Shop | ManuFit Custom Apparel & Merchandise',
  description: 'Browse our collection of custom t-shirts, hoodies, kids wear, office décor, and branded merchandise. Kenya-wide delivery.',
  keywords: ['shop custom t-shirts', 'buy hoodies Kenya', 'branded merchandise', 'ManuFit store'],
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'ManuFit Shop',
  description: 'Custom apparel and branded merchandise',
  url: 'https://manufit.co.ke/shop',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Fetch all products (server-side)
  const allProducts = await getProductsAction();

  // Extract filter params
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const sizes = Array.isArray(params.size) ? params.size : params.size ? [params.size] : undefined;
  const colors = Array.isArray(params.color) ? params.color : params.color ? [params.color] : undefined;
  const sort = Array.isArray(params.sort) ? params.sort[0] : params.sort || 'featured';

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-slate-50">
        <ShopHeader />
        <div className="flex justify-center">
          {/* Header */}

          <div className="container px-4 py-8">
            <div className="flex gap-8">

              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 space-y-6">
                  <ProductFilters
                    category={category}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    sizes={sizes}
                    colors={colors}
                  />
                </div>
              </aside>

              {/* Mobile Filter Drawer */}
              <FilterDrawer>
                <ProductFilters
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  sizes={sizes}
                  colors={colors}
                  isMobile
                />
              </FilterDrawer>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {/* Sort + Result Count */}
                <div className="flex items-center justify-between mb-6">
                  <SortDropdown currentSort={sort} />
                </div>

                {/* Product Grid - Now uses client wrapper */}
                {allProducts.length === 0 ? (
                  <EmptyState />
                ) : (
                  <ShopProductGrid
                    products={allProducts}
                    category={category}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    sizes={sizes}
                    colors={colors}
                    sort={sort}
                  />
                )}
              </main>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}