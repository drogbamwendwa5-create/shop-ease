import { useLocation, Link } from 'react-router-dom';

export default function Receipt() {
  const location = useLocation();
  const order = location.state;

  // Fallback if user navigates here directly without checkout data
  if (!order) {
    return (
      <div className="container text-center" style={{ padding: '80px' }}>
        <h2>No Order Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>It looks like you haven't made a purchase yet.</p>
        <Link to="/products" className="btn btn-primary mt-20">Start Shopping</Link>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="container receipt-container">
      {/* Hidden from print screen */}
      <div className="text-center mt-20 mb-20 no-print">
        <h1>Order Confirmed! 🎉</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Thank you for your purchase. Your receipt is below.</p>
      </div>

      {/* Printable Receipt Area */}
      <div className="card" style={{ padding: '40px' }}>
        <div className="receipt-header">
          <h1 style={{ margin: 0, color: 'var(--primary-color)' }}>ShopVibe</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>www.shopvibe.com</p>
          <h2 style={{ marginTop: '20px' }}>INVOICE</h2>
        </div>
        
        <div className="receipt-info">
          <div>
            <strong>Bill To:</strong><br/>
            {order.shipping.name}<br/>
            {order.shipping.address}<br/>
            {order.shipping.city}, {order.shipping.zip}<br/>
            {order.shipping.country}
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Order ID:</strong> {order.id}<br/>
            <strong>Date:</strong> {order.date}<br/>
            <strong>Payment:</strong> {order.payment === 'credit-card' ? 'Credit Card' : order.payment.toUpperCase()}<br/>
            <strong>Delivery:</strong> {order.delivery}
          </div>
        </div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td style={{ textAlign: 'center' }}>{item.qty}</td>
                <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-totals">
          <div className="receipt-totals-row flex-center"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          {order.discountAmount > 0 && (
            <div className="receipt-totals-row flex-center" style={{ color: 'var(--success)' }}>
              <span>Discount</span><span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="receipt-totals-row flex-center"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span></div>
          <div className="receipt-totals-row flex-center"><span>Tax (10%)</span><span>${order.tax.toFixed(2)}</span></div>
          <div className="receipt-totals-row flex-center receipt-totals-final">
            <span>Total Paid</span><span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden on print) */}
      <div className="text-center mt-20 no-print" style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '12px 30px' }}>
          🖨️ Print / Save as PDF
        </button>
        <Link to="/products" className="btn btn-outline" style={{ padding: '12px 30px' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}