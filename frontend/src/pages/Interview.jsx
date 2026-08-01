import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Award, LogOut, ArrowLeft } from 'lucide-react';
import API from '../api/axiosInstance';

import QuestionCard from '../components/QuestionCard';
import AnswerInput from '../components/AnswerInput';

const Interview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState('');
    const [showQuitModal, setShowQuitModal] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const { data } = await API.get(`/interviews/${id}`);
                setInterview(data);
                setQuestions(data.questions || []);
                setAnsweredCount(data.answers?.length || 0);
                setTotalScore(data.answers?.reduce((sum, a) => sum + (a.score || 0), 0) || 0);

                if ((data.answers?.length || 0) >= (data.questions?.length || 0) && (data.questions?.length || 0) > 0) {
                    setIsFinished(true);
                } else {
                    setCurrentQIndex(data.answers?.length || 0);
                }
            } catch (err) {
                console.error('Failed to fetch interview:', err);
                setError(err.response?.data?.message || 'Failed to load interview.');
            } finally {
                setLoadingQuestions(false);
            }
        };

        fetchInterview();
    }, [id]);

    const speakQuestion = useCallback((rawText) => {
        const synth = window.speechSynthesis;
        if (!synth) return;
        synth.cancel();

        if (isMuted) return;

        const cleanText = rawText
            .replace(/`/g, '')
            .replace(/[*_#]/g, '')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utteranceRef.current = utterance;
        synth.speak(utterance);
    }, [isMuted]);

    useEffect(() => {
        if (!loadingQuestions && questions.length > 0 && !isFinished && !feedback) {
            const currentQ = questions[currentQIndex];
            if (currentQ?.questionText) {
                speakQuestion(currentQ.questionText);
            }
        }
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, [currentQIndex, questions, loadingQuestions, isFinished, feedback, speakQuestion]);

    const handleToggleMute = () => {
        setIsMuted((prev) => {
            const nextState = !prev;
            if (nextState) {
                window.speechSynthesis?.cancel();
            } else if (questions[currentQIndex]?.questionText) {
                speakQuestion(questions[currentQIndex].questionText);
            }
            return nextState;
        });
    };

    const handleSubmitAnswer = async (ans) => {
        if (!ans.trim()) return;
        window.speechSynthesis?.cancel();
        setLoading(true);
        setError('');

        try {
            const { data } = await API.post(`/interviews/${id}/answer`, {
                questionIndex: currentQIndex,
                userAnswer: ans
            });

            setFeedback(data.evaluation);
            setTotalScore((prev) => prev + data.evaluation.score);
            setAnsweredCount(data.answeredCount);
        } catch (err) {
            console.error('Error submitting answer:', err);
            setError(err.response?.data?.message || 'Failed to evaluate answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQIndex + 1 >= questions.length) {
            setIsFinished(true);
            return;
        }

        setCurrentQIndex(prev => prev + 1);
        setUserAnswer('');
        setFeedback(null);
        setError('');
    };

    if (loadingQuestions) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#FAFAF9]">
                <Loader2 className="w-6 h-6 animate-spin text-orange-600 mb-2" />
                <p className="text-xs text-[#78716C]">Loading interview session...</p>
            </div>
        );
    }

    if (isFinished) {
        const safeTotal = Number(totalScore) || 0;
        const totalAnswered = Number(answeredCount) || 1;
        const avgScore = (safeTotal / totalAnswered).toFixed(1);

        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
                <div className="bg-white border border-[#E7E5E4] rounded-lg p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-12 h-12 rounded-md bg-stone-100 border border-[#E7E5E4] text-stone-600 flex items-center justify-center mx-auto">
                        <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-[#1C1917]">Session Completed</h1>
                        <p className="text-xs text-[#78716C]">Technical evaluation summary</p>
                    </div>

                    <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-5">
                        <p className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">Average Tech Score</p>
                        <p className="text-3xl font-semibold text-[#1C1917] mt-0.5">{avgScore} <span className="text-xs text-[#78716C] font-normal">/ 10</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3">
                            <p className="text-[10px] font-medium text-[#78716C] uppercase">Topic Track</p>
                            <p className="text-xs font-semibold text-[#1C1917] mt-0.5 truncate">{interview?.topic}</p>
                        </div>
                        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3">
                            <p className="text-[10px] font-medium text-[#78716C] uppercase">Answered</p>
                            <p className="text-xs font-semibold text-[#1C1917] mt-0.5">{answeredCount} of {questions.length}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/results/${id}`)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-md text-xs transition cursor-pointer"
                    >
                        View Full Results Breakdown
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">

            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
                <button
                    onClick={() => setShowQuitModal(true)}
                    className="flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Exit Session</span>
                </button>

                <div className="text-xs text-[#78716C] font-mono">
                    Question <span className="text-[#1C1917] font-semibold">{currentQIndex + 1}</span> of {questions.length}
                </div>
            </div>

            {/* Question Card */}
            {currentQ && (
                <QuestionCard
                    questionText={currentQ.questionText}
                    questionIndex={currentQIndex}
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                />
            )}

            {/* Answer Input Card */}
            <AnswerInput
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                feedback={feedback}
                loading={loading}
                error={error}
                onSubmit={handleSubmitAnswer}
                onNext={handleNextQuestion}
                currentQIndex={currentQIndex}
                questionsLength={questions.length}
            />

            {/* Quit Confirmation Modal */}
            {showQuitModal && (
                <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 max-w-sm w-full space-y-4 text-left shadow-lg">
                        <h3 className="text-sm font-semibold text-[#1C1917]">Exit Interview Session?</h3>
                        <p className="text-xs text-[#78716C] leading-relaxed">
                            Your current session progress will be saved up to the last answered question.
                        </p>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowQuitModal(false)}
                                className="px-3.5 py-1.5 rounded-md border border-[#E7E5E4] text-xs font-medium text-[#1C1917] hover:bg-stone-50 cursor-pointer"
                            >
                                Continue Session
                            </button>
                            <button
                                onClick={() => {
                                    window.speechSynthesis?.cancel();
                                    navigate('/dashboard');
                                }}
                                className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interview;
