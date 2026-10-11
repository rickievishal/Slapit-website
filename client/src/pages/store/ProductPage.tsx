import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Printer, Truck } from 'lucide-react';
import { PosterGallery } from '../../components/store/PosterGallery';
import { SizeSelector } from '../../components/store/SizeSelector';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { RelatedProducts } from '../../components/store/RelatedProducts';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useBagStore } from '../../store/bagStore';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('A3');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useBagStore();

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const prod = await productService.getProductBySlug(slug);
        setProduct(prod);
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0]);
        }
        // Related
        const rel = await productService.getRelatedProducts(prod._id);
        setRelated(rel);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToBag = () => {
    if (!product) return;
    addItem({
      productId: product._id,
      productName: product.name,
      image: product.images[0] || '',
      size: selectedSize,
      quantity,
      price: product.price,
      slug: product.slug,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-10 bg-neutral-200 w-3/4" />
            <div className="h-6 bg-neutral-200 w-1/4" />
            <div className="h-24 bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black">Poster not found</h2>
        <Link to="/posters" className="text-sm font-bold text-neutral-600 underline mt-4 inline-block">
          Return to posters
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/posters"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Posters</span>
        </Link>

        {/* Product Section matching Panel 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery left side */}
          <div className="lg:col-span-7">
            <PosterGallery images={product.images} productName={product.name} />
          </div>

          {/* Info right side */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {product.featured && (
                <span className="inline-block text-[11px] font-black uppercase tracking-wider bg-amber-300 text-black px-2.5 py-0.5 border border-black mb-3">
                  Bestseller
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="text-2xl sm:text-3xl font-black text-black mt-2">
                {formatPrice(product.price)}
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description ||
                'A vibrant, retro-inspired city poster that brings instant energy to your space. Printed on premium matte paper with rich, lasting colours.'}
            </p>

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes || ['A4', 'A3', 'A2']}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Quantity */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                Quantity
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => Math.min(10, q + 1))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />
            </div>

            {/* Add to Bag CTA */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToBag}
              className="flex items-center justify-center gap-2 text-base py-3.5 shadow-[4px_4px_0px_0px_#000000]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Bag</span>
            </Button>

            {/* Value Props Strip matching Panel 03 bottom */}
            <div className="pt-6 border-t border-neutral-300 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-neutral-700 mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Premium paper</span>
                <span className="text-[9px] text-neutral-400">& rich colors</span>
              </div>
              <div className="flex flex-col items-center">
                <Printer className="w-5 h-5 text-neutral-700 mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Prints on demand</span>
                <span className="text-[9px] text-neutral-400">No inventory waste</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-neutral-700 mb-1" />
                <span className="text-[10px] font-bold text-neutral-800 leading-tight">Ships across India</span>
                <span className="text-[9px] text-neutral-400">3-7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={related} />
      </div>
    </div>
  );
};
