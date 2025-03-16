// src/components/PrivateRoute.js
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../redux/authSlice"; // Ensure this path is correct
import { jwtDecode } from "jwt-decode"; // Change to named import

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/" />;
  }

  // Check if the token is valid
  try {
    const decodedToken = jwtDecode(token);
    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      dispatch(logout());
      return <Navigate to="/" />;
    }
  } catch (error) {
    // If token is invalid or can't be decoded
    dispatch(logout());
    return <Navigate to="/" />;
  }

  // If everything is valid, render the protected component
  return children;
};

export default PrivateRoute;
