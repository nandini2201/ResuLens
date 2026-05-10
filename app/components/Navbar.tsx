import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="brand-mark">
        ResuLens
      </Link>
      <div className="nav-actions">
        <Link to="/" className="nav-link">
          Reports
        </Link>
        <Link to="/upload" className="primary-button nav-upload">
          Upload
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
