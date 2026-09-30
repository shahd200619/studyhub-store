import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiAlertCircle, FiInbox } from 'react-icons/fi';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import { fetchBooksByCategory } from '../api/bookService';
import { CATEGORIES } from '../data/categories';

const SORTS = {
  default: { label: 'Default', fn: null },
  priceAsc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  priceDesc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
};

const Books = () => {
  // القسم بيتخزن في الـ URL (?category=ai) عشان اللينك يتشارك والرجوع يشتغل
  const [params, setParams] = useSearchParams();
  const activeCategory = CATEGORIES.find((c) => c.key === params.get('category')) ?? CATEGORIES[0];

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(params.get('q') ?? '');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false; // يمنع نتيجة قديمة من إنها تكتب فوق نتيجة أحدث
    setLoading(true);
    setError(false);

    fetchBooksByCategory(activeCategory.key)
      .then((data) => !ignore && setBooks(data))
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [activeCategory.key, reloadKey]);

  const visibleBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = books.filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
    const sorter = SORTS[sortBy].fn;
    return sorter ? [...filtered].sort(sorter) : filtered;
  }, [books, searchTerm, sortBy]);

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="section-title display-6 mb-1">Digital Library</h2>
        <p className="muted mb-0">Academic and technical books across top subjects</p>
      </div>

      <div className="panel p-3 p-md-4 mb-4">
        <Row className="g-3 align-items-center">
          <Col md={8}>
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                className="form-control"
                placeholder={`Search in ${activeCategory.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort books">
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <div className="chip-row mt-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`chip ${activeCategory.key === cat.key ? 'active' : ''}`}
              onClick={() => setParams({ category: cat.key })}
            >
              <cat.icon /> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <BookSkeleton count={8} />
      ) : error ? (
        <div className="empty-state">
          <div className="empty-icon"><FiAlertCircle /></div>
          <h4 className="fw-bold">Something went wrong</h4>
          <p className="muted mb-4">We couldn't load the books. Please try again.</p>
          <Button className="btn-brand px-4 py-2" onClick={() => setReloadKey((k) => k + 1)}>Try again</Button>
        </div>
      ) : visibleBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FiInbox /></div>
          <h4 className="fw-bold">No books found</h4>
          <p className="muted mb-0">Try a different keyword or category.</p>
        </div>
      ) : (
        <>
          <p className="muted small mb-3">
            {visibleBooks.length} books in <strong className="text-brand">{activeCategory.name}</strong>
          </p>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {visibleBooks.map((book) => (
              <Col key={book.id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Books;
