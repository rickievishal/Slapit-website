import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useBagStore } from '../../store/bagStore';
import { orderService } from '../../services/orderService';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/formatters';

const checkoutSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, clearBag } = useBagStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your bag is empty!');
      return;
    }

    try {
      const validated = checkoutSchema.parse(formData);
      setIsSubmitting(true);

      const orderPayload = {
        customer: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
        },
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingAddress: {
          address: validated.address,
          city: validated.city,
          state: validated.state,
          pincode: validated.pincode,
        },
      };

      const order = await orderService.createOrder(orderPayload);
      setCreatedOrder(order);
      clearBag();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        const issues = (err as any).issues || (err as any).errors || [];
        issues.forEach((issue: any) => {
          if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(err.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrder) {
    return (
      <div className="py-16 bg-[#FAFAFA] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000000] text-center space-y-6">
          <div className="inline-flex p-3 bg-[#5CE1E6] border-2 border-black rounded-full">
            <CheckCircle2 className="w-8 h-8 text-black" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase font-bold text-neutral-400">Order Placed</span>
            <h2 className="text-3xl font-black text-black mt-1">Slapped & Confirmed!</h2>
            <p className="text-sm font-mono font-bold text-neutral-700 mt-2">
              Order Number: <span className="bg-yellow-200 px-2 py-0.5 border border-black">{createdOrder.orderNumber}</span>
            </p>
          </div>

          <p className="text-xs text-neutral-600">
            We have received your order and started preparing the print queue. A confirmation email has been dispatched to{' '}
            <span className="font-bold">{createdOrder.customer.email}</span>.
          </p>

          <div className="pt-4 border-t border-neutral-200">
            <Link to="/posters">
              <Button variant="primary" fullWidth>
                Back to Posters
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-black text-black">Your bag is empty</h2>
        <p className="text-sm text-neutral-500 mt-2">Add some posters before proceeding to checkout.</p>
        <Link to="/posters" className="mt-6 inline-block">
          <Button variant="primary">Browse Posters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/posters"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 p-6 sm:p-8 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] space-y-6"
          >
            <div>
              <h2 className="font-black text-lg text-black uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                1. Customer Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                    placeholder="e.g. Vishal T"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                      placeholder="you@domain.com"
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-black text-lg text-black uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                    placeholder="House / Flat No, Street, Landmark"
                  />
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                    />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                    />
                    {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                    />
                    {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="py-3.5 text-base shadow-[4px_4px_0px_0px_#000000]"
            >
              Confirm & Place Order ({formatPrice(total)})
            </Button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] space-y-4">
            <h2 className="font-black text-lg text-black uppercase tracking-wider pb-2 border-b border-neutral-200">
              Order Summary ({items.length})
            </h2>

            <div className="divide-y divide-neutral-200 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-3 flex items-center gap-3">
                  <div className="w-14 h-18 bg-neutral-100 border border-black shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-black line-clamp-1">{item.productName}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-black whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-black space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-black">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold text-black">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
                <span>Total Payable</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
