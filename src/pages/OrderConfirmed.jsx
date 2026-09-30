import { Container, Button } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { FiCheck, FiMail, FiTruck } from 'react-icons/fi';
import BookCover from '../components/BookCover';
import { loadFromStorage } from '../utils/storage';

const OrderConfirmed = () => {
  const { state } = useLocation();
  // لو عمل Refresh نرجّع آخر طلب من التخزين
  const order = state?.order ?? loadFromStorage('studyhub-last-order', null);

  if (!order) return <Navigate to="/" replace />;

  const date = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container className="py-5" style={{ maxWidth: 720 }}>
      <div className="text-center mb-4">
        <div className="success-icon"><FiCheck /></div>
        <h2 className="section-title display-6 mb-2">Order confirmed!</h2>
        <p className="muted mb-0">
          Thank you, <strong className="text-body">{order.customer.fullName.split(' ')[0]}</strong>. Your order is on its way.
        </p>
      </div>

      <div className="panel p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
          <div>
            <div className="muted small">Order number</div>
            <div className="fw-bold fs-5 order-id">{order.id}</div>
          </div>
          <div>
            <div className="muted small">Date</div>
            <div className="fw-bold">{date}</div>
          </div>
          <div>
            <div className="muted small">Total</div>
            <div className="price fs-5">${order.total.toFixed(2)}</div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', opacity: 1 }} />

        {order.items.map((item) => (
          <div className="summary-item" key={item.id}>
            <div className="thumb" style={{ width: 44, height: 62 }}>
              <BookCover src={item.image} alt={item.title} />
            </div>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="fw-semibold small line-clamp-2">{item.title}</div>
              <div className="muted small">Qty {item.quantity}</div>
            </div>
            <span className="fw-bold small">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="panel p-4 mb-4 d-flex flex-column gap-3 small">
        <div className="d-flex gap-3 align-items-start">
          <FiTruck size={20} className="text-brand flex-shrink-0 mt-1" />
          <div>
            <div className="fw-bold">Delivery address</div>
            <div className="muted">{order.customer.address}, {order.customer.city}</div>
            <div className="muted">Estimated delivery: 3-5 business days</div>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-start">
          <FiMail size={20} className="text-brand flex-shrink-0 mt-1" />
          <div>
            <div className="fw-bold">Confirmation sent to</div>
            <div className="muted">{order.customer.email}</div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <Button as={Link} to="/books" className="btn-brand px-4 py-2">Continue shopping</Button>
        <Button as={Link} to="/" className="btn-ghost px-4 py-2">Back to home</Button>
      </div>
    </Container>
  );
};

export default OrderConfirmed;
