import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link, useLocation } from 'react-router-dom';

// Nav icon map (simple Unicode symbols — no external deps)
const NAV_ITEMS = [
  { to: '/admin/home',         label: 'Home',         icon: '⌂' },
  { to: '/admin/service',      label: 'Service',      icon: '◈' },
  { to: '/admin/photographer', label: 'Photographer',  icon: '◉' },
  { to: '/admin/booking',      label: 'Booking',      icon: '◷' },
  { to: '/admin/customer',     label: 'Customer',     icon: '◎' },
];

// Wrapper to access useLocation inside class component
function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <li className="menu">
      <Link
        to={to}
        style={isActive ? {
          color: 'var(--sunset)',
          background: 'rgba(196,114,58,0.10)',
          borderColor: 'rgba(196,114,58,0.25)',
        } : {}}
      >
        <span style={{ marginRight: '5px', fontSize: '12px', opacity: 0.75 }}>{icon}</span>
        {label}
      </Link>
    </li>
  );
}

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </ul>
        </div>
        <div className="float-right" style={{ gap: '10px' }}>
          <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>
            Signed in as&nbsp;
            <b style={{ color: 'var(--text-secondary)' }}>{this.context.username}</b>
          </span>
          <span style={{
            width: '1px',
            height: '16px',
            background: 'var(--border-md)',
            display: 'inline-block',
          }} />
          <Link
            to="/admin/home"
            onClick={() => this.lnkLogoutClick()}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Logout
          </Link>
        </div>
        <div className="float-clear" />
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;
