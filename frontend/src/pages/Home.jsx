import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen pt-20 flex flex-col justify-between">
            
            <div>
                {/* Hero Section — Asymmetric Layout */}
                <section className="bg-[#FAFAF9] border-b border-[#E7E5E4] py-16 sm:py-24 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                        
                        {/* Left: Text & CTA */}
                        <div className="md:col-span-7 space-y-6 text-left">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1917] bg-white px-3.5 py-1 rounded-md border border-[#D6D3D1]">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                                AI Technical Interview Practice
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1917] tracking-tight leading-[1.15]">
                                Practice technical interviews with structured AI feedback
                            </h1>

                            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed max-w-lg font-medium">
                                Evaluate your technical answers, refine code explanations, and build interview readiness with instant scoring and model answers.
                            </p>

                            <div className="flex items-center gap-3 text-sm pt-1 font-semibold">
                                {user ? (
                                    <Link
                                        to="/dashboard"
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-md flex items-center gap-2 transition"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/register"
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-md flex items-center gap-2 transition"
                                        >
                                            <span>Start Practice</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="border border-[#D6D3D1] bg-white hover:bg-stone-50 text-[#1C1917] font-semibold px-5 py-2.5 rounded-md transition"
                                        >
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right: Mini Evaluation Snippet Preview */}
                        <div className="md:col-span-5">
                            <div className="bg-white border border-[#E7E5E4] rounded-lg p-5 shadow-xs text-left space-y-4">
                                <div className="flex items-center justify-between text-xs text-[#78716C] border-b border-[#E7E5E4] pb-2.5">
                                    <span className="font-bold uppercase tracking-wider text-orange-600">Question 3 of 10</span>
                                    <span className="font-medium">React & Frontend</span>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-[#1C1917] leading-snug">
                                    What is the difference between controlled and uncontrolled components in React?
                                </p>

                                <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3 text-xs text-stone-700 leading-relaxed font-mono">
                                    Controlled components delegate state to React, whereas uncontrolled components use refs to read directly from the DOM.
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-[#E7E5E4] text-xs">
                                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Score: 9 / 10</span>
                                    </div>
                                    <span className="text-[#78716C] font-medium">Evaluated by Gemini AI</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Workflow Section — Minimalist Inline 3-Step List */}
                <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 border-b border-[#E7E5E4]">
                    <div className="max-w-5xl mx-auto space-y-10">
                        <div className="text-left space-y-1">
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Workflow</p>
                            <h2 className="text-xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">How InterviewAI works</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            <div className="space-y-2">
                                <div className="text-xs font-mono font-bold text-stone-400">01</div>
                                <h3 className="text-base font-bold text-[#1C1917]">Select your role track</h3>
                                <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-medium">
                                    Choose MERN, React, Node.js, DSA, or custom technical topics with Easy, Medium, or Hard difficulty.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-mono font-bold text-stone-400">02</div>
                                <h3 className="text-base font-bold text-[#1C1917]">Type or speak your answer</h3>
                                <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-medium">
                                    Questions are read aloud via text-to-speech. Answer naturally using keyboard input or speech recognition.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-mono font-bold text-stone-400">03</div>
                                <h3 className="text-base font-bold text-[#1C1917]">Receive structured evaluation</h3>
                                <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-medium">
                                    Get instant 0–10 technical scoring, actionable improvement feedback, and complete model answers.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer — Compact height, darker warm shade #F5F5F4 */}
            <footer className="bg-[#F5F5F4] border-t border-[#D6D3D1] py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm text-[#1C1917]">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-semibold">
                    <span>InterviewAI &copy; 2026. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-black transition">Privacy</Link>
                        <Link to="/terms" className="hover:text-black transition">Terms</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
