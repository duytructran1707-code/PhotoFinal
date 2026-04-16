import React, { Component } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      loading: false
    };
  }

  render() {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">ShotOfLife</div>
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Join thousands of happy customers</div>

          {['Username', 'Password', 'Full name', 'Phone', 'Email'].map((lbl, i) => {
            const keys = ['txtUsername', 'txtPassword', 'txtName', 'txtPhone', 'txtEmail'];
            const types = ['text', 'password', 'text', 'tel', 'email'];
            return (
              <div key={i} className="auth-form-row">
                <label>{lbl}</label>
                <input
                  type={types[i]}
                  placeholder={`Enter your ${lbl.toLowerCase()}`}
                  value={this.state[keys[i]]}
                  onChange={e => this.setState({ [keys[i]]: e.target.value })}
                />
              </div>
            );
          })}

          <button
            className="auth-btn"
            onClick={() => this.handleSignup()}
            disabled={this.state.loading}
          >
            {this.state.loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="auth-footer">
            Already have an account?{' '}
            <button onClick={() => this.props.navigate('/login')}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  handleSignup() {
    const { txtUsername: username, txtPassword: password, txtName: name, txtPhone: phone, txtEmail: email } = this.state;

    if (!username || !password || !name || !phone || !email) {
      alert('Please fill all fields');
      return;
    }

    this.setState({ loading: true });

    axios.post('/api/customer/signup', { username, password, name, phone, email })
      .then(res => {
        this.setState({ loading: false });
        alert(res.data.message);
        if (res.data.success) this.props.navigate('/active');
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }
}

// HOC for navigation
function withRouter(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

export default withRouter(Signup);