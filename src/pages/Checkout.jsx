import { useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiTruck, FiCreditCard } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import BookCover from '../components/BookCover';
import { useCart } from '../context/CartContext';
import { saveToStorage } from '../utils/storage';

const INITIAL_VALUES = {
  fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', payment: 'cod',
};

const FIELDS = [
  { name: 'fullName', label: 'Full name', placeholder: 'Ahmed Mohamed', md: 12, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', md: 6, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+20 100 123 4567', md: 6, autoComplete: 'tel' },
  { name: 'address', label: 'Address', placeholder: 'Street, building, apartment', md: 12, autoComplete: 'street-address' },
  { name: 'city', label: 'City', placeholder: 'Cairo', md: 6, autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', placeholder: '11511', md: 6, optional: true, autoComplete: 'postal-code' },
];

const validate = (v) => {
  const errors = {};
  if (v.fullName.trim().length < 3) errors.fullName = 'Please enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = 'Enter a valid email address';
  if (!/^\+?[0-9\s-]{10,15}$/.test(v.phone.trim())) errors.phone = 'Enter a valid phone number';
  if (v.address.trim().length < 8) errors.address = 'Please enter your full address';
  if (v.city.trim().length < 2) errors.city = 'Please enter your city';
  return errors;
};

const Checkout = () => {
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const orderPlaced = useRef(false); // عشان ما نرجعش لصفحة السلة بعد ما نفضّي السلة

  const errors = useMemo(() => validate(values), [values]);

  if (cart.length === 0 && !orderPlaced.current) return <Navigate to="/cart" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(INITIAL_VALUES).map((k) => [k, true])));

    if (Object.keys(errors).length > 0) {
      // نوصّل المستخدم لأول خانة فيها خطأ
      setTimeout(() => document.querySelector('.form-control.is-invalid')?.focus(), 0);
      return;
    }

    const order = {
      id: `SH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
      customer: { ...values },
    };

    saveToStorage('studyhub-last-order', order);
    orderPlaced.current = true;
    navigate('/order-confirmed', { state: { order }, replace: true });
    clearCart();
  };

  return (
    <Container className="py-5">
      <Button as={Link} to="/cart" className="btn-ghost mb-4 px-3 d-inline-flex align-items-center gap-2">
        <FiArrowLeft /> Back to cart
      </Button>

      <h2 className="section-title display-6 mb-4">Checkout</h2>

      <Form noValidate onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={7}>
            <div className="panel p-4 mb-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FiTruck /> Delivery details</h5>
              <Row className="g-3">
                {FIELDS.map(({ name, label, md, optional, ...rest }) => (
                  <Col md={md} key={name}>
                    <Form.Group controlId={`field-${name}`}>
                      <Form.Label className="fw-semibold small">
                        {label} {optional && <span className="muted fw-normal">(optional)</span>}
                      </Form.Label>
                      <Form.Control
                        {...rest}
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched[name] && !!errors[name]}
                      />
                      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="panel p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FiCreditCard /> Payment method</h5>
              <Row className="g-3">
                {[
                  { value: 'cod', title: 'Cash on delivery', desc: 'Pay when your order arrives', icon: <FaMoneyBillWave /> },
                  { value: 'online', title: 'Pay online', desc: 'No real payment is processed', icon: <FiCreditCard /> },
                ].map((opt) => (
                  <Col sm={6} key={opt.value}>
                    <label className={`pay-option ${values.payment === opt.value ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={values.payment === opt.value}
                        onChange={handleChange}
                      />
                      <span className="pay-icon">{opt.icon}</span>
                      <span>
                        <span className="fw-bold d-block">{opt.title}</span>
                        <span className="muted small">{opt.desc}</span>
                      </span>
                    </label>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col lg={5}>
            <div className="panel p-4 position-sticky" style={{ top: 100 }}>
              <h5 className="fw-bold mb-3">Order summary</h5>

              <div className="mb-3">
                {cart.map((item) => (
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

              <hr style={{ borderColor: 'var(--border)', opacity: 1 }} />
              <div className="d-flex justify-content-between mb-2">
                <span className="muted">Items ({itemCount})</span>
                <span className="fw-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="muted">Shipping</span>
                <span className="fw-bold" style={{ color: '#16a34a' }}>Free</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="price fs-3">${totalPrice.toFixed(2)}</span>
              </div>

              <Button type="submit" className="btn-brand w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                <FiLock /> Place order
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;
