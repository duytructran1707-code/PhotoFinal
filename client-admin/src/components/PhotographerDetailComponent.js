import axios from 'axios';
import React, { Component } from 'react';
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

function getAvatarSrc(avatar, name = '') {
  if (!avatar) return getFallbackAvatar(name);
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (avatar.startsWith('data:')) return avatar;
  return 'data:image/jpeg;base64,' + avatar;
}

function FieldRow({ label, children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr',
      gap: '10px',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <label style={{
        fontSize: '10.5px',
        fontWeight: 600,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>{label}</label>
      <div>{children}</div>
    </div>
  );
}

class PhotographerDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      txtID: '',
      txtName: '',
      txtRole: '',
      txtBio: '',
      txtPhone: '',
      txtEmail: '',
      txtLocation: '',
      txtPricePerHour: 0,
      txtRating: 0,
      cmbService: '',
      imgAvatar: '',
    };
  }

  render() {
    const svcs = this.state.services.map((svc) => {
      const name = svc.service_name || svc.name;
      return <option key={svc._id} value={svc._id}>{name}</option>;
    });

    const set = (key) => (e) => this.setState({ [key]: e.target.value });

    return (
      <div>
        <h2 className="text-center">Photographer Detail</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow)',
            minWidth: '360px',
          }}>
            {/* Avatar preview */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img
                src={this.state.imgAvatar || getFallbackAvatar(this.state.txtName)}
                alt="Avatar Preview"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-md)',
                  boxShadow: 'var(--shadow)',
                  filter: 'saturate(0.80)',
                }}
                onError={(e) => { e.target.src = getFallbackAvatar(this.state.txtName); }}
              />
            </div>

            <FieldRow label="ID">
              <input type="text" value={this.state.txtID} readOnly />
            </FieldRow>
            <FieldRow label="Name">
              <input type="text" value={this.state.txtName} onChange={set('txtName')} placeholder="Full name" />
            </FieldRow>
            <FieldRow label="Role">
              <input type="text" value={this.state.txtRole} onChange={set('txtRole')} placeholder="e.g. Portrait, Wedding" />
            </FieldRow>
            <FieldRow label="Bio">
              <input type="text" value={this.state.txtBio} onChange={set('txtBio')} placeholder="Short bio" />
            </FieldRow>
            <FieldRow label="Phone">
              <input type="text" value={this.state.txtPhone} onChange={set('txtPhone')} placeholder="Phone number" />
            </FieldRow>
            <FieldRow label="Email">
              <input type="text" value={this.state.txtEmail} onChange={set('txtEmail')} placeholder="Email address" />
            </FieldRow>
            <FieldRow label="Location">
              <input type="text" value={this.state.txtLocation} onChange={set('txtLocation')} placeholder="City / Province" />
            </FieldRow>
            <FieldRow label="Rate (₫/hr)">
              <input type="number" value={this.state.txtPricePerHour} onChange={set('txtPricePerHour')} />
            </FieldRow>
            <FieldRow label="Rating">
              <input type="number" min="0" max="5" step="0.1" value={this.state.txtRating} onChange={set('txtRating')} />
            </FieldRow>
            <FieldRow label="Service">
              <select value={this.state.cmbService} onChange={set('cmbService')}>
                <option value="">— Select service —</option>
                {svcs}
              </select>
            </FieldRow>
            <FieldRow label="Avatar">
              <input type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => this.previewImage(e)} />
            </FieldRow>

            <div style={{ paddingTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input type="submit" value="ADD" onClick={(e) => this.btnAddClick(e)} />
              <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
              <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
            </div>
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetServices();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      const i = this.props.item;
      const avatar = getAvatarSrc(i.avatar, i.name);
      this.setState({
        txtID: i._id,
        txtName: i.name,
        txtRole: i.role || '',
        txtBio: i.bio || '',
        txtPhone: i.phone || '',
        txtEmail: i.email || '',
        txtLocation: i.location || '',
        txtPricePerHour: i.pricePerHour || 0,
        txtRating: i.rating || 0,
        cmbService: i.service?._id || '',
        imgAvatar: avatar,
      });
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => this.setState({ imgAvatar: evt.target.result });
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName: name, txtRole: role, txtBio: bio, txtPhone: phone, txtEmail: email,
      txtLocation: location, txtPricePerHour: pricePerHour,
      txtRating: rating, cmbService: serviceID, imgAvatar } = this.state;
    const avatar = imgAvatar.replace(/^data:image\/[a-z]+;base64,/, '');
    if (name && serviceID && imgAvatar) {
      this.apiPostPhotographer({
        name, role, bio, phone, email, location,
        pricePerHour: parseInt(pricePerHour),
        rating: parseFloat(rating),
        serviceID, avatar,
      });
    } else {
      alert('Please input name, service and avatar');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID: id, txtName: name, txtRole: role, txtBio: bio, txtPhone: phone, txtEmail: email,
      txtLocation: location, txtPricePerHour: pricePerHour,
      txtRating: rating, cmbService: serviceID, imgAvatar } = this.state;
    const avatar = imgAvatar.replace(/^data:image\/[a-z]+;base64,/, '');
    if (id && name) {
      this.apiPutPhotographer(id, {
        name, role, bio, phone, email, location,
        pricePerHour: parseInt(pricePerHour),
        rating: parseFloat(rating),
        serviceID, avatar,
      });
    } else {
      alert('Please select a photographer to update');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('Delete this photographer?')) {
      const { txtID: id } = this.state;
      if (id) this.apiDeletePhotographer(id);
      else alert('Please select a photographer');
    }
  }

  apiGetServices() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/services', config).then((res) => {
      const result = res.data;
      this.setState({ services: result.services || result });
    });
  }

  apiGetPhotographers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/photographers?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.photographers.length !== 0) {
        this.props.updatePhotographers(result.photographers, result.noPages, result.curPage);
      } else {
        axios.get('/api/admin/photographers?page=' + (this.props.curPage - 1), config).then((res2) => {
          const r = res2.data;
          this.props.updatePhotographers(r.photographers, r.noPages, r.curPage);
        });
      }
    });
  }

  apiPostPhotographer(data) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/photographers', data, config).then((res) => {
      if (res.data) { alert('Photographer added!'); this.apiGetPhotographers(); }
      else alert('Failed to add photographer.');
    });
  }

  apiPutPhotographer(id, data) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/photographers/' + id, data, config).then((res) => {
      if (res.data) { alert('Photographer updated!'); this.apiGetPhotographers(); }
      else alert('Failed to update photographer.');
    });
  }

  apiDeletePhotographer(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/photographers/' + id, config).then((res) => {
      if (res.data) { alert('Photographer deleted!'); this.apiGetPhotographers(); }
      else alert('Failed to delete photographer.');
    });
  }
}

export default PhotographerDetail;
