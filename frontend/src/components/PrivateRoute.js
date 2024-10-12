// src/components/PrivateRoute.js
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../redux/authSlice"; // Ensure this path is correct
import { jwtDecode } from "jwt-decode"; // Change to named import

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // Check if the token is valid
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // This will work with named import
      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch(logout()); // Dispatch logout if the token is expired
        return <Navigate to="/" />;
      }
    } catch (error) {
      dispatch(logout()); // If decoding fails, logout
      return <Navigate to="/" />;
    }
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
