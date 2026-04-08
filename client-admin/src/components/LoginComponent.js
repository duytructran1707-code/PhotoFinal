import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="align-valign-center">
          {/* Decorative film grain lines */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,185,160,0.015) 2px, rgba(200,185,160,0.015) 4px)',
            pointerEvents: 'none',
          }} />

          {/* Brand mark */}
          <div style={{ textAlign: 'center', marginBottom: '10px', position: 'relative' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '38px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--warm-beige)',
              letterSpacing: '2px',
              lineHeight: 1,
            }}>ShotOfLife</div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '3.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginTop: '6px',
            }}>Admin · Photographer Booking System</div>
          </div>

          {/* Divider */}
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--sunset)',
            margin: '20px auto 28px',
            opacity: 0.6,
          }} />

          {/* Login card */}
          <form onSubmit={(e) => { e.preventDefault(); this.btnLoginClick(e); }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-md)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 40px',
              boxShadow: 'var(--shadow-lg), 0 0 60px rgba(196,114,58,0.05)',
              minWidth: '380px',
              position: 'relative',
            }}>
              {/* Top accent line */}
              <div style={{
                position: 'absolute',
                top: 0, left: '32px', right: '32px',
                height: '1.5px',
                background: 'var(--grad-sunset)',
                borderRadius: '0 0 2px 2px',
                opacity: 0.7,
              }} />

              {/* Username */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}>Username</label>
                <input
                  id="admin-username"
                  type="text"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}>Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={this.state.txtPassword}
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit */}
              <input
                type="submit"
                value="LOGIN"
                style={{ width: '100%', padding: '11px', fontSize: '12px', letterSpacing: '2px' }}
              />
            </div>
          </form>

          {/* Tagline */}
          <div style={{
            marginTop: '28px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-faint)',
            textAlign: 'center',
          }}>
            "Every frame tells a story."
          </div>
        </div>
      );
    }
    return <div />;
  }

  btnLoginClick(e) {
    if (e && e.preventDefault) e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      this.apiLogin({ username, password });
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}

export default Login;
