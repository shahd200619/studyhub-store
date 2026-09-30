import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiMail, FiClock } from 'react-icons/fi';
import { CATEGORIES } from '../data/categories';

const Footer = () => (
  <footer className="site-footer py-5 mt-5">
    <Container>
      <Row className="gy-4">
        <Col lg={4} md={6}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="brand-mark" style={{ width: 38, height: 38, fontSize: '1.1rem' }}><FiBookOpen /></div>
            <span className="brand-text">StudyHub</span>
          </div>
          <p className="muted small mb-0" style={{ maxWidth: 320 }}>
            A digital library and bookstore for academic and tech literature. Built for modern learners and developers.
          </p>
        </Col>

        <Col lg={2} md={6} xs={6}>
          <h6 className="fw-bold mb-3">Quick Links</h6>
          <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/books" className="footer-link">All Books</Link></li>
            <li><Link to="/cart" className="footer-link">My Cart</Link></li>
            <li><Link to="/wishlist" className="footer-link">Wishlist</Link></li>
          </ul>
        </Col>

        <Col lg={3} md={6} xs={6}>
          <h6 className="fw-bold mb-3">Categories</h6>
          <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <li key={cat.key}>
                <Link to={`/books?category=${cat.key}`} className="footer-link">{cat.name}</Link>
              </li>
            ))}
          </ul>
        </Col>

        <Col lg={3} md={6}>
          <h6 className="fw-bold mb-3">Contact</h6>
          <p className="muted small mb-2 d-flex align-items-center gap-2"><FiMail /> support@studyhub.com</p>
          <p className="muted small mb-0 d-flex align-items-center gap-2"><FiClock /> 24/7 Academic Support</p>
        </Col>
      </Row>

      <hr className="my-4" />
      <div className="text-center muted small">
        &copy; {new Date().getFullYear()} StudyHub Store. All rights reserved.
      </div>
    </Container>
  </footer>
);

export default Footer;
