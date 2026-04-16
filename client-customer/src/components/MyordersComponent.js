import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext'; // adjust path if needed

const STATUS_CLASS = {
  PENDING:'status-pending',
  CONFIRMED:'status-confirmed',
  DONE:'status-done',
  CANCELLED:'status-cancelled'
};

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      selected: null
    };
  }

  render() {
    if (!this.context.token) return <Navigate replace to="/login" />;

    const { bookings, selected } = this.state;

    return (
      <div className="orders-page">
        <div className="page-title">
          My <span>Orders</span>
        </div>

        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th><th>Created</th><th>Photographer</th><th>Service</th>
                <th>Date</th><th>Time</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} onClick={() => this.setState({ selected: b })}>
                  <td style={{ fontFamily:'monospace', fontSize:11 }}>
                    {b._id?.slice(-8)}
                  </td>
                  <td>{new Date(b.cdate).toLocaleDateString('vi-VN')}</td>
                  <td style={{ fontWeight:600, color:'var(--text)' }}>
                    {b.photographer?.name}
                  </td>
                  <td>{b.service?.name}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.timeSlot}</td>
                  <td style={{ fontWeight:600 }}>
                    {b.total?.toLocaleString('vi-VN')}đ
                  </td>
                  <td>
                    <span className={`bitem-status ${STATUS_CLASS[b.status] || 'status-pending'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign:'center', padding:32, color:'var(--text3)' }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="order-detail-card">
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>
              Booking detail
            </div>

            <div className="order-detail-grid">
              {[
                ['Photographer', selected.photographer?.name],
                ['Service', selected.service?.name],
                ['Date', selected.bookingDate],
                ['Time', selected.timeSlot],
                ['Location', selected.location],
                ['Note', selected.note || '—'],
                ['Total', (selected.total?.toLocaleString('vi-VN') || 0) + 'đ'],
                ['Status', selected.status],
              ].map(([lbl, val]) => (
                <div key={lbl} className="order-detail-row">
                  <div className="lbl">{lbl}</div>
                  <div className="val">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const config = {
        headers: { 'x-access-token': this.context.token }
      };

      axios.get(
        '/api/customer/bookings/customer/' + this.context.customer._id,
        config
      ).then(res => {
        this.setState({ bookings: res.data });
      });
    }
  }
}

export default Myorders;