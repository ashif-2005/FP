import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Package,
  FileText,
  Receipt,
  LogOut
} from 'lucide-react';
import logo from '../assets/logoWhite.png';

const Sidebar = () => {
  const menuItems = [
    { icon: Users, label: 'Customers', path: '/customer' },
    { icon: Package, label: 'Item', path: '/item' },
    { icon: FileText, label: 'Delivery Challans', path: '/dc' },
    { icon: Receipt, label: 'Invoices', path: '/invoice' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
      <img src={logo} alt="Logo" class="logo" />
      </div>
      <nav className="nav-links">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-button">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;