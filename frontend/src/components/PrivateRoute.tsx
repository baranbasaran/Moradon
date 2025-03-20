import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { RootState, AppDispatch } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/" />;
  }

  // Check if the token is valid
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      dispatch(logout());
      return <Navigate to="/" />;
    }
  } catch (error) {
    // Handle invalid token format or decoding errors
    dispatch(logout());
    return <Navigate to="/" />;
  }

  // If everything is valid, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
