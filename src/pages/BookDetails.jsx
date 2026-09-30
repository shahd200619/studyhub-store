import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiCheck, FiExternalLink, FiInbox, FiTruck, FiShield } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import BookCover from '../components/BookCover';
import BookCard from '../components/BookCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { fetchBookById, fetchBooksByCategory } from '../api/bookService';

const BookDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  // لو جاي من كارت الكتاب بنستخدم الداتا الجاهزة، ولو عملت Refresh بنجيبه من الـ API
  const [book, setBook] = useState(state?.book?.id === id ? state.book : null);
  const [loading, setLoading] = useState(!book);
  const [related, setRelated] = useState([]);
  const [added, setAdded] = useState(false);

  // بيشتغل كل ما الـ id يتغير (مهم لما تدوس على كتاب مشابه وانت في صفحة تفاصيل)
  useEffect(() => {
    if (state?.book?.id === id) {
      setBook(state.book);
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    fetchBookById(id)
      .then((b) => !ignore && setBook(b))
      .catch(() => !ignore && setBook(null))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id, state]);

  // كتب مشابهة: من نفس القسم، بنبدأ من بعد الكتاب الحالي عشان كل كتاب يطلع له اقتراحات مختلفة
  useEffect(() => {
    if (!book) return;
    let ignore = false;
    fetchBooksByCategory(book.categoryKey)
      .then((list) => {
        if (ignore) return;
        const index = list.findIndex((b) => b.id === book.id);
        const rotated = [...list.slice(index + 1), ...list.slice(0, Math.max(index, 0))];
        setRelated(rotated.filter((b) => b.id !== book.id && b.coverId).slice(0, 4));
      })
      .catch(() => !ignore && setRelated([]));
    return () => {
      ignore = true;
    };
  }, [book]);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5">
        <div className="empty-state">
          <div className="empty-icon"><FiInbox /></div>
          <h3 className="fw-bold mb-2">Book not found</h3>
          <p className="muted mb-4">We couldn't find the book you're looking for.</p>
          <Button as={Link} to="/books" className="btn-brand px-4 py-2">Back to Library</Button>
        </div>
      </Container>
    );
  }

  const isFavorite = isInWishlist(book.id);

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    showToast('Added to cart', { detail: book.title, actionLabel: 'View cart', actionTo: '/cart' });
  };

  return (
    <Container className="py-5">
      <Button className="btn-ghost mb-4 px-3 d-inline-flex align-items-center gap-2" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </Button>

      <div className="panel p-3 p-md-4 p-lg-5">
        <Row className="g-4 g-lg-5 align-items-center">
          <Col md={5}>
            <div className="detail-cover">
              <BookCover src={book.largeImage || book.image} alt={book.title} />
            </div>
          </Col>

          <Col md={7}>
            <Link to={`/books?category=${book.categoryKey}`} className="hero-pill text-decoration-none mb-3">
              {book.category}
            </Link>

            <h1 className="fw-extrabold mb-2" style={{ letterSpacing: '-0.03em', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
              {book.title}
            </h1>
            <p className="muted fs-5 mb-3">by {book.author}{book.year && ` · ${book.year}`}</p>

            <div className="rating mb-4"><FaStar /> {book.rating.toFixed(1)} <span className="muted fw-medium">rating</span></div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="price display-6">${book.price.toFixed(2)}</span>
              <span className="old-price fs-5">${(book.price * 1.25).toFixed(2)}</span>
              <span className="hero-pill" style={{ background: 'rgba(22,163,74,.12)', color: '#16a34a' }}>Save 20%</span>
            </div>

            <p className="muted lh-lg mb-4">
              A practical, modern guide to {book.category}, explained clearly for students and developers who want to learn by doing.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button
                className={`btn-brand px-4 py-3 d-inline-flex align-items-center gap-2 ${added ? 'is-done' : ''}`}
                onClick={handleAdd}
              >
                {added ? <><FiCheck /> Added to cart</> : <><FiShoppingCart /> Add to cart</>}
              </Button>
              <Button
                className="btn-ghost px-4 py-3 d-inline-flex align-items-center gap-2"
                onClick={() => toggleWishlist(book)}
                style={isFavorite ? { color: '#ef4444', borderColor: '#ef4444' } : undefined}
              >
                {isFavorite ? <FaHeart /> : <FiHeart />} {isFavorite ? 'In wishlist' : 'Add to wishlist'}
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-4 muted small">
              <span className="d-inline-flex align-items-center gap-2"><FiTruck /> Free delivery</span>
              <span className="d-inline-flex align-items-center gap-2"><FiShield /> Secure checkout</span>
              {book.key && (
                <a href={`https://openlibrary.org${book.key}`} target="_blank" rel="noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-2">
                  <FiExternalLink /> View on Open Library
                </a>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {related.length > 0 && (
        <section className="mt-5 pt-3">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="section-title m-0">You might also like</h3>
              <p className="muted small m-0">More in {book.category}</p>
            </div>
            <Link to={`/books?category=${book.categoryKey}`} className="text-decoration-none fw-bold text-brand">
              See all
            </Link>
          </div>
          <Row xs={1} sm={2} lg={4} className="g-4">
            {related.map((b) => (
              <Col key={b.id}>
                <BookCard book={b} />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default BookDetails;
