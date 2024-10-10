import React from "react";
import "../styles/Sidebar.css"; // Style this accordingly
import LogoutButton from "./LogoutButton"; // Import the LogoutButton

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>CheaperBook</h2>
      <nav>
        <ul>
          {/* Sidebar links */}
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/books">Books</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          {/* Logout button */}
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
