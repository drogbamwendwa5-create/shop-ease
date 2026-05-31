import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMail } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form States
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot Password Flow State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Handle Standard Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.identifier || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    // Pass the identifier to context (Context checks if it's the admin email)
    const user = login(formData.identifier);
    
    // Simulate "Remember Me" by adjusting localStorage expiration 
    // (In a real app, this would set a longer-lived refresh token)
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    toast.success('Login Successful!');
    navigate(user.role === 'admin' ? '/admin' : '/');
  };

  // Handle Forgot Password Simulation
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      return toast.error('Please enter your email address');
    }
    
    // Simulate API call delay
    toast.loading('Sending reset link...');
    setTimeout(() => {
      toast.dismiss();
      setResetSent(true);
      toast.success('If an account exists with that email, a reset link has been sent.');
    }, 1500);
  };

  return (
    <div className="container" style={{ maxWidth: '420px', margin: '50px auto' }}>
      <div className="card" style={{ padding: '30px' }}>
        
        {!isForgotPassword ? (
          /* ==================== LOGIN FORM ==================== */
          <>
            <h2 style={{ marginBottom: '5px', textAlign: 'center' }}>Welcome Back</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '14px' }}>
              Sign in to your account to continue
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email or Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter email or username"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label>Password</label>
                <input 
                  type={showPass ? "text" : "password"} 
                  className="form-control" 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required 
                  style={{ paddingRight: '45px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  style={{
                    position: 'absolute', right: '12px', top: '33px', 
                    background: 'none', color: 'var(--text-secondary)', fontSize: '18px'
                  }}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
                  />
                  Remember me
                </label>
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)} 
                  style={{ background: 'none', color: 'var(--primary-color)', fontWeight: '500', fontSize: '14px' }}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Sign In
              </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign Up</Link>
            </p>

            {/* Admin Testing Hint */}
            <div style={{ marginTop: '20px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <strong>Test Admin Login:</strong> admin@store.com (any password)
            </div>
          </>
        ) : (
          /* ==================== FORGOT PASSWORD FORM ==================== */
          <>
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setResetSent(false); }} 
              style={{ background: 'none', color: 'var(--primary-color)', fontWeight: '500', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              ← Back to Login
            </button>

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '40px', color: 'var(--primary-color)', marginBottom: '10px' }}><FiMail /></div>
              <h2 style={{ marginBottom: '5px' }}>Reset Password</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {resetSent 
                  ? "We've sent a reset link to your email." 
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            {!resetSent ? (
              <form onSubmit={handleResetSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                  Send Reset Link
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setResetSent(false); }} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '12px' }}
              >
                Return to Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}