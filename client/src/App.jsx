import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import useToast from './hooks/useToast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Loader from './components/Loader';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Detect from './pages/Detect';
import Result from './pages/Result';
import MyContent from './pages/MyContent';
import Verify from './pages/Verify';
import Admin from './pages/Admin';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
};

// App Content (needs to be inside AuthProvider)
const AppContent = () => {
    const toast = useToast();

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Landing />} />
                        <Route path="/detect" element={<Detect />} />
                        <Route path="/result/:id" element={<Result />} />
                        <Route path="/verify" element={<Verify />} />

                        <Route
                            path="/my-content"
                            element={
                                <ProtectedRoute>
                                    <MyContent />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
                <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
            </div>
        </Router>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
