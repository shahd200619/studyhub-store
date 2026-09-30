import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FiBookOpen, FiHome, FiGrid, FiHeart, FiShoppingCart, FiSun, FiMoon } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const NavbarComponent = () => {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const [expanded, setExpanded] = useState(false); // عشان المنيو يقفل بعد ما تختار صفحة في الموبايل

  const closeMenu = () => setExpanded(false);

  return (
    <Navbar expand="lg" sticky="top" className="app-navbar" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeMenu} className="d-flex align-items-center gap-2 m-0">
          <div className="brand-mark"><FiBookOpen /></div>
          <div>
            <span className="brand-text d-block">StudyHub</span>
            <span className="brand-sub">Store</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto gap-1 my-3 my-lg-0">
            <Nav.Link as={NavLink} to="/" end onClick={closeMenu}>
              <FiHome /> Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/books" onClick={closeMenu}>
              <FiGrid /> Library
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <Link to="/wishlist" className="icon-btn" onClick={closeMenu} aria-label="Wishlist">
              <FiHeart />
              {wishlist.length > 0 && <span className="count-badge heart">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="icon-btn" onClick={closeMenu} aria-label="Cart">
              <FiShoppingCart />
              {itemCount > 0 && <span className="count-badge">{itemCount}</span>}
            </Link>

            <button
              type="button"
              className="icon-btn"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
