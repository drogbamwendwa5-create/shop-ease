import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Required fields check
    if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirm) {
      toast.error('All fields are required');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Password strength validation (At least 8 chars, 1 uppercase, 1 number)
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      toast.error('Password must contain at least one number');
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirm) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
      navigate('/'); // Redirect to home after successful signup
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', margin: '40px auto' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '5px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '14px' }}>
          Join us and start shopping today
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input type="text" name="username" className="form-control" placeholder="johndoe123" value={formData.username} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phone" className="form-control" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" className="form-control" placeholder="Min 8 chars, 1 uppercase, 1 number" value={formData.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirm" className="form-control" placeholder="Re-enter your password" value={formData.confirm} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
