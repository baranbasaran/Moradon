import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";
import UserProfileBanner from "../components/userProfile/UserProfileBanner";
import UserProfileAvatar from "../components/userProfile/UserProfileAvatar";
import UserProfileDetails from "../components/userProfile/UserProfileDetails";
import Posts from "../components/Posts";
import "../styles//userProfile/UserProfilePage.css";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile(603));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    profile && (
      <div className="user-profile-page">
        <UserProfileBanner />
        <div className="profile-main">
          <UserProfileAvatar avatarUrl={profile.avatarUrl} />
          <UserProfileDetails
            username={profile.username}
            bio={profile.bio}
            joinedDate={profile.joinedDate}
            following={profile.following}
            followers={profile.followers}
            posts={profile.posts}
          />
        </div>
        <Posts posts={profile.userPosts} />{" "}
      </div>
    )
  );
};

export default UserProfilePage;
