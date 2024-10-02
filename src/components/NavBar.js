import React, { useState } from 'react';
import { FaCalendarAlt, FaUser, FaHome, FaCog, FaInfoCircle, FaExchangeAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <FaBars className="hamburger-icon" onClick={toggleNavbar} />
      <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <FaHome className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className="nav-link">
              <FaCalendarAlt className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link">
              <FaUser className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link">
              <FaCog className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/info" className="nav-link">
              <FaInfoCircle className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exchangeRate" className="nav-link">
              <FaExchangeAlt className="nav-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FaSignOutAlt className="nav-icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;