import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BookOpen, Mic, Award } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 max-w-4xl mx-auto text-center space-y-14">

            <div className="space-y-6 pt-4">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-500 leading-tight max-w-3xl mx-auto tracking-tight">
                    Practice Technical Interviews with AI
                </h1>

                <p className="text-sm sm:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed font-medium">
                    Build your interview confidence with instant scoring, voice question reading, and helpful model answers.
                </p>

                <div className="flex justify-center gap-4 text-xs font-semibold pt-2">
                    {user ? (
                        <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 transition shadow-sm font-semibold">
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 transition shadow-sm font-semibold">
                                <span>Start Practice</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/login" className="bg-[#0e192c] hover:bg-[#182845] border border-[#1b2a47] text-slate-200 px-8 py-3.5 rounded-xl transition font-medium">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-4">
                <div className="bg-[#0e192c] border border-[#1b2a47] hover:border-blue-500/40 rounded-2xl p-6 space-y-3 transition">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">1. Select a Topic</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">Choose React, Node.js, Full Stack, or DSA to begin your practice session.</p>
                </div>

                <div className="bg-[#0e192c] border border-[#1b2a47] hover:border-blue-500/40 rounded-2xl p-6 space-y-3 transition">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Mic className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">2. Answer Questions</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">Listen to questions read aloud, then type or speak your answer naturally.</p>
                </div>

                <div className="bg-[#0e192c] border border-[#1b2a47] hover:border-blue-500/40 rounded-2xl p-6 space-y-3 transition">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">3. Get Instant Feedback</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">Receive a score out of 10 along with detailed model answers to improve.</p>
                </div>
            </div>

            <footer className="pt-12 text-xs text-slate-400 border-t border-[#1b2a47]">
                © 2026 InterviewAI. All rights reserved.
            </footer>

        </div>
    );
};

export default Home;
