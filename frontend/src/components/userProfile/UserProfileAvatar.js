import React from "react";
import PropTypes from "prop-types";
import "../../styles/userProfile/UserProfileAvatar.css";

const UserProfileAvatar = ({ avatarUrl }) => {
  return (
    <div className="profile-avatar">
      <img src={avatarUrl} alt="User Avatar" />
    </div>
  );
};

UserProfileAvatar.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
};

export default UserProfileAvatar;
