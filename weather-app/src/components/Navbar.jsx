import { NavLink } from 'react-router-dom';
import { CloudRain } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <CloudRain className="brand-icon" />
        <h2>Weather</h2>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/compare" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Compare
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;