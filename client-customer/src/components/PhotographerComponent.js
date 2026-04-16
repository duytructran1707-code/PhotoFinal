import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import avatar1 from '../assets/imgs/avatar1.jpg';
import avatar2 from '../assets/imgs/avatar2.jpg';
const FALLBACK_AVATARS = [avatar1, avatar2];

// ── helpers ──────────────────────────────────────────────
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

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(-2).join('').toUpperCase();
}

// Muted cinematic placeholder gradients
const PLACEHOLDER_GRADS = [
  'linear-gradient(145deg, #3D3629 0%, #2E2920 100%)',
  'linear-gradient(145deg, #2E3028 0%, #252118 100%)',
  'linear-gradient(145deg, #342820 0%, #2A2218 100%)',
  'linear-gradient(145deg, #2C2E28 0%, #20221E 100%)',
];

// ── Star rating display ───────────────────────────────────
function StarRating({ rating }) {
  const r = parseFloat(rating) || 0;
  const full  = Math.floor(r);
  const half  = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="pcard-stars-row">
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(empty)}
      <span className="pcard-rating-num">{r > 0 ? r.toFixed(1) : 'New'}</span>
    </span>
  );
}

// ── Single Photographer Card ──────────────────────────────
function PCardItem({ item, index }) {
  const avatarSrc = getAvatarSrc(item.avatar, item.name);
  const initials  = getInitials(item.name);
  const grad      = PLACEHOLDER_GRADS[index % PLACEHOLDER_GRADS.length];
  const service   = item.service?.service_name || item.service?.name || null;

  return (
    <div className="photo-card">
      {/* Image area */}
      <Link to={'/photographer/' + item._id} className="photo-card__img-wrap">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={item.name}
            className="photo-card__img"
            onError={e => { e.target.src = getFallbackAvatar(item.name); }}
          />
        ) : null}
        <div
          className="photo-card__initials"
          style={{ background: grad, display: avatarSrc ? 'none' : 'flex' }}
        >
          {initials}
        </div>

        {/* Hover overlay */}
        <div className="photo-card__overlay">
          <span className="photo-card__overlay-text">View Profile</span>
        </div>
      </Link>

      {/* Body */}
      <div className="photo-card__body">
        {/* Name row */}
        <div className="photo-card__name-row">
          <Link to={'/photographer/' + item._id} className="photo-card__name">
            {item.name}
          </Link>
          <StarRating rating={item.rating} />
        </div>

        {/* Location */}
        <div className="photo-card__location">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {item.location || 'Vietnam'}
        </div>

        {/* Service badge */}
        {service && (
          <div className="photo-card__service">{service}</div>
        )}

        {/* Divider */}
        <div className="photo-card__divider" />

        {/* Footer: price + book */}
        <div className="photo-card__footer">
          <div className="photo-card__price">
            <span className="photo-card__price-amount">
              {(item.pricePerHour || 0).toLocaleString('vi-VN')}₫
            </span>
            <span className="photo-card__price-unit">/giờ</span>
          </div>
          <Link to={'/photographer/' + item._id} className="photo-card__book-btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Photographer List Component ─────────────────────
class Photographer extends Component {
  constructor(props) {
    super(props);
    this.state = { photographers: [], loading: true, keyword: '' };
  }

  render() {
    const { photographers, loading } = this.state;
    const params = this.props.params;
    const isSearch = params.keyword && params.keyword !== 'all';
    const pageTitle = isSearch
      ? `Results for "${params.keyword}"`
      : params.sid ? 'Photographers by Service' : 'All Photographers';

    return (
      <div className="photo-list-page">
        {/* Page header */}
        <div className="photo-list-header">
          <div>
            <h1 className="photo-list-title">{pageTitle}</h1>
            {!loading && (
              <p className="photo-list-count">
                {photographers.length} photographer{photographers.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="photo-list-loading">
            <div className="photo-list-spinner" />
            <span>Searching photographers…</span>
          </div>
        )}

        {/* Empty */}
        {!loading && photographers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📷</div>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>
              No photographers found
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              Try a different keyword or browse all photographers
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && photographers.length > 0 && (
          <div className="photo-grid">
            {photographers.map((item, i) => (
              <PCardItem key={item._id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.loadData(this.props.params);
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    const prev   = prevProps.params;
    if (params.sid !== prev.sid || params.keyword !== prev.keyword) {
      this.loadData(params);
    }
  }

  loadData(params) {
    this.setState({ loading: true });
    if (params.sid) {
      this.apiGetByServiceID(params.sid);
    } else if (params.keyword) {
      this.apiGetByKeyword(params.keyword);
    } else {
      this.setState({ loading: false });
    }
  }

  apiGetByServiceID(sid) {
    axios.get('/api/customer/photographers/service/' + sid).then(res => {
      this.setState({ photographers: Array.isArray(res.data) ? res.data : [], loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  apiGetByKeyword(keyword) {
    const url = keyword === 'all'
      ? '/api/customer/photographers'
      : '/api/customer/photographers/search/' + keyword;
    axios.get(url).then(res => {
      this.setState({ photographers: Array.isArray(res.data) ? res.data : [], loading: false });
    }).catch(() => this.setState({ loading: false }));
  }
}

export default withRouter(Photographer);
