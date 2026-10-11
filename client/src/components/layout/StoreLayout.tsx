import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BagDrawer } from '../store/BagDrawer';
import { Toast } from '../common/Toast';
import { useBagStore } from '../../store/bagStore';

export const StoreLayout: React.FC = () => {
  const { justAdded } = useBagStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Sliding bag drawer within Router context */}
      <BagDrawer />
      {/* Animated feedback toast */}
      <Toast show={justAdded} message="Slapped to bag!" />
    </div>
  );
};
