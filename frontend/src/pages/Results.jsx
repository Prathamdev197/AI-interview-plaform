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
                <p className="text-sm font-semibold text-[#1C1917]">Interview results not found.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-4 py-2 bg-white border border-[#E7E5E4] text-[#1C1917] hover:bg-stone-50 rounded-md text-xs font-medium"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 pb-20 max-w-4xl mx-auto space-y-6 text-left">

            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition cursor-pointer"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>

            {/* Score Summary Banner */}
            <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-orange-600" />
                        <span>Evaluation Summary</span>
                    </div>
                    <h1 className="text-xl font-semibold text-[#1C1917] tracking-tight">{interview.topic}</h1>
                    <p className="text-xs text-[#78716C]">{interview.difficulty} Level • {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-4 text-center shrink-0 min-w-[130px]">
                    <p className="text-[10px] font-medium text-[#78716C] uppercase tracking-wider mb-0.5">Average Score</p>
                    <p className="text-2xl font-semibold text-[#1C1917]">
                        {(Number(interview.overallScore) || 0).toFixed(1)} <span className="text-xs text-[#78716C] font-normal">/ 10</span>
                    </p>
                </div>
            </div>

            {/* Answers Breakdown */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-[#1C1917]">Detailed Evaluation Breakdown</h2>

                {interview.answers?.map((answer, idx) => (
                    <div
                        key={idx}
                        className={`bg-white border rounded-lg p-5 space-y-3.5 ${
                            answer.score >= 7 ? 'border-emerald-300' : answer.score >= 4 ? 'border-amber-300' : 'border-rose-300'
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E5E4]">
                            <h3 className="font-semibold text-xs text-[#1C1917]">Q{idx + 1}: {answer.questionText}</h3>
                            <div className="flex items-center gap-1.5 shrink-0 bg-[#FAFAF9] px-2.5 py-1 rounded-md border border-[#E7E5E4]">
                                {answer.score >= 7 ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                )}
                                <span className="text-xs font-semibold text-[#1C1917]">{answer.score} / 10</span>
                            </div>
                        </div>

                        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3">
                            <p className="text-[10px] font-medium text-[#78716C] uppercase tracking-wider mb-0.5">Your Answer</p>
                            <p className="text-xs text-[#1C1917] leading-relaxed font-sans">{answer.userAnswer || 'No answer submitted.'}</p>
                        </div>

                        <div className="bg-[#FAFAF9] p-3 rounded-md border border-[#E7E5E4]">
                            <p className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-0.5">AI Evaluation</p>
                            <p className="text-xs text-[#78716C] leading-relaxed">{answer.feedback}</p>
                        </div>

                        {answer.idealAnswer && (
                            <div className="bg-orange-50/30 border border-orange-200 rounded-md p-3">
                                <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider mb-0.5">Model Answer</p>
                                <p className="text-xs text-[#1C1917] leading-relaxed">{answer.idealAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
