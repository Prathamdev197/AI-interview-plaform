import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import API from '../api/axiosInstance';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#0e192c] border border-[#1b2a47] rounded-2xl p-6 sm:p-8 shadow-xl">

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Create Account</h1>
                        <p className="text-xs text-slate-400 mt-1">Start practicing technical interviews</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 mb-6 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#09101d] border border-[#1b2a47] text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-400 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#09101d] border border-[#1b2a47] text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-400 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#09101d] border border-[#1b2a47] text-white rounded-lg pl-10 pr-10 py-2.5 text-xs outline-none focus:border-blue-400 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-sm"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating Account...</span></>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-xs mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:underline font-semibold">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
