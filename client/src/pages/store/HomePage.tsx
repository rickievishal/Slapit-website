import React, { useEffect, useState } from 'react';
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
      <CTASection />
    </div>
  );
};
