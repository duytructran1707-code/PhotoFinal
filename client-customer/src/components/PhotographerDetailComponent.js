// ─── PhotographerDetailComponent.js ───────────────────────────────────────
import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import avatar1 from '../assets/imgs/avatar1.jpg';
import avatar2 from '../assets/imgs/avatar2.jpg';
const FALLBACK_AVATARS = [avatar1, avatar2];

function getFallbackAvatar(name = '') {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('nguyễn văn a') || lowerName.endsWith(' a') || name === 'A') return FALLBACK_AVATARS[0];
  if (lowerName.includes('nguyễn văn b') || lowerName.endsWith(' b') || name === 'B') return FALLBACK_AVATARS[1];
  const hash = name ? name.charCodeAt(0) + name.charCodeAt(name.length - 1) : 0;
  return FALLBACK_AVATARS[hash % 2];
}

class PhotographerDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      photographer: null,
      txtBookingDate: '',
      txtTimeSlot: '',
      txtLocation: '',
      txtNote: '',
      txtDuration: '2',
    };
  }

  render() {
    const p = this.state.photographer;
    if (!p) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading...</div>;

    const initials = p.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    const gradients = ['linear-gradient(135deg,#6C47D9,#A855F7)','linear-gradient(135deg,#EC4899,#F97316)','linear-gradient(135deg,#0EA5E9,#6366F1)','linear-gradient(135deg,#A855F7,#EC4899)'];
    const grad = gradients[p.name.length % gradients.length];
    const total = (p.pricePerHour || 0) * parseInt(this.state.txtDuration || 2);

    return (
      <div className="detail-page">
        <div className="back-link" onClick={() => window.history.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </div>

        <div className="detail-layout">
          {/* LEFT */}
          <div>
            {p.avatar ? (
              <img 
                src={p.avatar.startsWith('http') || p.avatar.startsWith('data:') ? p.avatar : "data:image/jpg;base64," + p.avatar} 
                alt={p.name} 
                className="detail-avatar-img"
                style={{ width:'100%', aspectRatio:'1', objectFit:'cover', borderRadius:'var(--r)', marginBottom:16 }} 
                onError={e => { e.target.src = getFallbackAvatar(p.name); }}
              />
            ) : (
              <img 
                src={getFallbackAvatar(p.name)} 
                alt={p.name} 
                className="detail-avatar-img"
                style={{ width:'100%', aspectRatio:'1', objectFit:'cover', borderRadius:'var(--r)', marginBottom:16 }} 
              />
            )}
            <div className="detail-name">{p.name}</div>
            <div className="detail-service-badge">{p.service?.name}</div>
            <div className="detail-bio">{p.bio}</div>
            <div className="detail-meta">
              <div className="meta-item"><div className="meta-lbl">Location</div><div className="meta-val">{p.location}</div></div>
              <div className="meta-item"><div className="meta-lbl">Rating</div><div className="meta-val">★ {p.rating?.toFixed(1)}</div></div>
              <div className="meta-item"><div className="meta-lbl">Phone</div><div className="meta-val">{p.phone}</div></div>
              <div className="meta-item"><div className="meta-lbl">Email</div><div className="meta-val" style={{ fontSize:12, wordBreak:'break-all' }}>{p.email}</div></div>
            </div>
            {p.portfolio?.length > 0 && (
              <div>
                <div style={{ fontWeight:600, color:'var(--text)', fontSize:14, marginBottom:10 }}>Portfolio</div>
                <div className="detail-portfolio">
                  {p.portfolio.map((url, i) => (
                    <div key={i} className="portfolio-img">
                      <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — BOOKING CARD */}
          <div className="booking-card">
            <div className="booking-card-title">Book a session</div>
            <div className="booking-price-big">
              {p.pricePerHour?.toLocaleString('vi-VN')}đ
              <small style={{ fontWeight:400 }}>/giờ</small>
            </div>

            <div className="form-row">
              <label>Booking date</label>
              <input type="date" value={this.state.txtBookingDate} onChange={e => this.setState({ txtBookingDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="form-2col">
              <div className="form-row">
                <label>Start time</label>
                <input type="time" value={this.state.txtTimeSlot} onChange={e => this.setState({ txtTimeSlot: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Duration (h)</label>
                <select value={this.state.txtDuration} onChange={e => this.setState({ txtDuration: e.target.value })}>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Shoot location</label>
              <input type="text" placeholder="Where do you want to shoot?" value={this.state.txtLocation} onChange={e => this.setState({ txtLocation: e.target.value })} />
            </div>

            <div className="form-row">
              <label>Note (optional)</label>
              <textarea placeholder="Any special requests or notes..." value={this.state.txtNote} onChange={e => this.setState({ txtNote: e.target.value })} />
            </div>

            <div style={{ background:'var(--bg)', borderRadius:'var(--rs)', padding:'12px 16px', marginBottom:14, border:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text2)', marginBottom:4 }}>
                <span>{p.pricePerHour?.toLocaleString('vi-VN')}đ × {this.state.txtDuration}h</span>
                <span style={{ fontWeight:600, color:'var(--text)' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:8, display:'flex', justifyContent:'space-between', fontWeight:600 }}>
                <span>Total</span>
                <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button className="add-btn" onClick={() => this.handleAddBooking()}>
              Add to bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetPhotographer(this.props.params.id);
  }

  apiGetPhotographer(id) {
    axios.get('/api/customer/photographers/' + id).then(res => {
      this.setState({ photographer: res.data });
    });
  }

  handleAddBooking() {
    const { txtBookingDate, txtTimeSlot, txtLocation, txtNote, txtDuration } = this.state;
    if (!txtBookingDate || !txtTimeSlot || !txtLocation) {
      alert('Please fill in booking date, start time and shoot location!'); return;
    }
    const p = this.state.photographer;
    const total = (p.pricePerHour || 0) * parseInt(txtDuration);
    const mybookings = [...this.context.mybookings];
    const idx = mybookings.findIndex(x => x.photographer._id === p._id);
    const finalTimeSlot = `${txtTimeSlot} (${txtDuration}h)`;
    const item = { photographer: p, service: p.service, bookingDate: txtBookingDate, timeSlot: finalTimeSlot, location: txtLocation, note: txtNote, total };
    if (idx === -1) mybookings.push(item); else mybookings[idx] = item;
    this.context.setMybookings(mybookings);
    alert('Added to bookings!');
  }
}

export default withRouter(PhotographerDetail);