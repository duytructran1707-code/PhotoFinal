import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext'; // 🔁 adjust path if needed

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername:'',
      txtPassword:'',
      txtName:'',
      txtPhone:'',
      txtEmail:''
    };
  }

  render() {
    if (!this.context.token) return <Navigate replace to="/login" />;

    const c = this.context.customer;
    const initials = c
      ? c.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
      : 'U';

    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-ava">{initials}</div>
            <div>
              <div className="profile-name">{c?.name}</div>
              <div className="profile-email">{c?.email}</div>
            </div>
          </div>

          {[
            { lbl:'Username', key:'txtUsername', type:'text' },
            { lbl:'Password', key:'txtPassword', type:'password' },
            { lbl:'Full name', key:'txtName', type:'text' },
            { lbl:'Phone', key:'txtPhone', type:'tel' },
            { lbl:'Email', key:'txtEmail', type:'email' },
          ].map(({ lbl, key, type }) => (
            <div key={key} className="form-row">
              <label>{lbl}</label>
              <input
                type={type}
                value={this.state[key]}
                onChange={e => this.setState({ [key]: e.target.value })}
              />
            </div>
          ))}

          <button className="update-btn" onClick={() => this.handleUpdate()}>
            Save changes
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const c = this.context.customer;
    if (c) {
      this.setState({
        txtUsername:c.username,
        txtPassword:c.password,
        txtName:c.name,
        txtPhone:c.phone,
        txtEmail:c.email
      });
    }
  }

  handleUpdate() {
    const {
      txtUsername:username,
      txtPassword:password,
      txtName:name,
      txtPhone:phone,
      txtEmail:email
    } = this.state;

    if (!username || !password || !name || !phone || !email) {
      alert('Please fill all fields');
      return;
    }

    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.put(
      '/api/customer/customers/' + this.context.customer._id,
      { username, password, name, phone, email },
      config
    ).then(res => {
      if (res.data) {
        alert('Profile updated!');
        this.context.setCustomer(res.data);
      } else {
        alert('Update failed');
      }
    });
  }
}

export default Myprofile;