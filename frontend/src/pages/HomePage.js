import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/HomePage.css";
import Sidebar from "../components/Sidebar";
import PostComposer from "../components/PostComposer";
import Posts from "../components/Posts";
import { fetchPosts } from "../redux/postSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const postStatus = useSelector((state) => state.posts.status);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  return (
    <div className="homepage-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <h2>Welcome to Moradon</h2>
        <PostComposer />
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export default HomePage;
