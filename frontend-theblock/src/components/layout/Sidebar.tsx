// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router/internal/react-server-client';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <nav className="space-y-2">
        <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;