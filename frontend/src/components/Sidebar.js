import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import "../styles/Sidebar.css"; // Sidebar styles

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <h2>Moradon</h2>
      <nav>
        <ul>
          <li>
            <button onClick={() => handleNavigation("/profile")} className="nav-button">
              <i className="fas fa-user"></i>
              <span className="link-text">Profile</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/books")} className="nav-button">
              <i className="fas fa-book"></i>
              <span className="link-text">Books</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/settings")} className="nav-button">
              <i className="fas fa-cog"></i>
              <span className="link-text">Settings</span>
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-button">
              <i className="fas fa-sign-out-alt"></i>
              <span className="link-text">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
