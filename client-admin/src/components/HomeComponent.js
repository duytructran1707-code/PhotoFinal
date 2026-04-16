import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import heroCinematic from '../assets/imgs/hero_cinematic.png';
import hinh1 from '../assets/imgs/hinh1.jpg';
import hinh2 from '../assets/imgs/hinh2.jpg';
import hinh3 from '../assets/imgs/hinh3.jpg';
import hinh4 from '../assets/imgs/hinh4.jpg';
import hinh5 from '../assets/imgs/hinh5.jpg';
import hinh6 from '../assets/imgs/hinh6.jpg';
import hinh7 from '../assets/imgs/hinh7.jpg';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      noBookings: '—',
      noPhotographers: '—',
      noServices: '—',
      noCustomers: '—',
    };
  }

  componentDidMount() {
    this.apiGetStats();
  }

  apiGetStats() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/stats', config).then((res) => {
      const { noBookings, noPhotographers, noServices, noCustomers } = res.data;
      this.setState({ noBookings, noPhotographers, noServices, noCustomers });
    }).catch(() => {});
  }

  render() {
    const { noBookings, noPhotographers, noServices, noCustomers } = this.state;
    return (
      <div>
        {/* Full-width Hero */}
        <div className="home-hero">
          <img src={heroCinematic} alt="ShotOfLife — Admin" />
          <div className="hero-overlay" />
          <div className="hero-text" style={{ textAlign: 'center' }}>
            <h1>ShotOfLife</h1>
            <p>Admin Dashboard · Editorial Management System</p>
          </div>
        </div>

        {/* Centered contents */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          {/* Stats strip */}
          <div className="home-stats">
          <div className="stat-card">
            <div className="stat-icon">📷</div>
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{noBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌿</div>
            <div className="stat-label">Photographers</div>
            <div className="stat-value">{noPhotographers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div className="stat-label">Services</div>
            <div className="stat-value">{noServices}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-label">Customers</div>
            <div className="stat-value">{noCustomers}</div>
          </div>
        </div>

        {/* New Dashboard Widgets: Calendar and Quick Actions */}
        <div className="dashboard-widgets">
          {/* Inspiration Gallery (Pinterest Layout) */}
          <div className="widget-card" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <div className="masonry-gallery">
              <div className="masonry-item"><img src={hinh1} alt="Port 1" /></div>
              <div className="masonry-item"><img src={hinh2} alt="Port 2" /></div>
              <div className="masonry-item"><img src={hinh3} alt="Port 3" /></div>
              <div className="masonry-item"><img src={hinh4} alt="Port 4" /></div>
              <div className="masonry-item"><img src={hinh5} alt="Port 5" /></div>
              <div className="masonry-item"><img src={hinh6} alt="Port 6" /></div>
              <div className="masonry-item"><img src={hinh7} alt="Port 7" /></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="widget-card">
            <div className="widget-title">Quick Actions</div>
            <div className="quick-actions-list">
              <Link to="/admin/photographer" className="qa-item">
                <div className="qa-icon purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
                </div>
                <div className="qa-text">
                  <div className="qa-name">Add Photographer</div>
                  <div className="qa-desc">Register new photographer</div>
                </div>
              </Link>
              
              <Link to="/admin/booking" className="qa-item">
                <div className="qa-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/></svg>
                </div>
                <div className="qa-text">
                  <div className="qa-name">View Bookings</div>
                  <div className="qa-desc">Manage all sessions</div>
                </div>
              </Link>

              <Link to="/admin/service" className="qa-item">
                <div className="qa-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </div>
                <div className="qa-text">
                  <div className="qa-name">Manage Services</div>
                  <div className="qa-desc">Add / edit services</div>
                </div>
              </Link>

              <Link to="/admin/customer" className="qa-item">
                <div className="qa-icon orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="qa-text">
                  <div className="qa-name">View Customers</div>
                  <div className="qa-desc">Manage accounts</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        </div>
      </div>
    );
  }
}

export default Home;
