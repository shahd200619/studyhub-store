import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';
import BookCover from '../components/BookCover';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <div className="empty-state">
          <div className="empty-icon"><FiShoppingCart /></div>
          <h3 className="fw-bold mb-2">Your cart is empty</h3>
          <p className="muted mb-4">Looks like you haven't added any books yet.</p>
          <Button as={Link} to="/books" className="btn-brand px-4 py-2">Browse books</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="section-title display-6 mb-1">Shopping cart</h2>
          <p className="muted mb-0">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <Button className="btn-ghost danger px-3 d-inline-flex align-items-center gap-2" onClick={clearCart}>
          <FiTrash2 /> Clear
        </Button>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <div className="panel px-3 px-md-4">
            {cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <Link to={`/book/${item.id}`} state={{ book: item }} className="thumb">
                  <BookCover src={item.image} alt={item.title} />
                </Link>

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <Link to={`/book/${item.id}`} state={{ book: item }} className="text-decoration-none text-body">
                    <h6 className="fw-bold mb-1 line-clamp-2">{item.title}</h6>
                  </Link>
                  <span className="muted small d-block mb-2">{item.author}</span>
                  <div className="qty">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"><FiMinus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity"><FiPlus size={14} /></button>
                  </div>
                </div>

                <div className="text-end">
                  <div className="price fs-5 mb-2">${(item.price * item.quantity).toFixed(2)}</div>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 34, height: 34, fontSize: '0.95rem' }}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={4}>
          <div className="panel p-4 position-sticky" style={{ top: 100 }}>
            <h5 className="fw-bold mb-4">Order summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="muted">Subtotal</span>
              <span className="fw-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="muted">Shipping</span>
              <span className="fw-bold" style={{ color: '#16a34a' }}>Free</span>
            </div>
            <hr style={{ borderColor: 'var(--border)', opacity: 1 }} />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5">Total</span>
              <span className="price fs-3">${totalPrice.toFixed(2)}</span>
            </div>
            <Button as={Link} to="/checkout" className="btn-brand w-100 py-3 d-flex align-items-center justify-content-center gap-2">
              Checkout <FiArrowRight />
            </Button>
            <Button as={Link} to="/books" className="btn-soft w-100 py-2 mt-2">Continue shopping</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
