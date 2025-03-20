import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { createPost } from "../redux/slices/postsSlice";
import LoadingButton from "./common/LoadingButton";
import LoadingSpinner from "./common/LoadingSpinner";
import { generateAvatar, getDefaultAvatar } from "../utils/avatarUtils";
import ProgressIndicator from "./ProgressIndicator";
import { FaImage } from "react-icons/fa";

export const PostComposer: React.FC = () => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // Generate avatar URL based on username
  const avatarUrl = user?.username
    ? generateAvatar(user.username)
    : getDefaultAvatar();

  const handlePost = async () => {
    if (!content.trim() || !user) return;

    console.log("Starting post creation...");
    setIsSubmitting(true);
    setError(null);
    try {
      console.log("Dispatching createPost action...");
      const result = await dispatch(
        createPost({
          content: content.trim(),
        })
      ).unwrap();

      console.log("Post creation result:", result);

      if (result) {
        setContent("");
        setMediaFile(null);
      }
    } catch (error: any) {
      console.error("Failed to create post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <ProgressIndicator
        isLoading={isSubmitting}
        color={["#1d9bf0", "#1a8cd8"]}
        height="2px"
      />
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <textarea
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex justify-end">
          <LoadingButton
            onClick={handlePost}
            disabled={!content.trim() || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Posting..."
            className="bg-primary text-white"
          >
            Post
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
