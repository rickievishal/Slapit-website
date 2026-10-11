import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | 'draft' | 'published';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'paid':
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-400';
      case 'printing':
        return 'bg-purple-100 text-purple-800 border-purple-400';
      case 'packed':
        return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'shipped':
        return 'bg-[#B2F0F3] text-teal-900 border-[#5CE1E6]';
      case 'delivered':
        return 'bg-green-200 text-green-900 border-green-500';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-400';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'placed':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
    }
  };

  return (
    <span
      className={`inline-block text-xs font-semibold uppercase px-2.5 py-0.5 border rounded-full ${getStyle()}`}
    >
      {status}
    </span>
  );
};
