import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Loader2 } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
            <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
            <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
    );
    return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-[#FAFAF9] font-sans text-[#1C1917]">
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/interview/:id" element={<PrivateRoute><Interview /></PrivateRoute>} />
                        <Route path="/results/:id" element={<PrivateRoute><Results /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
