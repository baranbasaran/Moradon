import React from "react";
import "../styles/HomePage.css";
import Sidebar from "../components/Sidebar";
import PostComposer from "../components/PostComposer";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="main-content">
          <h2>Welcome to Moradon</h2>
          <PostComposer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
