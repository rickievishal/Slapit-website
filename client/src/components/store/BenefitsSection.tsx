import React from 'react';
import { Printer, ShieldCheck, Truck } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Printer,
      title: 'PRINTS ON DEMAND',
      description: 'Zero excess stock. Freshly cured on archival quality paper the moment you hit order.',
    },
    {
      icon: ShieldCheck,
      title: 'PREMIUM QUALITY',
      description: 'Heavyweight 300 GSM matte cardstock with rich, lightfast pigments that stay punchy.',
    },
    {
      icon: Truck,
      title: 'INDIA-WIDE SHIPPING',
      description: 'Reinforced triangle tubes. Guaranteed zero bent edges or creases right to your doorstep.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">
            WHY FANS KEEP COMING BACK
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-black">
            The Slapit Standard
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-[#FAFAFA] border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col items-start"
              >
                <div className="p-3 bg-[#5CE1E6] border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-4">
                  <Icon className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <h4 className="font-black text-base tracking-wide text-black mb-2 uppercase">
                  {b.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
