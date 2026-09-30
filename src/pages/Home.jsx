import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiZap, FiAlertCircle } from 'react-icons/fi';
import BookCard from '../components/BookCard';
import BookCover from '../components/BookCover';
import BookSkeleton from '../components/BookSkeleton';
import { fetchBooksByCategory } from '../api/bookService';
import { CATEGORIES } from '../data/categories';

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchBooksByCategory('programming')
      .then((list) => {
        // بنعرض الكتب اللي ليها غلاف بس عشان الشكل يبقى أحلى
        if (!ignore) setFeatured(list.filter((b) => b.coverId).slice(0, 8));
      })
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/books?q=${encodeURIComponent(q)}` : '/books');
  };

  const stackBooks = featured.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="hero py-5">
        <Container className="py-lg-4">
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <span className="hero-pill mb-4"><FiZap /> Your academic & tech library</span>
              <h1 className="hero-title display-4 mb-3">
                Find the right book for every <span className="text-gradient">step of your journey</span>
              </h1>
              <p className="muted fs-5 mb-4" style={{ maxWidth: 560 }}>
                Browse programming, AI, data and math books from Open Library. Save your favorites and build your reading list.
              </p>

              <form onSubmit={handleSearch} className="search-box" style={{ maxWidth: 560 }}>
                <FiSearch />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or author..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" className="btn-brand px-4 py-2">Search</Button>
              </form>
            </Col>

            <Col lg={5}>
              <div className="cover-stack">
                {[0, 1, 2].map((i) => (
                  <div className="stack-item" key={i}>
                    <BookCover src={stackBooks[i]?.largeImage} alt={stackBooks[i]?.title} />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      <Container className="mt-5 pt-3">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="section-title m-0">Explore categories</h3>
            <p className="muted small m-0">Find books by topic</p>
          </div>
          <Link to="/books" className="text-decoration-none fw-bold text-brand d-inline-flex align-items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>

        <Row className="g-3 g-lg-4">
          {CATEGORIES.map((cat) => (
            <Col key={cat.key} xs={6} md={4} lg={2}>
              <Link to={`/books?category=${cat.key}`} className="cat-tile">
                <div className="cat-icon"><cat.icon /></div>
                <div>
                  <h6 className="fw-bold mb-1">{cat.name}</h6>
                  <span className="go">Browse <FiArrowRight size={13} /></span>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured */}
      <Container className="mt-5 pt-3">
        <div className="mb-4">
          <h3 className="section-title m-0">Trending books</h3>
          <p className="muted small m-0">Popular picks for students and developers</p>
        </div>

        {loading ? (
          <BookSkeleton count={4} />
        ) : error ? (
          <div className="panel p-4 text-center">
            <FiAlertCircle size={28} className="text-brand mb-2" />
            <p className="muted mb-0">Couldn't load books right now. Check your connection and refresh.</p>
          </div>
        ) : (
          <Row xs={1} sm={2} lg={4} className="g-4">
            {featured.map((book) => (
              <Col key={book.id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
