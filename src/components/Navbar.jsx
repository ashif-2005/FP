import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  FileText,
  Receipt,
  LogOut,
  Notebook,
  Boxes,
  ClipboardList,
  Wallet,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import logo from '../assets/logoWhite.png';

const menuStructure = [
  {
    label: 'Party',
    children: [
      { label: 'Sales Party', icon: Users, path: '/sales-party' },
      { label: 'Purchase Party', icon: Users, path: '/purchase-party' },
    ]
  },
  {
    label: 'Item',
    children: [
      { label: 'Item', icon: Package, path: '/item' }
    ]
  },
  {
    label: 'Stock',
    children: [
      { label: 'Stock', icon: Boxes, path: '/stock' }
    ]
  },
  {
    label: 'Delivery Challan',
    children: [
      { label: 'Delivery Challan', icon: FileText, path: '/dc' }
    ]
  },
  {
    label: 'Invoice',
    children: [
      { label: 'Sales Invoice', icon: Receipt, path: '/invoice' },
      { label: 'Purchase Invoice', icon: Receipt, path: '/purchase-invoice' }
    ]
  },
  {
    label: 'Voucher',
    children: [
      { label: 'Sales Voucher', icon: Wallet, path: '/salse-voucher' },
      { label: 'Purchase Voucher', icon: Wallet, path: '/purchase-voucher' }
    ]
  },
  {
    label: 'Ledger',
    children: [
      { label: 'Sales Invoice Ledger', icon: Notebook, path: '/inv-ledger' },
      { label: 'Purchase Invoice Ledger', icon: Notebook, path: '/purchase-inv-ledger' }
    ]
  },
  {
    label: 'Party Ledger',
    children: [
      { label: 'Sales Party Ledger', icon: ClipboardList, path: '/salse-party-ledger' },
      { label: 'Purchase Party Ledger', icon: ClipboardList, path: '/purchase-party-ledger' }
    ]
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenuLabel, setOpenMenuLabel] = useState(null);

  const toggleMenu = (label) => {
    setOpenMenuLabel(prevLabel => prevLabel === label ? null : label);
  };

  const handleLogoClick = () => navigate(`/`);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    location.reload();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <nav className="nav-links">
        {menuStructure.map((group) => (
          <div key={group.label} className="menu-group">
            <div className="nav-link expandable" onClick={() => toggleMenu(group.label)}>
              {openMenuLabel === group.label ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <span>{group.label}</span>
            </div>
            {openMenuLabel === group.label && (
              <div className="submenu">
                {group.children.map(({ label, icon: Icon, path }) => (
                  <NavLink
                    key={label}
                    to={path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} /><span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={20} /><span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
