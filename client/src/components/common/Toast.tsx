import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message?: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message = 'Slapped!' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-sm border-2 border-[#5CE1E6] shadow-[4px_4px_0px_0px_#5CE1E6]"
        >
          <span className="p-0.5 rounded-full bg-[#5CE1E6] text-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
