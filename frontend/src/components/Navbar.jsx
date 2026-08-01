import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, LayoutDashboard, ChevronDown, Menu, X, LogIn, UserPlus } from 'lucide-react';

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
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#080e1a]/95 border-b border-[#1b2a47] backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

                {/* Brand */}
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 font-extrabold text-blue-500 text-lg tracking-tight"
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Brain className="w-4 h-4" />
                    </div>
                    <span>InterviewAI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
                            >
                                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                <span>Dashboard</span>
                            </Link>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] select-none">
                                        {getInitials(user.name)}
                                    </div>
                                    <span className="text-slate-200 font-semibold">{user.name.split(' ')[0]}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-xl shadow-lg overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-[#334155]">
                                            <p className="text-white font-bold text-xs">{user.name}</p>
                                            <p className="text-slate-400 text-[10px] mt-0.5 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition cursor-pointer text-left"
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
                            <Link to="/login" className="text-slate-300 hover:text-white px-3 py-1.5">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="sm:hidden text-slate-300 hover:text-white cursor-pointer p-1.5 rounded-lg border border-[#334155] bg-[#1e293b]"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileOpen && (
                <div className="sm:hidden bg-[#0f172a] border-t border-[#334155] px-4 py-4 space-y-3 shadow-xl">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-xl mb-3">
                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {getInitials(user.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                                </div>
                            </div>

                            <Link
                                to="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 text-white bg-[#1e293b] border border-[#334155] hover:bg-[#334155] px-4 py-3 rounded-xl text-xs font-bold transition"
                            >
                                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                <span>Dashboard</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log out</span>
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-center gap-2 bg-[#1e293b] border border-[#334155] hover:bg-[#334155] text-white text-center py-3 rounded-xl text-xs font-bold transition"
                            >
                                <LogIn className="w-4 h-4 text-slate-300" />
                                <span>Login</span>
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl text-xs font-bold transition shadow-sm"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Get Started</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
