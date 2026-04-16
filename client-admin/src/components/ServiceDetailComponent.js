import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// Reusable field row for the detail panel
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

class ServiceDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      txtDescription: '',
      txtDuration: 0,
      txtPrice: 0,
    };
  }

  render() {
    const set = (key) => (e) => this.setState({ [key]: e.target.value });
    return (
      <div>
        <h2 className="text-center">Service Detail</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow)',
            minWidth: '340px',
          }}>
            <FieldRow label="ID">
              <input type="text" value={this.state.txtID} readOnly />
            </FieldRow>
            <FieldRow label="Name">
              <input type="text" value={this.state.txtName} onChange={set('txtName')} placeholder="Service name" />
            </FieldRow>
            <FieldRow label="Description">
              <input type="text" value={this.state.txtDescription} onChange={set('txtDescription')} placeholder="Short description" />
            </FieldRow>
            <FieldRow label="Duration (h)">
              <input type="number" value={this.state.txtDuration} onChange={set('txtDuration')} />
            </FieldRow>
            <FieldRow label="Price (₫)">
              <input type="number" value={this.state.txtPrice} onChange={set('txtPrice')} />
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

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      const { item } = this.props;
      this.setState({
        txtID: item._id,
        txtName: item.service_name || item.name || '',
        txtDescription: item.description || '',
        txtDuration: item.duration || 0,
        txtPrice: item.price || 0,
      });
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName: service_name, txtDescription: description, txtDuration: duration, txtPrice: price } = this.state;
    if (service_name) {
      this.apiPostService({ service_name, description, duration, price });
    } else {
      alert('Please input name');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID: id, txtName: service_name, txtDescription: description, txtDuration: duration, txtPrice: price } = this.state;
    if (id && service_name) {
      this.apiPutService(id, { service_name, description, duration, price });
    } else {
      alert('Please select a service to update');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('Delete this service?')) {
      const { txtID: id } = this.state;
      if (id) this.apiDeleteService(id);
      else alert('Please select a service');
    }
  }

  apiGetServices() {
    const config = { headers: { 'x-access-token': this.context.token } };
    const page = this.props.curPage || 1;
    axios.get('/api/admin/services?page=' + page, config).then((res) => {
      const result = res.data;
      this.props.updateServices(result.services, result.noPages, result.curPage);
    });
  }

  apiPostService(service) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/services', service, config).then((res) => {
      if (res.data) { alert('Service added!'); this.apiGetServices(); }
      else alert('Failed to add service.');
    });
  }

  apiPutService(id, service) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/services/' + id, service, config).then((res) => {
      if (res.data) { alert('Service updated!'); this.apiGetServices(); }
      else alert('Failed to update service.');
    });
  }

  apiDeleteService(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/services/' + id, config).then((res) => {
      if (res.data) { alert('Service deleted!'); this.apiGetServices(); }
      else alert('Failed to delete service.');
    });
  }
}

export default ServiceDetail;
