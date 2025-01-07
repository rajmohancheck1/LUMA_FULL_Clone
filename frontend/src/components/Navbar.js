import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
              EventHub
            </Link>
            <div className="ml-10 space-x-4">
              <Link to="/events" className="hover:text-blue-200 transition-colors font-medium">
                Events
              </Link>
              {user?.role === 'organizer' && (
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors font-medium">
                  Dashboard
                </Link>
              )}
               {user?.role === 'organizer' && (
                <Link to="/calender" className="hover:text-blue-200 transition-colors font-medium">
                  Calender
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-medium">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors font-medium">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
