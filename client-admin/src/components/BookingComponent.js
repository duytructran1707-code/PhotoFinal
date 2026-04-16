import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// Helper: status badge
function StatusBadge({ status }) {
  const map = {
    PENDING:   { cls: 'badge badge-pending',   label: 'Pending' },
    CONFIRMED: { cls: 'badge badge-confirmed', label: 'Confirmed' },
    DONE:      { cls: 'badge badge-completed', label: 'Completed' },
    CANCELLED: { cls: 'badge badge-cancelled', label: 'Cancelled' },
  };
  const b = map[status] || { cls: 'badge', label: status };
  return <span className={b.cls}>{b.label}</span>;
}

class Booking extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      bookingSelected: null
    };
  }

  render() {
    const rows = this.state.bookings.map((item) => {
      const isSelected = this.state.bookingSelected?._id === item._id;
      return (
        <tr
          key={item._id}
          className={`datatable${isSelected ? ' selected' : ''}`}
          onClick={() => this.trItemClick(item)}
        >
          <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-faint)' }}>
            {item._id?.slice(-8)}
          </td>
          <td>{new Date(item.cdate).toLocaleDateString('vi-VN')}</td>
          <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {item.customer?.name}
          </td>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.photographer?.avatar && (
                <img
                  src={
                    item.photographer.avatar.startsWith('http') || item.photographer.avatar.startsWith('data:')
                      ? item.photographer.avatar
                      : 'data:image/jpeg;base64,' + item.photographer.avatar
                  }
                  alt={item.photographer.name}
                  className="photographer-avatar"
                  style={{ width: '28px', height: '28px', marginRight: '2px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              {item.photographer?.name}
            </div>
          </td>
          <td>{item.service?.name}</td>
          <td>{item.bookingDate}</td>
          <td style={{ color: 'var(--gold)', fontWeight: 500 }}>
            {item.total?.toLocaleString('vi-VN')} ₫
          </td>
          <td><StatusBadge status={item.status} /></td>
          <td>
            {item.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  className="link link-approve"
                  onClick={(e) => { e.stopPropagation(); this.lnkApproveClick(item._id); }}
                >Approve</span>
                <span
                  className="link link-cancel"
                  onClick={(e) => { e.stopPropagation(); this.lnkCancelClick(item._id); }}
                >Cancel</span>
              </div>
            )}
          </td>
        </tr>
      );
    });

    const selected = this.state.bookingSelected;

    return (
      <div>
        {/* Main list */}
        <div className="align-center" style={{ marginBottom: '28px' }}>
          <h2 className="text-center">Booking List</h2>
          <table className="datatable">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Created</th>
                <th>Customer</th>
                <th>Photographer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {rows}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="align-center">
            <h2 className="text-center">Booking Detail</h2>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '24px 28px',
              boxShadow: 'var(--shadow)',
              maxWidth: '560px',
              display: 'grid',
              gap: '0'
            }}>
              {[
                ['Booking ID', <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{selected._id}</span>],
                ['Customer', `${selected.customer?.name} (${selected.customer?.phone})`],
                ['Photographer', selected.photographer?.name],
                ['Service', selected.service?.name],
                ['Booking Date', selected.bookingDate],
                ['Time Slot', selected.timeSlot],
                ['Location', selected.location],
                ['Note', selected.note],
                ['Total', <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{selected.total?.toLocaleString('vi-VN')} ₫</span>],
                ['Status', <StatusBadge status={selected.status} />],
              ].map(([label, value], i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}>{label}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() { this.apiGetBookings(); }
  trItemClick(item) { this.setState({ bookingSelected: item }); }
  lnkApproveClick(id) { this.apiPutBookingStatus(id, 'CONFIRMED'); }
  lnkCancelClick(id) { this.apiPutBookingStatus(id, 'CANCELLED'); }

  apiGetBookings() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/bookings', config).then((res) => {
      this.setState({ bookings: res.data });
    });
  }

  apiPutBookingStatus(id, status) {
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/bookings/' + id + '/status', body, config).then((res) => {
      if (res.data) {
        alert('Status updated!');
        this.apiGetBookings();
      } else {
        alert('FAIL!');
      }
    });
  }
}

export default Booking;
