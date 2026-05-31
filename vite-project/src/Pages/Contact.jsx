import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error('Please fill in all required fields.');
    }

    setSending(true);

    // Simulate API call delay
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h1>Get In Touch</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', maxWidth: '500px', margin: '10px auto 0' }}>
            Have a question, feedback, or need help with an order? We'd love to hear from you.
          </p>
        </div>

        {/* Grid Layout: Info + Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }} className="contact-grid">
          
          {/* Contact Information Sidebar */}
          <div>
            <div className="card" style={{ padding: '25px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)', padding: '12px', borderRadius: '50%', fontSize: '20px', height: 'fit-content' }}>
                  <FiMapPin />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Our Office</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    123 Commerce Street,<br />Tech City, TC 10001
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)', padding: '12px', borderRadius: '50%', fontSize: '20px', height: 'fit-content' }}>
                  <FiMail />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Email Us</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    support@shopvibe.com<br />sales@shopvibe.com
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)', padding: '12px', borderRadius: '50%', fontSize: '20px', height: 'fit-content' }}>
                  <FiPhone />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Call Us</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    +1 (555) 123-4567<br />+1 (555) 987-6543
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)', padding: '12px', borderRadius: '50%', fontSize: '20px', height: 'fit-content' }}>
                  <FiClock />
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Working Hours</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Mon - Fri: 8AM - 8PM<br />Sat - Sun: 10AM - 4PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-control" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Your Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  className="form-control" 
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  name="message"
                  className="form-control" 
                  rows="6" 
                  placeholder="Write your message here..."
                  style={{ resize: 'vertical' }}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                disabled={sending}
              >
                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Responsive Media Query */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}