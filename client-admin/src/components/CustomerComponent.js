import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

function ActiveBadge({ active }) {
  if (active === 1) return (
    <span style={{
      background: 'rgba(107,155,124,0.12)', color: 'var(--status-confirmed)',
      border: '1px solid rgba(107,155,124,0.22)', borderRadius: '4px',
      fontSize: '10.5px', padding: '2px 8px', fontWeight: 600,
    }}>Active</span>
  );
  return (
    <span style={{
      background: 'rgba(140,140,140,0.10)', color: 'var(--smoke)',
      border: '1px solid rgba(140,140,140,0.20)', borderRadius: '4px',
      fontSize: '10.5px', padding: '2px 8px', fontWeight: 600,
    }}>Inactive</span>
  );
}

class Customer extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { customers: [] };
  }

  render() {
    const rows = this.state.customers.map((item) => (
      <tr key={item._id} className="datatable">
        <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-faint)' }}>
          {item._id?.slice(-8)}
        </td>
        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.username}</td>
        <td style={{ color: 'var(--text-faint)', letterSpacing: '1px' }}>••••••••</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td><ActiveBadge active={item.active} /></td>
        <td>
          {item.active === 1 && (
            <span
              className="link link-deactive"
              onClick={() => this.lnkDeactiveClick(item)}
            >Deactivate</span>
          )}
        </td>
      </tr>
    ));

    return (
      <div>
        <h2 className="text-center">Customer List</h2>
        <table className="datatable">
          <tbody>
            <tr className="datatable">
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

  componentDidMount() { this.apiGetCustomers(); }

  lnkDeactiveClick(item) { this.apiPutCustomerDeactive(item._id, item.token); }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, { token }, config).then((res) => {
      if (res.data) this.apiGetCustomers();
      else alert('FAIL!');
    });
  }
}

export default Customer;
