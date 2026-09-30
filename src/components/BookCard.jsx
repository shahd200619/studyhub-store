import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiHeart, FiPlus, FiCheck, FiArrowRight } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import BookCover from './BookCover';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const isFavorite = isInWishlist(book.id);

  // بيرجّع الزرار لشكله الطبيعي بعد ثانية ونص من الإضافة
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    showToast('Added to cart', { detail: book.title, actionLabel: 'View cart', actionTo: '/cart' });
  };

  return (
    <Card className="book-card h-100">
      <span className="cat-badge">{book.category}</span>
      <button
        type="button"
        className={`fav-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => toggleWishlist(book)}
        aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isFavorite ? <FaHeart size={16} /> : <FiHeart size={18} />}
      </button>

      <Link to={`/book/${book.id}`} state={{ book }} className="cover-wrap">
        <BookCover src={book.image} alt={book.title} />
      </Link>

      <Card.Body className="d-flex flex-column p-3 p-lg-4">
        <Link to={`/book/${book.id}`} state={{ book }} className="text-decoration-none">
          <h6 className="fw-bold line-clamp-2 mb-1 text-body" title={book.title} style={{ minHeight: '2.6em' }}>
            {book.title}
          </h6>
        </Link>
        <p className="muted small mb-2 text-truncate">{book.author}</p>

        <div className="rating mb-3">
          <FaStar size={13} /> {book.rating.toFixed(1)}
          {book.year && <span className="muted fw-medium ms-2">· {book.year}</span>}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="price fs-4">${book.price.toFixed(2)}</span>
          <Button
            className={`btn-brand px-3 py-2 d-flex align-items-center gap-1 ${added ? 'is-done' : ''}`}
            onClick={handleAdd}
          >
            {added ? <><FiCheck size={16} /> Added</> : <><FiPlus size={16} /> Add</>}
          </Button>
        </div>

        <Link
          to={`/book/${book.id}`}
          state={{ book }}
          className="text-decoration-none small fw-bold mt-3 d-inline-flex align-items-center gap-1 text-brand"
        >
          View details <FiArrowRight size={14} />
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
