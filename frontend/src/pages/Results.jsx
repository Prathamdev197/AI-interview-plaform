import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Award } from 'lucide-react';
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
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAFAF9]">
                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#FAFAF9] text-center px-4">
                <p className="text-base font-bold text-[#1C1917]">Interview results not found.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-5 py-2.5 bg-white border border-[#D6D3D1] text-[#1C1917] hover:bg-stone-50 rounded-md text-sm font-semibold"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 pb-20 max-w-4xl mx-auto space-y-6 text-left">

            {/* Back to Dashboard Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-black transition cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 text-[#1C1917]" />
                <span>Back to Dashboard</span>
            </button>

            {/* Score Summary Banner */}
            <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span>Evaluation Summary</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">{interview.topic}</h1>
                    <p className="text-xs sm:text-sm text-[#78716C] font-medium">
                        {interview.difficulty} Level • {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-4 sm:p-5 text-center shrink-0 min-w-[150px]">
                    <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1">Average Score</p>
                    <p className="text-3xl sm:text-4xl font-bold text-[#1C1917]">
                        {(Number(interview.overallScore) || 0).toFixed(1)} <span className="text-sm text-[#78716C] font-normal">/ 10</span>
                    </p>
                </div>
            </div>

            {/* Detailed Question Breakdown */}
            <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-[#1C1917]">Detailed Evaluation Breakdown</h2>

                {interview.answers?.map((answer, idx) => (
                    <div
                        key={idx}
                        className={`bg-white border rounded-lg p-5 sm:p-6 space-y-4 shadow-xs ${
                            answer.score >= 7 ? 'border-emerald-300' : answer.score >= 4 ? 'border-amber-300' : 'border-rose-300'
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E7E5E4]">
                            <h3 className="font-bold text-sm sm:text-base text-[#1C1917] leading-snug">Q{idx + 1}: {answer.questionText}</h3>
                            <div className="flex items-center gap-1.5 shrink-0 bg-[#FAFAF9] px-3 py-1.5 rounded-md border border-[#E7E5E4]">
                                {answer.score >= 7 ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                )}
                                <span className="text-xs sm:text-sm font-bold text-[#1C1917]">{answer.score} / 10</span>
                            </div>
                        </div>

                        {/* Candidate Answer */}
                        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3.5 sm:p-4">
                            <p className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">Your Answer</p>
                            <p className="text-xs sm:text-sm font-medium text-[#1C1917] leading-relaxed font-sans">{answer.userAnswer || 'No answer submitted.'}</p>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-[#FAFAF9] p-3.5 sm:p-4 rounded-md border border-[#E7E5E4]">
                            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">AI Evaluation</p>
                            <p className="text-xs sm:text-sm font-medium text-[#78716C] leading-relaxed">{answer.feedback}</p>
                        </div>

                        {/* Model Answer */}
                        {answer.idealAnswer && (
                            <div className="bg-orange-50/40 border border-orange-200 rounded-md p-3.5 sm:p-4">
                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Model Answer</p>
                                <p className="text-xs sm:text-sm font-medium text-[#1C1917] leading-relaxed">{answer.idealAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
