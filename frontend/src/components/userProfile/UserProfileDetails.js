import React from "react";
import PropTypes from "prop-types";
import "../../styles/userProfile/UserProfileDetails.css";

const UserProfileDetails = ({
  username,
  bio,
  joinedDate,
  following,
  followers,
  posts,
}) => {
  return (
    <div className="profile-details">
      <h2>{username}</h2>
      <p>{bio}</p>
      <p className="profile-joined">Joined {joinedDate}</p>
      <div className="profile-stats">
        <span>{following} Following</span>
        <span>{followers} Followers</span>
        <span>{posts} Posts</span>
      </div>
    </div>
  );
};

UserProfileDetails.propTypes = {
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  joinedDate: PropTypes.string.isRequired,
  following: PropTypes.number.isRequired,
  followers: PropTypes.number.isRequired,
  posts: PropTypes.number.isRequired,
};

export default UserProfileDetails;
