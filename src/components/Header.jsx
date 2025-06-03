import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/index.css";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <ul className="nav-links">
          <li>
            <Link to="/events">Події</Link>
          </li>
          {user && (
            <li>
              <Link to="/bookings">Мої бронювання</Link>
            </li>
          )}
          <li>
            <Link to="/about">Про нас</Link>
          </li>
        </ul>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-login">Вхід</Link>
              <Link to="/register" className="btn btn-register">Реєстрація</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-logout">Вийти</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
