import { useState, useRef } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { FiCamera } from 'react-icons/fi';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Initialize state with current user data
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // For the profile picture preview
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  // Handle Image Upload (Simulated - stays in browser memory/localStorage)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL to show the image instantly
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (password && password !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (password && password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    // Simulate saving by updating LocalStorage directly
    const updatedUser = {
      ...user,
      name: name,
      email: email,
      avatar: avatarPreview 
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success("Profile updated successfully!");
    
    // Note: Because AuthContext reads from localStorage on load, 
    // the navbar will update the name/picture the next time you refresh the page.
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1>Edit Profile</h1>
      
      <div className="card" style={{ padding: '30px', marginTop: '20px' }}>
        
        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div 
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 10px',
              background: 'var(--bg-secondary)', border: '3px solid var(--border-color)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              overflow: 'hidden', position: 'relative', cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
            ) : (
              <span style={{fontSize:'40px', color:'var(--text-secondary)'}}>{name.charAt(0).toUpperCase()}</span>
            )}
            
            {/* Camera Icon Overlay */}
            <div style={{
              position: 'absolute', bottom: '0', right: '0', background: 'var(--primary-color)',
              color: 'white', borderRadius: '50%', width: '30px', height: '30px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--bg-primary)'
            }}>
              <FiCamera size={14} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click to change photo</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              className="form-control" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              className="form-control" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '20px 0' }}/>
          <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Change Password</h3>

          <div className="form-group">
            <label>New Password</label>
            <input 
              className="form-control" 
              type="password" 
              placeholder="Leave blank to keep current"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              className="form-control" 
              type="password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
