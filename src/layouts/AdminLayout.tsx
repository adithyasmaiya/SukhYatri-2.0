import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { AdminHeader } from '../components/layout/AdminHeader';
import { useSEO } from '../hooks/useSEO';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSEO({
    title: 'SukhYatri Admin Console',
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-[#EEF1EF] text-ink flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-5 lg:p-8 max-w-[1240px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
