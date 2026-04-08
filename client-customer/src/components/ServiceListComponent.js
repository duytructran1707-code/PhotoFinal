import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: []
    };
  }
  render() {
    const list = (this.state.services || []).map((item) => {
      return (
        <div key={item._id} className="card">
          <Link to={'/photographer/service/' + item._id}>
            <img src={item.icon_url || 'https://via.placeholder.com/300?text=Service'} className="card-img" alt={item.name} />
          </Link>
          <div className="card-title">{item.service_name || item.name}</div>
          <div className="text-center text-muted" style={{ padding: '0 1rem', fontSize: '0.9rem' }}>{item.description}</div>
          <div className="card-price" style={{ marginTop: '1rem' }}>From {item.price?.toLocaleString()} đ</div>
          <Link to={'/photographer/service/' + item._id} className="btn-primary">Find Photographers</Link>
        </div>
      );
    });
    return (
      <div className="margin-top">
        <h2 className="text-center">OUR SERVICES</h2>
        <div className="card-grid">
          {list}
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetServices();
  }
  apiGetServices() {
    axios.get('/api/customer/services').then((res) => {
      if (Array.isArray(res.data)) this.setState({ services: res.data });
    });
  }
}
export default ServiceList;
