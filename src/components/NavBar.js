import React, { useState } from 'react';
import { FaCalendarAlt, FaUser, FaHome, FaCog, FaInfoCircle, FaExchangeAlt, FaSignOutAlt, FaBars, FaFileAlt, FaDollarSign } from 'react-icons/fa'; // 문서함 아이콘 추가
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
    const overlay = document.querySelector('.overlay');
    if (overlay) {
      overlay.classList.toggle('active', !isCollapsed);
    }
  };

  return (
    <>
      <div className={`overlay ${!isCollapsed ? 'active' : ''}`} onClick={toggleNavbar}></div>
      <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul className="nav-items">
          <li className="nav-item">
            <FaBars className="nav-icon" onClick={toggleNavbar} />
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <FaHome className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>홈</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className="nav-link">
              <FaCalendarAlt className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>일정</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/documentPage" className="nav-link">
            <FaFileAlt className="nav-icon" /> {/* 적당한 아이콘 추가 */}
            <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>문서함</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/mypay" className="nav-link">
            <FaDollarSign className="nav-icon" />
            <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>급여 & 근태</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link">
              <FaUser className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>인사관리</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link">
              <FaCog className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>개인설정</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/organization" className="nav-link">
            {/* organizational chart = 조직도 */}
              <FaInfoCircle className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>조직도</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exchangeRate" className="nav-link">
              <FaExchangeAlt className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>환율</span>
            </Link>
          </li>
          <li className="nav-item">
            <button className="logout-button" onClick={onLogout}>
              <FaSignOutAlt className="nav-icon" />
              <span className={`nav-name ${isCollapsed ? 'hidden' : ''}`}>로그아웃</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;