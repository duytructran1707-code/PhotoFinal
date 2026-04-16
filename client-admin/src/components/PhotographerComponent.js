import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import PhotographerDetail from './PhotographerDetailComponent';
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

function getAvatarSrc(avatar, name = '') {
  if (!avatar) return getFallbackAvatar(name);
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (avatar.startsWith('data:')) return avatar;
  return 'data:image/jpeg;base64,' + avatar;
}

class Photographer extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      photographers: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  render() {
    const photographers = this.state.photographers.map((item) => {
      const serviceName = item.service?.service_name || item.service?.name || item.role || 'N/A';
      const isSelected = this.state.itemSelected?._id === item._id;
      return (
        <tr
          key={item._id}
          className={`datatable${isSelected ? ' selected' : ''}`}
          onClick={() => this.trItemClick(item)}
        >
          <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-faint)' }}>
            {item._id?.slice(-8)}
          </td>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={getAvatarSrc(item.avatar, item.name)}
                alt={item.name}
                className="photographer-avatar"
                onError={(e) => { e.target.src = getFallbackAvatar(item.name); }}
              />
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{item.location || 'Vietnam'}</div>
              </div>
            </div>
          </td>
          <td>{item.location || 'Vietnam'}</td>
          <td style={{ color: 'var(--gold)' }}>{(item.pricePerHour || 0).toLocaleString('vi-VN')} ₫/hr</td>
          <td>
            <span style={{
              background: 'rgba(107,123,94,0.12)',
              color: 'var(--sage-lt)',
              border: '1px solid rgba(107,123,94,0.22)',
              borderRadius: '4px',
              fontSize: '11px',
              padding: '2px 8px',
              fontWeight: 500,
            }}>{serviceName}</span>
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const page = index + 1;
      if (page === this.state.curPage) {
        return <span key={page}><b>{page}</b></span>;
      } else {
        return <span key={page} className="link" onClick={() => this.lnkPageClick(page)}>{page}</span>;
      }
    });

    return (
      <div className="admin-split-layout">
        <div className="admin-split-main">
          <h2 className="text-center">Photographer List</h2>
          <table className="datatable">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Photographer</th>
                <th>Location</th>
                <th>Rate</th>
                <th>Service</th>
              </tr>
              {photographers}
              <tr>
                <td colSpan="5">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="admin-split-sidebar">
          <PhotographerDetail
            item={this.state.itemSelected}
            curPage={this.state.curPage}
            updatePhotographers={this.updatePhotographers}
          />
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetPhotographers(this.state.curPage); }
  lnkPageClick(index) { this.apiGetPhotographers(index); }
  trItemClick(item) { this.setState({ itemSelected: item }); }

  apiGetPhotographers(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/photographers?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ photographers: result.photographers, noPages: result.noPages, curPage: result.curPage });
    });
  }

  updatePhotographers = (photographers, noPages, curPage) => {
    this.setState({ photographers, noPages, curPage });
  }
}

export default Photographer;
