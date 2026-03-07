import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCollapseChange = useCallback((collapsed) => {
    setSidebarCollapsed(collapsed);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex pt-16 lg:pt-[72px]">
        <Sidebar onCollapseChange={handleCollapseChange} />
        <motion.main
          className="flex-1 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-72px)] transition-all duration-400"
          style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, marginLeft: sidebarCollapsed ? 72 : 260 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
