import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBagStore } from '../../store/bagStore';
import { QuantitySelector } from '../common/QuantitySelector';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';

export const BagDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeBag,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
  } = useBagStore();

  const navigate = useNavigate();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    closeBag();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-screen max-w-md bg-white border-l-2 border-black flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA]">
                <h2 className="text-xl font-black tracking-tight text-black flex items-center gap-2">
                  <span>Your Bag</span>
                  <span className="text-neutral-500 font-mono text-base">({itemCount})</span>
                </h2>
                <button
                  onClick={closeBag}
                  className="p-1.5 hover:bg-neutral-200 rounded-none text-black transition-colors cursor-pointer"
                  aria-label="Close Bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-4">
                    <div className="w-16 h-16 border-2 border-dashed border-neutral-300 rounded-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div>
                      <p className="font-bold text-black text-lg">Your bag is empty</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Find something worth putting on your wall.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        closeBag();
                        navigate('/posters');
                      }}
                    >
                      Browse Posters
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex gap-4 p-3 bg-[#FAFAFA] border border-neutral-200 hover:border-black transition-colors"
                    >
                      <div className="w-20 h-26 bg-neutral-100 shrink-0 border border-black overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-sm text-black leading-snug line-clamp-1">
                              {item.productName}
                            </h4>
                            <span className="inline-block text-[11px] font-mono text-neutral-500 uppercase mt-0.5">
                              Size: {item.size}
                            </span>
                          </div>
                          <span className="font-black text-sm text-black whitespace-nowrap">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrease={() =>
                              updateQuantity(item.productId, item.size, item.quantity + 1)
                            }
                            onDecrease={() =>
                              updateQuantity(item.productId, item.size, item.quantity - 1)
                            }
                          />

                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal & Checkout Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t-2 border-black bg-[#FAFAFA] space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-sm text-neutral-600">Subtotal</span>
                    <span className="text-xl font-black text-black">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400">
                    Shipping & taxes calculated at checkout. Free shipping on orders over ₹999.
                  </p>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleCheckout}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={closeBag}
                      className="text-xs text-neutral-500 hover:text-black underline cursor-pointer"
                    >
                      or continue shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
