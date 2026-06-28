import React from 'react';
import './Layout.css';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {   // Removed unused children prop
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (): string => {
    switch (location.pathname) {
      case '/':
        return 'Home - The Block';
      default:
        return 'The Block';
    }
  };

  usePageTitle(getPageTitle());
  const { accessToken } = useAuthStore.getState();
  const authLogout = useAuthStore(
        (state) => state.logout
    );

  const handleLogout = () => {
        authLogout();
        navigate("/", { replace: true });
    };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>The Block</h1>
          <nav>
            <Link to="/">Home</Link>
            {accessToken ? (
              <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-white hover:text-red-600 cursor-pointer"
                >
                    Sign Out
                </button>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;