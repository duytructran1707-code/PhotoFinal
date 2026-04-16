import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ServiceDetail from './ServiceDetailComponent';

class Service extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  render() {
    const rows = this.state.services.map((item) => {
      const name = item.service_name || item.name;
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
          <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{name}</td>
          <td style={{ maxWidth: '280px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
            {item.description}
          </td>
          <td>
            <span style={{
              background: 'rgba(107,123,94,0.10)',
              color: 'var(--sage-lt)',
              border: '1px solid rgba(107,123,94,0.20)',
              borderRadius: '4px',
              fontSize: '11px',
              padding: '2px 9px',
              fontWeight: 500,
            }}>
              {item.duration || 0}h
            </span>
          </td>
          <td style={{ color: 'var(--gold)', fontWeight: 500 }}>
            {(item.price || 0).toLocaleString('vi-VN')} ₫
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
          <h2 className="text-center">Service List</h2>
          <table className="datatable">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price</th>
              </tr>
              {rows}
              <tr>
                <td colSpan="5">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="admin-split-sidebar">
          <ServiceDetail
            item={this.state.itemSelected}
            curPage={this.state.curPage}
            updateServices={this.updateServices}
          />
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetServices(this.state.curPage); }
  lnkPageClick(index) { this.apiGetServices(index); }
  trItemClick(item) { this.setState({ itemSelected: item }); }

  apiGetServices(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/services?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ services: result.services, noPages: result.noPages, curPage: result.curPage });
    });
  }

  updateServices = (services, noPages, curPage) => {
    this.setState({ services, noPages, curPage });
  }
}

export default Service;
