import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import avatar1 from '../assets/imgs/avatar1.jpg';
import avatar2 from '../assets/imgs/avatar2.jpg';
const FALLBACK_AVATARS = [avatar1, avatar2];

const GRADS = [
  'linear-gradient(135deg,#6C47D9,#A855F7)',
  'linear-gradient(135deg,#EC4899,#F97316)',
  'linear-gradient(135deg,#0EA5E9,#6366F1)',
  'linear-gradient(135deg,#A855F7,#EC4899)',
  'linear-gradient(135deg,#10B981,#0EA5E9)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
];

// Helper: lấy initials từ tên
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
}

function getFallbackAvatar(name = '') {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('nguyễn văn a') || lowerName.endsWith(' a') || name === 'A') return FALLBACK_AVATARS[0];
  if (lowerName.includes('nguyễn văn b') || lowerName.endsWith(' b') || name === 'B') return FALLBACK_AVATARS[1];
  const hash = name ? name.charCodeAt(0) + name.charCodeAt(name.length - 1) : 0;
  return FALLBACK_AVATARS[hash % 2];
}

function getAvatarSrc(avatar, name = '') {
  if (!avatar) return getFallbackAvatar(name);
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (avatar.startsWith('data:')) return avatar;
  return 'data:image/jpeg;base64,' + avatar;
}

function PCard({ item, index }) {
  const initials = getInitials(item.name);
  const grad = GRADS[index % GRADS.length];
  const avatarSrc = getAvatarSrc(item.avatar, item.name);
  const isTop = (item.rating || 0) >= 4.9;

  return (
    <Link to={'/photographer/' + item._id} className="pcard">
      <div className="pcard-img">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={item.name}
            onError={e => {
              e.target.src = getFallbackAvatar(item.name);
            }}
          />
        ) : null}
        {/* Fallback avatar chữ — ẩn mặc định nếu có ảnh */}
        <div
          className="pcard-avatar"
          style={{
            background: grad,
            display: avatarSrc ? 'none' : 'flex',
          }}
        >
          {initials}
        </div>
        {isTop && <div className="pcard-badge">Top rated</div>}
      </div>
      <div className="pcard-body">
        <div className="pcard-top">
          <div className="pcard-name">{item.name}</div>
          <div className="pcard-rating">
            <span style={{ color: '#F59E0B' }}>★</span>
            {(item.rating || 5).toFixed(1)}
          </div>
        </div>
        <div className="pcard-loc">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {item.location || 'Vietnam'}
        </div>
        {item.service && (
          <div className="pcard-tags">
            <span className="tag tag-purple">{item.service.name}</span>
          </div>
        )}
        <div className="pcard-foot">
          <div className="pcard-price">
            {item.pricePerHour?.toLocaleString('vi-VN')}đ
            <small>/giờ</small>
          </div>
          <button className="btn-view">View Portfolio</button>
        </div>
      </div>
    </Link>
  );
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPhotographers: [],
      topRatedPhotographers: [],
      services: [],
      activeFilter: 'All',
      searchLocation: '',
      searchService: '',
      searchPrice: '',
    };
  }

  doHeroSearch = () => {
    if (this.state.searchService) {
      this.props.navigate('/photographer/service/' + this.state.searchService);
    } else if (this.state.searchLocation) {
      this.props.navigate('/photographer/search/' + encodeURIComponent(this.state.searchLocation));
    } else {
      this.props.navigate('/photographer/search/all');
    }
  }

  render() {
    const { newPhotographers, topRatedPhotographers, activeFilter } = this.state;
    const filteredTop = activeFilter === 'All' 
      ? topRatedPhotographers 
      : topRatedPhotographers.filter(p => p.service?.name?.toLowerCase().includes(activeFilter.toLowerCase()) || p.role?.toLowerCase().includes(activeFilter.toLowerCase()));

    return (
      <div>
        {/* HERO */}
        <div className="hero">
          <h1>Find Your <em>Perfect</em><br />Photographer</h1>
          <p>Book professional photographers for weddings, portraits, events and more.</p>
          <div className="hero-btns">
            <button className="btn-white"
              onClick={() => document.getElementById('top-sec')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Photographers
            </button>
            <button className="btn-ghost">Become a Photographer</button>
          </div>
          <div className="hero-filters">
            <div className="filter-grp">
              <label>Location</label>
              <select value={this.state.searchLocation} onChange={e => this.setState({ searchLocation: e.target.value })}>
                <option value="">All cities</option>
                <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                <option value="Ha Noi">Ha Noi</option>
                <option value="Da Nang">Da Nang</option>
                <option value="Hue">Hue</option>
              </select>
            </div>
            <div className="filter-div" />
            <div className="filter-grp">
              <label>Service</label>
              <select value={this.state.searchService} onChange={e => this.setState({ searchService: e.target.value })}>
                <option value="">All services</option>
                {this.state.services.map(s => (
                  <option key={s._id} value={s._id}>{s.service_name || s.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-div" />
            <div className="filter-grp">
              <label>Price range</label>
              <select value={this.state.searchPrice} onChange={e => this.setState({ searchPrice: e.target.value })}>
                <option value="">Any price</option>
                <option value="Under 500k/h">Under 500k/h</option>
                <option value="500k – 1M/h">500k – 1M/h</option>
                <option value="Above 1M/h">Above 1M/h</option>
              </select>
            </div>
            <button className="hero-search-btn" onClick={this.doHeroSearch}>Search</button>
          </div>
        </div>

        {/* TOP PHOTOGRAPHERS */}
        <div className="section" id="top-sec">
          <div className="section-head">
            <div>
              <div className="section-title">Top <span>Photographers</span></div>
              <div className="section-sub">Hand-picked professionals with outstanding reviews</div>
            </div>
            <Link to="/photographer/search/all" className="see-all">See all →</Link>
          </div>
          <div className="filter-bar">
            {['All','Wedding','Portrait','Event','Product','Travel'].map(f => (
              <button key={f}
                className={`pill${this.state.activeFilter === f ? ' active' : ''}`}
                onClick={() => this.setState({ activeFilter: f })}>
                {f}
              </button>
            ))}
          </div>
          <div className="cards-grid">
            {filteredTop.length > 0
              ? filteredTop.map((p, i) => <PCard key={p._id} item={p} index={i} />)
              : <p style={{ color: 'var(--text3)', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
                  No photographers found. Add some from Admin panel.
                </p>
            }
          </div>
        </div>

        {/* NEW ARRIVALS */}
        {newPhotographers.length > 0 && (
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <div className="section-title">New <span>Arrivals</span></div>
                <div className="section-sub">Fresh talents joining our platform</div>
              </div>
              <Link to="/photographer/search/all" className="see-all">See all →</Link>
            </div>
            <div className="cards-grid">
              {newPhotographers.map((p, i) => <PCard key={p._id} item={p} index={i} />)}
            </div>
          </div>
        )}

        {/* WHY US */}
        <div className="why-section">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">Why choose <span>us?</span></div>
            <div className="section-sub" style={{ marginTop: 6 }}>Everything you need to book the perfect photographer</div>
          </div>
          <div className="why-grid">
            {[
              { icon: '✓', bg: '#EDE9FE', title: 'Verified photographers', desc: 'All photographers are verified and reviewed by our team for quality assurance.' },
              { icon: '◈', bg: '#FCE7F3', title: 'Easy scheduling',        desc: 'Pick your date, time and location. Instant confirmation with no back-and-forth.' },
              { icon: '⊙', bg: '#EFF6FF', title: 'Secure payment',         desc: 'Protected transactions with full refund policy if anything goes wrong.' },
              { icon: '◎', bg: '#ECFDF5', title: '24/7 support',           desc: 'Our team is always ready to help you before, during, and after your booking.' },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-icon" style={{ background: w.bg, color: 'var(--p1)' }}>{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="testi-section">
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div className="section-title">What our <span>customers say</span></div>
            <div className="section-sub" style={{ marginTop: 6 }}>Real experiences from real people</div>
          </div>
          <div className="testi-grid">
            {[
              { stars:5, text:'"Found an amazing wedding photographer within minutes. The booking process was so smooth and the photos turned out absolutely stunning!"', name:'Linh Hoàng',  role:'Wedding couple, TP.HCM', init:'LH', grad:'linear-gradient(135deg,#6C47D9,#A855F7)' },
              { stars:5, text:'"I booked a portrait session for my company. Super professional photographer, very satisfied with the result. Will definitely book again!"',  name:'Minh Tuấn',   role:'Business owner, Hà Nội',  init:'MT', grad:'linear-gradient(135deg,#EC4899,#F97316)' },
              { stars:4, text:'"Great platform for finding event photographers. The filter system makes it easy to find exactly what you need at the right price."',          name:'Phương Anh', role:'Event organizer, Đà Nẵng', init:'PA', grad:'linear-gradient(135deg,#0EA5E9,#6366F1)' },
            ].map((t, i) => (
              <div key={i} className="tcard">
                <div className="tcard-stars">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                <div className="tcard-text">{t.text}</div>
                <div className="tcard-author">
                  <div className="tcard-ava" style={{ background: t.grad }}>{t.init}</div>
                  <div>
                    <div className="tcard-name">{t.name}</div>
                    <div className="tcard-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">ShotOfLife</div>
              <div className="footer-desc">The easiest way to book professional photographers for any occasion. Trusted by thousands across Vietnam.</div>
              <div className="footer-socials">
                {['f','in','ig','yt'].map(s => <button key={s} className="social-btn">{s}</button>)}
              </div>
            </div>
            <div className="footer-col"><h4>Platform</h4><span>How it works</span><span>Pricing</span><span>Photographers</span><span>Become a pro</span></div>
            <div className="footer-col"><h4>Support</h4><span>Help center</span><span>Contact us</span><span>Cancellation</span><span>Trust & safety</span></div>
            <div className="footer-col"><h4>Contact</h4><span>shotoflife@gmail.com</span><span>+84 123 456 789</span><span>TP. Ho Chi Minh</span></div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 ShotOfLife. All rights reserved.</span>
            <span>Privacy · Terms · Cookies</span>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewPhotographers();
    this.apiGetTopRatedPhotographers();
    this.apiGetServices();
  }

  apiGetNewPhotographers() {
    axios.get('/api/customer/photographers/new').then(res => {
      if (Array.isArray(res.data)) this.setState({ newPhotographers: res.data });
    });
  }
  apiGetTopRatedPhotographers() {
    axios.get('/api/customer/photographers/top-rated').then(res => {
      if (Array.isArray(res.data)) this.setState({ topRatedPhotographers: res.data });
    });
  }
  apiGetServices() {
    axios.get('/api/customer/services').then(res => {
      if (Array.isArray(res.data)) this.setState({ services: res.data });
    });
  }
}

export default withRouter(Home);