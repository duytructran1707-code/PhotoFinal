import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mybookings extends Component {
  static contextType = MyContext;

  render() {
    const { mybookings } = this.context;
    const total = mybookings.reduce((s, i) => s + (i.total || 0), 0);
    const gradients = ['linear-gradient(135deg,#6C47D9,#A855F7)','linear-gradient(135deg,#EC4899,#F97316)','linear-gradient(135deg,#0EA5E9,#6366F1)','linear-gradient(135deg,#A855F7,#EC4899)','linear-gradient(135deg,#10B981,#0EA5E9)'];

    return (
      <div className="mybookings-page">
        <div className="page-title">My <span>Bookings</span></div>

        {mybookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div style={{ fontWeight:600, marginBottom:6 }}>No bookings yet</div>
            <div style={{ fontSize:13 }}>Browse photographers and add them to your booking list</div>
          </div>
        ) : (
          <>
            <div className="booking-list">
              {mybookings.map((item, i) => {
                const initials = item.photographer.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
                const grad = gradients[i % gradients.length];
                return (
                  <div key={i} className="bitem">
                    <div className="bitem-ava" style={{ background: grad }}>{initials}</div>
                    <div className="bitem-info">
                      <div className="bitem-name">{item.photographer.name}</div>
                      <div className="bitem-meta">
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {item.bookingDate}
                        </span>
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {item.timeSlot}
                        </span>
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {item.location}
                        </span>
                        {item.service && <span className="tag tag-purple">{item.service.name}</span>}
                      </div>
                    </div>
                    <div className="bitem-right">
                      <div className="bitem-price">{item.total?.toLocaleString('vi-VN')}đ</div>
                      <div className="bitem-status status-pending">PENDING</div>
                    </div>
                    <button className="bitem-remove" title="Remove" onClick={() => this.removeItem(i)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="confirm-bar">
              <div>
                <div className="confirm-total">
                  <small>Total ({mybookings.length} booking{mybookings.length > 1 ? 's' : ''})</small>
                  {total.toLocaleString('vi-VN')}đ
                </div>
              </div>
              <button className="confirm-btn" onClick={() => this.handleConfirm()}>
                Confirm all bookings
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  removeItem(index) {
    const mybookings = [...this.context.mybookings];
    mybookings.splice(index, 1);
    this.context.setMybookings(mybookings);
  }

  handleConfirm() {
    if (!window.confirm('Confirm all bookings?')) return;
    const customer = this.context.customer;
    if (!customer) { this.props.navigate('/login'); return; }
    const config = { headers: { 'x-access-token': this.context.token } };
    const requests = this.context.mybookings.map(item =>
      axios.post('/api/customer/bookings', { ...item, customer }, config)
    );
    Promise.all(requests).then(() => {
      alert('All bookings confirmed!');
      this.context.setMybookings([]);
      this.props.navigate('/myorders');
    }).catch(() => alert('Something went wrong. Please try again.'));
  }
}

export default withRouter(Mybookings);