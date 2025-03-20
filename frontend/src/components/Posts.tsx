import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PostDetail from "./PostDetail";

const Posts: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostDetail
          key={post.id}
          post={post}
          onReply={() => {}}
          onLike={() => {}}
          onRepost={() => {}}
        />
      ))}
    </div>
  );
};

export default Posts;
