import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { isDark } = useContext(ThemeContext);

    return (
        <nav className="glass sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">©</span>
                        </div>
                        <span className="font-poppins font-bold text-xl hidden sm:block">
                            AI Copyright
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/detect" className="hover:text-primary transition-colors">
                            Detect
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/my-content" className="hover:text-primary transition-colors">
                                    My Content
                                </Link>
                                <Link to="/verify" className="hover:text-primary transition-colors">
                                    Verify
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin" className="hover:text-primary transition-colors font-semibold">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {user?.name}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="btn btn-outline text-sm px-4 py-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary text-sm px-4 py-2">
                                    Get Started
                                </Link>
                            </>
                        )}

                        <DarkModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <DarkModeToggle />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col space-y-3">
                        <Link to="/detect" className="hover:text-primary transition-colors">
                            Detect Content
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/my-content" className="hover:text-primary transition-colors">
                                    My Content
                                </Link>
                                <Link to="/verify" className="hover:text-primary transition-colors">
                                    Verify Ownership
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin" className="hover:text-primary transition-colors font-semibold">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {user?.name}
                                    </p>
                                    <button
                                        onClick={logout}
                                        className="btn btn-outline w-full text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary w-full text-sm">
                                    Get Started
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
