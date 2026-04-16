import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { dropOpen: false };
  }

  render() {
    const { token, customer, mybookings } = this.context;
    const count = (mybookings || []).length;
    const initials = customer
      ? customer.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
      : 'U';
    const firstName = customer?.name?.split(' ').slice(-1)[0] || '';

    return (
      <div className="inform-bar">
        {/* LEFT — auth links hoặc welcome */}
        <div className="inform-links">
          {token === '' ? (
            <>
              <Link to="/login">Login</Link>
              <span style={{ color: 'var(--text3)' }}>·</span>
              <Link to="/signup">Sign up</Link>
              <span style={{ color: 'var(--text3)' }}>·</span>
              <Link to="/active">Active account</Link>
            </>
          ) : (
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>
              Welcome back, <b>{customer?.name}</b>
            </span>
          )}
        </div>

        {/* RIGHT — bookings badge + user menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/mybookings" className="booking-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            My bookings
            <span className="booking-count">{count}</span>
          </Link>

          {token !== '' && (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => this.setState(s => ({ dropOpen: !s.dropOpen }))}
              >
                <div className="user-ava">{initials}</div>
                <span>Hello, {firstName}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {this.state.dropOpen && (
                <div className="dropdown">
                  <Link to="/myprofile" onClick={() => this.setState({ dropOpen: false })}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My profile
                  </Link>
                  <Link to="/myorders" onClick={() => this.setState({ dropOpen: false })}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    My orders
                  </Link>
                  <Link to="/mybookings" onClick={() => this.setState({ dropOpen: false })}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                    </svg>
                    My bookings
                  </Link>
                  <hr />
                  <button className="logout" onClick={() => this.lnkLogoutClick()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.setState({ dropOpen: false });
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMybookings([]);
  }
}

export default Inform;