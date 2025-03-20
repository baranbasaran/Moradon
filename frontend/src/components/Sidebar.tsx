import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import {
  FaHome,
  FaBook,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { generateAvatar } from "../utils/avatarUtils";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const navItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/books", icon: <FaBook />, label: "Books" },
    { path: "/profile", icon: <FaUser />, label: "Profile" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <FaTimes className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <FaBars className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="Moradon" className="w-8 h-8" />
          {isOpen && (
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Moradon
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={generateAvatar(user.username)}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute bottom-20 left-0 right-0 mx-4 p-3 flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <FaSignOutAlt className="text-xl" />
        {isOpen && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
