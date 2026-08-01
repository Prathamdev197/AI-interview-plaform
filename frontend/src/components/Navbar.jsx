import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, LayoutDashboard, ChevronDown, Menu, X, LogIn } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileOpen(false);
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const getInitials = (name = '') =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 border-b border-[#E7E5E4] backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

                {/* Brand */}
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-semibold text-[#1C1917] text-base tracking-tight"
                >
                    <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center text-white shrink-0">
                        <Brain className="w-4 h-4" />
                    </div>
                    <span>InterviewAI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1.5 text-[#78716C] hover:text-[#1C1917] transition"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                                <span>Dashboard</span>
                            </Link>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-stone-100 transition cursor-pointer text-[#1C1917]"
                                >
                                    <div className="w-6 h-6 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center font-semibold text-[10px] select-none">
                                        {getInitials(user.name)}
                                    </div>
                                    <span className="font-medium text-xs">{user.name.split(' ')[0]}</span>
                                    <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E7E5E4] rounded-md shadow-xs overflow-hidden z-50 py-1">
                                        <div className="px-3 py-2 border-b border-[#E7E5E4]">
                                            <p className="text-[#1C1917] font-medium text-xs">{user.name}</p>
                                            <p className="text-[#78716C] text-[10px] truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:text-orange-600 hover:bg-stone-50 transition cursor-pointer text-left"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-[#78716C] hover:text-[#1C1917] px-3 py-1.5">
                                Sign in
                            </Link>
                            <Link to="/register" className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-md transition font-medium">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="sm:hidden text-stone-600 hover:text-stone-900 cursor-pointer p-1 rounded-md border border-[#E7E5E4] bg-white"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="sm:hidden bg-white border-b border-[#E7E5E4] px-4 py-3 space-y-2">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2.5 pb-2 border-b border-[#E7E5E4] mb-1">
                                <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center font-semibold text-xs shrink-0">
                                    {getInitials(user.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[#1C1917] font-medium text-xs truncate">{user.name}</p>
                                    <p className="text-[#78716C] text-[10px] truncate">{user.email}</p>
                                </div>
                            </div>

                            <Link
                                to="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 text-[#1C1917] py-2 text-xs font-medium"
                            >
                                <LayoutDashboard className="w-4 h-4 text-stone-400" />
                                <span>Dashboard</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-stone-600 hover:text-orange-600 py-2 text-xs font-medium cursor-pointer w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log out</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 pt-1">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 flex items-center justify-center gap-1.5 border border-[#E7E5E4] hover:bg-stone-50 text-[#1C1917] py-2 rounded-md text-xs font-medium transition"
                            >
                                <LogIn className="w-3.5 h-3.5 text-stone-400" />
                                <span>Sign in</span>
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md text-xs font-medium transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
