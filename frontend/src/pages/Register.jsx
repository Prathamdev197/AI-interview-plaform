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
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-[#FAFAF9]">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 sm:p-8 text-left">

                    <div className="text-center mb-6 space-y-1">
                        <div className="w-10 h-10 rounded-md bg-stone-100 border border-[#E7E5E4] text-stone-600 flex items-center justify-center mx-auto mb-2">
                            <UserPlus className="w-5 h-5 text-orange-600" />
                        </div>
                        <h1 className="text-lg font-semibold text-[#1C1917]">Create Account</h1>
                        <p className="text-xs text-[#78716C]">Start practicing technical interviews</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-md p-3 mb-5 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[#78716C]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#FAFAF9] border border-[#E7E5E4] text-[#1C1917] rounded-md pl-9 pr-3 py-2 text-xs outline-none focus:border-orange-600 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[#78716C]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#FAFAF9] border border-[#E7E5E4] text-[#1C1917] rounded-md pl-9 pr-3 py-2 text-xs outline-none focus:border-orange-600 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[#78716C]">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#FAFAF9] border border-[#E7E5E4] text-[#1C1917] rounded-md pl-9 pr-9 py-2 text-xs outline-none focus:border-orange-600 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                            {loading ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Creating Account...</span></>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[#78716C] text-xs mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-600 hover:underline font-medium">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
