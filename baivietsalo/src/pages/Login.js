import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      navigate('/blogs');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="row h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={require('../bg/aaa.jpg')} alt="Login Banner" className="img-fluid image-opacity" />
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="login-form">
            <h2 className="text-center">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
            </form>
            <div className="mt-3 text-center">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
