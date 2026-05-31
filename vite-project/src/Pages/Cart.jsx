import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, applyCoupon, coupon, subtotal, discountAmount, tax, shipping, total } = useCart();
  const [code, setCode] = useState('');

  if (cartItems.length === 0) {
    return <div className="container text-center" style={{padding:'80px 20px'}}>
      <h2>Your cart is empty</h2>
      <Link to="/products" className="btn btn-primary mt-20">Go Shopping</Link>
    </div>;
  }

  return (
    <div className="container" style={{padding:'20px 0'}}>
      <h1>Shopping Cart</h1>
      
      {/* Uses the .cart-grid class from CSS */}
      <div className="cart-grid">
        <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          {cartItems.map(item => (
            <div key={item.id} className="card" style={{display:'flex', padding:'15px', alignItems:'center', gap:'20px'}}>
              <Link to={`/products/${item.id}`}><img src={item.thumbnail} alt={item.title} style={{width:'80px', height:'80px', objectFit:'contain', borderRadius:'8px'}} /></Link>
              <div style={{flex:1}}>
                <h3 style={{fontSize:'16px'}}>{item.title}</h3>
                <p style={{fontWeight:'bold', marginTop:'5px'}}>${item.price}</p>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="btn btn-outline btn-sm"><FiMinus/></button>
                <span style={{fontWeight:'bold'}}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="btn btn-outline btn-sm"><FiPlus/></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{color:'var(--danger)', background:'none', fontSize:'20px'}}><FiTrash2/></button>
            </div>
          ))}
        </div>

        <div className="card" style={{padding:'20px', height:'fit-content'}}>
          <h3 style={{marginBottom:'15px'}}>Order Summary</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'10px', fontSize:'14px', borderBottom:'1px solid var(--border-color)', paddingBottom:'15px'}}>
            <div className="flex-center"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {coupon && <div className="flex-center" style={{color:'var(--success)'}}><span>Discount ({coupon.code})</span><span>-${discountAmount.toFixed(2)}</span></div>}
            <div className="flex-center"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex-center"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="flex-center" style={{fontSize:'20px', fontWeight:'bold', margin:'15px 0'}}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
            <input type="text" placeholder="Coupon code" value={code} onChange={e => setCode(e.target.value)} className="form-control" style={{fontSize:'14px'}}/>
            <button onClick={() => applyCoupon(code)} className="btn btn-primary btn-sm">Apply</button>
          </div>
          <p style={{fontSize:'12px', color:'var(--text-secondary)', marginBottom:'15px'}}>Try: SAVE10 or WELCOME20</p>
          <Link to="/checkout" className="btn btn-primary" style={{width:'100%', display:'block'}}>Checkout</Link>
        </div>
      </div>
    </div>
  );
}