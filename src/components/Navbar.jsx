import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  FileText,
  Receipt,
  LogOut,
  Notebook,
  Boxes,
  ClipboardList
} from 'lucide-react';
import logo from '../assets/logoWhite.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: Users, label: 'Customers', path: '/customer' },
    { icon: Package, label: 'Item', path: '/item' },
    { icon: Boxes, label: 'Stock', path: '/stock' },
    { icon: FileText, label: 'Delivery Challan', path: '/dc' },
    { icon: Receipt, label: 'Invoice', path: '/invoice' },
    { icon: Notebook, label: 'Invoice Ledger', path: '/inv-ledger' },
    { icon: ClipboardList, label: 'Purchase Ledger', path: '/pur-ledger' }
  ];

  const handelLogo = () => {
    navigate(`/`)
  }

  const handelLogout = () => {
    console.log("Logout")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    location.reload();  
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header" onClick={handelLogo}>
      <img src={logo} alt="Logo"  class="logo" />
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
      <button className="logout-button" onClick={handelLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;