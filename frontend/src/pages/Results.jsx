import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Award } from 'lucide-react';
import API from '../api/axiosInstance';

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const { data } = await API.get(`/interviews/${id}`);
                setInterview(data);
            } catch (err) {
                console.error('Failed to fetch interview:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterview();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0f172a]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#0f172a] text-center px-4">
                <p className="text-sm font-bold text-white">Interview results not found.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2.5 bg-[#1e293b] border border-[#334155] text-white rounded-xl text-xs font-semibold"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 pb-20 max-w-4xl mx-auto space-y-6">

            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            {/* Score Summary */}
            <div className="bg-[#0e192c] border border-[#1b2a47] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                        <Award className="w-4 h-4" /> Technical Evaluation
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white">{interview.topic}</h1>
                    <p className="text-xs text-slate-400">{interview.difficulty} Level • {new Date(interview.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#09101d] border border-[#1b2a47] rounded-xl p-5 text-center shrink-0 min-w-[140px]">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Average Score</p>
                    <p className="text-3xl font-extrabold text-white">
                        {(Number(interview.overallScore) || 0).toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                    </p>
                </div>
            </div>

            {/* Answers */}
            <div className="space-y-4">
                <h2 className="text-base font-bold text-white px-1">Detailed Question Feedback</h2>

                {interview.answers?.map((answer, idx) => (
                    <div
                        key={idx}
                        className={`bg-[#0e192c] border rounded-2xl p-6 space-y-4 ${
                            answer.score >= 7 ? 'border-emerald-500/40' : answer.score >= 4 ? 'border-amber-500/40' : 'border-rose-500/40'
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b2a47]">
                            <h3 className="font-bold text-sm text-white">Q{idx + 1}: {answer.questionText}</h3>
                            <div className="flex items-center gap-1.5 shrink-0 bg-[#09101d] px-3.5 py-1.5 rounded-full border border-[#1b2a47]">
                                {answer.score >= 7
                                    ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    : <XCircle className="w-4 h-4 text-rose-400" />
                                }
                                <span className="text-xs font-bold text-white">{answer.score} / 10</span>
                            </div>
                        </div>

                        <div className="bg-[#09101d] border border-[#1b2a47] rounded-xl p-4">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Answer</p>
                            <p className="text-xs text-slate-200 leading-relaxed">{answer.userAnswer || 'No answer submitted.'}</p>
                        </div>

                        <div className="bg-[#09101d]/60 p-4 rounded-xl border border-[#1b2a47]">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">AI Evaluation</p>
                            <p className="text-xs text-slate-200 leading-relaxed">{answer.feedback}</p>
                        </div>

                        {answer.idealAnswer && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Model Answer</p>
                                <p className="text-xs text-slate-200 leading-relaxed">{answer.idealAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
