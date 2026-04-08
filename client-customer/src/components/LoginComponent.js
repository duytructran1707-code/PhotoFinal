// ─── LoginComponent.js ────────────────────────────────────────────────────
import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
 
class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: '', txtPassword: '', loading: false };
  }
  render() {
    return (
      <div className="auth-page">
        <div className="auth-split">
          <div className="auth-image-side">
            <div className="auth-quote">
              <div className="auth-quote-text">"Photography is the story I fail to put into words."</div>
              <div className="auth-quote-author">Destin Sparks</div>
            </div>
          </div>
          <div className="auth-form-side">
            <div className="auth-card">
          <div className="auth-logo">ShotOfLife</div>
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your account to continue</div>
          <div className="auth-form-row">
            <label>Username</label>
            <input type="text" placeholder="Enter your username" value={this.state.txtUsername} onChange={e => this.setState({ txtUsername: e.target.value })} />
          </div>
          <div className="auth-form-row">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={this.state.txtPassword} onChange={e => this.setState({ txtPassword: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') this.handleLogin(); }} />
          </div>
          <button className="auth-btn" onClick={() => this.handleLogin()} disabled={this.state.loading}>
            {this.state.loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="auth-footer">
            Don't have an account? <a onClick={() => this.props.navigate('/signup')} style={{ cursor:'pointer' }}>Sign up</a>
          </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  handleLogin() {
    const { txtUsername: username, txtPassword: password } = this.state;
    if (!username || !password) { alert('Please enter username and password'); return; }
    this.setState({ loading: true });
    axios.post('/api/customer/login', { username, password }).then(res => {
      this.setState({ loading: false });
      if (res.data.success) {
        this.context.setToken(res.data.token);
        this.context.setCustomer(res.data.customer);
        this.props.navigate('/home');
      } else {
        alert(res.data.message);
      }
    }).catch(() => { this.setState({ loading: false }); alert('Connection error'); });
  }
}
 
export { Login };
export default withRouter(Login);