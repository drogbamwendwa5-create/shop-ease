import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Loading from '../components/UI/Loading';
import { FiCreditCard, FiSmartphone, FiTruck, FiDollarSign } from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const { total, cartItems, clearCart, coupon, discountAmount, tax, shipping, subtotal } = useCart();

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [shippingData, setShippingData] = useState({ name: '', address: '', city: '', country: '', zip: '', phone: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const order = {
          id: 'TXN-' + Math.floor(Math.random() * 1000000),
          date: new Date().toLocaleDateString(),
          items: cartItems,
          shipping: shippingData,
          delivery: deliveryMethod,
          payment: paymentMethod,
          subtotal, discountAmount, tax, shippingCost: shipping, total
        };
        clearCart();
        setProcessing(false);
        toast.success('Payment Successful!');
        navigate('/receipt', { state: order });
      } else {
        setProcessing(false);
        toast.error('Payment failed! Please try a different method.');
      }
    }, 2000);
  };

  if (processing) return <Loading text="Processing payment securely. Please do not close this tab..." />;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <h1>Checkout</h1>
      
      <div className="step-indicator" style={{ marginTop: '20px' }}>
        <div className="step-line"></div>
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Delivery & Payment</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>

      <div className="card" style={{ padding: '30px' }}>
        
        {step === 1 && (
          <form onSubmit={handleShippingSubmit}>
            <h3 style={{ marginBottom: '20px' }}>Shipping Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" required placeholder="John Doe" onChange={e => setShippingData({ ...shippingData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Street Address</label>
              <input className="form-control" required placeholder="123 Main St" onChange={e => setShippingData({ ...shippingData, address: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" required placeholder="New York" onChange={e => setShippingData({ ...shippingData, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select className="form-control" required onChange={e => setShippingData({ ...shippingData, country: e.target.value })}>
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="KE">Kenya</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Postal Code</label>
                <input className="form-control" required placeholder="10001" onChange={e => setShippingData({ ...shippingData, zip: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-control" type="tel" required placeholder="+1 234 567 890" onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Continue to Payment</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePayment}>
            <h3 style={{ marginBottom: '15px' }}>Delivery Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '30px' }}>
              {[
                { id: 'standard', label: 'Standard', desc: '5-7 Days', icon: <FiTruck /> },
                { id: 'express', label: 'Express', desc: '1-2 Days', icon: <FiTruck /> },
                { id: 'pickup', label: 'Pickup', desc: 'Store Pickup', icon: <FiDollarSign /> }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setDeliveryMethod(method.id)}
                  className="card" 
                  style={{ 
                    padding: '15px', textAlign: 'center', cursor: 'pointer', 
                    border: deliveryMethod === method.id ? '2px solid var(--primary-color)' : '2px solid transparent' 
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{method.icon}</div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>{method.label}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{method.desc}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

            <h3 style={{ marginBottom: '15px' }}>Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[
                { id: 'credit-card', label: 'Credit Card', icon: <FiCreditCard /> },
                { id: 'paypal', label: 'PayPal', icon: <FiSmartphone /> },
                { id: 'mpesa', label: 'M-Pesa', icon: <FiSmartphone /> },
                { id: 'bank', label: 'Bank Transfer', icon: <FiDollarSign /> }
              ].map((method) => ( 
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className="card" 
                  style={{ 
                    padding: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    border: paymentMethod === method.id ? '2px solid var(--primary-color)' : '2px solid transparent' 
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{method.icon}</span>
                  <strong style={{ fontSize: '14px' }}>{method.label}</strong>
                </div>
              ))}
            </div>

            {paymentMethod === 'credit-card' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input className="form-control" placeholder="4242 4242 4242 4242" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group"><label>Expiry Date</label><input className="form-control" placeholder="MM/YY" required /></div>
                  <div className="form-group"><label>CVV</label><input className="form-control" placeholder="123" required /></div>
                </div>
              </div>
            )}

            {paymentMethod === 'mpesa' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>M-Pesa Phone Number</label>
                  <input className="form-control" type="tel" placeholder="+254 7XX XXX XXX" required />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>An STK push will be sent to your phone.</p>
              </div>
            )}

            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              <div className="flex-center" style={{ marginBottom: '5px' }}><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && <div className="flex-center" style={{ marginBottom: '5px', color: 'var(--success)' }}><span>Discount:</span><span>-${discountAmount.toFixed(2)}</span></div>}
              <div className="flex-center" style={{ marginBottom: '5px' }}><span>Shipping & Tax:</span><span>${(shipping + tax).toFixed(2)}</span></div>
              <div className="flex-center" style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span>Total:</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline">Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Pay ${total.toFixed(2)}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}