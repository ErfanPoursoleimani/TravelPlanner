// components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 relative">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;