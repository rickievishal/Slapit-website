import React, { useEffect, useState } from 'react';
import { HeroSection } from '../../components/store/HeroSection';
import { Ticker } from '../../components/store/Ticker';
import { FeaturedCollection } from '../../components/store/FeaturedCollection';
import { GoodWallsSection } from '../../components/store/GoodWallsSection';
import { BenefitsSection } from '../../components/store/BenefitsSection';
import { CTASection } from '../../components/store/CTASection';
import { productService } from '../../services/productService';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
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
