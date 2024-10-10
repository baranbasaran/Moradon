import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // Make sure to adjust the import path

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
