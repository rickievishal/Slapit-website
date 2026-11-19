import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../../components/store/HeroSection';
import { Ticker } from '../../components/store/Ticker';
import { FeaturedCollection } from '../../components/store/FeaturedCollection';
import { GoodWallsSection } from '../../components/store/GoodWallsSection';
import { BenefitsSection } from '../../components/store/BenefitsSection';
import { CTASection } from '../../components/store/CTASection';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { SITE_URL, usePageSeo } from '../../utils/seo';

export const HomePage: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Slap It Posters',
    url: `${SITE_URL}/`,
    description:
      'Shop bold wall art, art prints, movie posters, music posters and typography posters, printed on premium matte paper and delivered across India.',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
  usePageSeo({
    title: 'Slap It Posters | Shop Wall Art & Posters Online in India',
    description:
      'Shop bold art, movie, music and typography posters at Slap It Posters. Find statement wall art printed on premium matte paper and delivered across India.',
    path: '/',
    structuredData,
  });

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await productService.getFeaturedProducts(3);
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <HeroSection />
      <Ticker />
      <FeaturedCollection products={featuredProducts} isLoading={isLoading} />
      <GoodWallsSection />
      <BenefitsSection />
      <section className="border-b-2 border-black bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Find posters for your kind of space
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Explore graphic art prints, movie wall art, music-inspired designs, sports posters and
            bold typography. Choose a print that feels like you, then pick the size that works for
            your wall. Each poster is made to order on heavyweight matte paper and shipped across
            India in protective packaging.
          </p>
          <nav
            aria-label="Shop posters by category"
            className="mt-6 flex flex-wrap gap-3"
          >
            {[
              ['Art posters', 'art'],
              ['Movie posters', 'movies'],
              ['Music posters', 'music'],
              ['Sports posters', 'sports'],
              ['Typography posters', 'typography'],
            ].map(([label, category]) => (
              <Link
                key={category}
                to={`/posters?category=${category}`}
                className="border-2 border-black bg-[#FAFAFA] px-4 py-2 text-sm font-bold text-black hover:bg-[#5CE1E6]"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/posters"
              className="border-2 border-black bg-[#5CE1E6] px-4 py-2 text-sm font-bold text-black hover:bg-[#3BBFC4]"
            >
              Browse all posters
            </Link>
          </nav>
        </div>
      </section>
      <CTASection />
    </div>
  );
};
