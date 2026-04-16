import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { services: [], txtKeyword: '', showMore: false };
  }

  render() {
    const { services } = this.state;
    return (
      <div className="navbar">
        <Link to="/home" className="navbar-logo">ShotOfLife</Link>

        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <div className="nav-dropdown-wrap" 
            onMouseEnter={() => this.setState({ showMore: true })} 
            onMouseLeave={() => this.setState({ showMore: false })}
          >
            <span className="nav-dropdown-toggle">
              SERVICES ▾
            </span>
            {this.state.showMore && (
              <div className="nav-service-drop">
                {services.map(s => (
                  <Link key={s._id} to={'/photographer/service/' + s._id} onClick={() => this.setState({ showMore: false })}>{s.service_name || s.name}</Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/photographer/search/all">Photographers</Link>
          <Link to="/gallery">Gallery</Link>
        </div>

        <div className="navbar-right">
          <div className="nav-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search photographers..."
              value={this.state.txtKeyword}
              onChange={e => this.setState({ txtKeyword: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') this.doSearch(); }}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetServices();
    document.addEventListener('click', this.handleOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutside);
  }
  handleOutside = (e) => {
    // nothing to handle
  }
  doSearch() {
    const kw = this.state.txtKeyword.trim();
    if (kw) this.props.navigate('/photographer/search/' + kw);
  }
  apiGetServices() {
    axios.get('/api/customer/services').then(res => {
      if (Array.isArray(res.data)) {
        const unique = res.data.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
        this.setState({ services: unique });
      }
    });
  }
}

export default withRouter(Menu);