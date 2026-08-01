import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, Mic, Volume2 } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen pt-24">
            
            {/* Hero Section — Asymmetric Layout */}
            <section className="bg-[#FAFAF9] border-b border-[#E7E5E4] py-16 sm:py-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                    
                    {/* Left: Text & CTA (Asymmetric, Left-aligned) */}
                    <div className="md:col-span-7 space-y-5 text-left">
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1 rounded-md border border-[#E7E5E4]">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                            AI-Powered Interview Practice
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-semibold text-[#1C1917] tracking-tight leading-tight">
                            Practice technical interviews with structured AI feedback
                        </h1>

                        <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed max-w-lg">
                            Evaluate your technical answers, refine code explanations, and build interview readiness with instant scoring and model answers.
                        </p>

                        <div className="flex items-center gap-3 text-xs pt-2">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2.5 rounded-md flex items-center gap-2 transition"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4.5 py-2.5 rounded-md flex items-center gap-2 transition"
                                    >
                                        <span>Start Practice</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="border border-[#E7E5E4] hover:bg-stone-100 text-[#1C1917] font-medium px-4 py-2.5 rounded-md transition"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Mini Interactive Sample Question Preview Card (No stock illustration) */}
                    <div className="md:col-span-5">
                        <div className="bg-white border border-[#E7E5E4] rounded-lg p-5 shadow-xs text-left space-y-4">
                            <div className="flex items-center justify-between text-[11px] text-[#78716C] border-b border-[#E7E5E4] pb-2.5">
                                <span className="font-medium uppercase tracking-wider text-orange-600">Question 3 of 10</span>
                                <span>React & Microservices</span>
                            </div>

                            <p className="text-xs font-semibold text-[#1C1917] leading-normal">
                                What is the difference between controlled and uncontrolled components in React?
                            </p>

                            <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3 text-[11px] text-stone-600 leading-relaxed font-mono">
                                Controlled components delegate form state to React state, whereas uncontrolled components store state in the DOM via refs.
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#E7E5E4] text-xs">
                                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Score: 9 / 10</span>
                                </div>
                                <span className="text-[11px] text-[#78716C]">Evaluated by Gemini AI</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* How It Works Section — Clean Inline Numbered List (NO Cards / Boxes) */}
            <section className="bg-white py-16 px-4 sm:px-6 border-b border-[#E7E5E4]">
                <div className="max-w-5xl mx-auto space-y-10">
                    <div className="text-left max-w-md space-y-1">
                        <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Workflow</p>
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1917] tracking-tight">How InterviewAI works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="space-y-2">
                            <div className="text-xs font-mono font-semibold text-stone-400">01</div>
                            <h3 className="text-sm font-semibold text-[#1C1917]">Select your role track</h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Choose MERN, React, Node.js, DSA, or custom technical topics with Easy, Medium, or Hard difficulty.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-mono font-semibold text-stone-400">02</div>
                            <h3 className="text-sm font-semibold text-[#1C1917]">Type or speak your answer</h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Questions are read aloud via text-to-speech. Answer naturally using keyboard input or speech recognition.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-mono font-semibold text-stone-400">03</div>
                            <h3 className="text-sm font-semibold text-[#1C1917]">Receive structured evaluation</h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Get instant 0–10 technical scoring, actionable improvement feedback, and complete model answers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Feature Highlights Section */}
            <section className="bg-[#FAFAF9] py-16 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-md bg-stone-100 border border-[#E7E5E4] flex items-center justify-center text-stone-500">
                                <Volume2 className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-semibold text-[#1C1917]">Voice-enabled interview practice</h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Practice real interview conditions with speech-to-text input and question narration powered by Web Speech API.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-md bg-stone-100 border border-[#E7E5E4] flex items-center justify-center text-stone-500">
                                <Mic className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-semibold text-[#1C1917]">Comprehensive history & score tracking</h3>
                            <p className="text-xs text-[#78716C] leading-relaxed">
                                Monitor your evaluation scores across past sessions to track technical growth and target weak topics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-[#E7E5E4] py-8 px-4 sm:px-6 text-xs text-[#78716C]">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span>InterviewAI &copy; 2026. All rights reserved.</span>
                    <div className="flex gap-4 text-[11px]">
                        <Link to="/privacy" className="hover:text-[#1C1917]">Privacy</Link>
                        <Link to="/terms" className="hover:text-[#1C1917]">Terms</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
