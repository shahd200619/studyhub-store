import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/BookCard';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Container className="py-5">
        <div className="empty-state">
          <div className="empty-icon"><FiHeart /></div>
          <h3 className="fw-bold mb-2">Your wishlist is empty</h3>
          <p className="muted mb-4">Tap the heart on any book to save it here for later.</p>
          <Button as={Link} to="/books" className="btn-brand px-4 py-2">Explore library</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="section-title display-6 mb-1">My wishlist</h2>
          <p className="muted mb-0">{wishlist.length} saved {wishlist.length === 1 ? 'book' : 'books'}</p>
        </div>
        <Button className="btn-ghost danger px-3 d-inline-flex align-items-center gap-2" onClick={clearWishlist}>
          <FiTrash2 /> Clear all
        </Button>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {wishlist.map((book) => (
          <Col key={book.id}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;
