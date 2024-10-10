import React from "react";
import "../styles/Sidebar.css"; // Sidebar styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Moradon</h2>
      <nav>
        <ul>
          <li>
            <a href="/profile">
              <i className="fas fa-user"></i>
              <span className="link-text">Profile</span>
            </a>
          </li>
          <li>
            <a href="/books">
              <i className="fas fa-book"></i>
              <span className="link-text">Books</span>
            </a>
          </li>
          <li>
            <a href="/settings">
              <i className="fas fa-cog"></i>
              <span className="link-text">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
