import React from "react";
import { Post } from "../api/types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = React.memo(({ posts }) => {
  if (!posts?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No posts yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
});

PostList.displayName = "PostList";

export default PostList;
