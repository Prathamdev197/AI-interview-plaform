import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Award, LogOut } from 'lucide-react';
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);
    const speechTokenRef = useRef(0);

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

    const speakQuestion = useCallback((rawText, speechToken) => {
        const synth = window.speechSynthesis;
        if (!synth) return;
        synth.cancel();

        const cleanText = rawText
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/[`*#_~]/g, ' ')
            .trim();

        const u = new SpeechSynthesisUtterance(cleanText);
        utteranceRef.current = u;
        u.rate = 0.95;

        u.onstart = () => {
            if (speechTokenRef.current !== speechToken) return;
            setIsSpeaking(true);
        };
        u.onend = () => {
            if (speechTokenRef.current !== speechToken) return;
            setIsSpeaking(false);
        };
        u.onerror = () => {
            if (speechTokenRef.current !== speechToken) return;
            setIsSpeaking(false);
        };

        synth.speak(u);
    }, []);

    useEffect(() => {
        if (loadingQuestions || isFinished || feedback || isMuted) return;
        if (!questions.length || !questions[currentQIndex]) return;

        const text = questions[currentQIndex].questionText;
        if (!text) return;
        const speechToken = ++speechTokenRef.current;

        const timer = setTimeout(() => {
            if (speechTokenRef.current === speechToken) {
                speakQuestion(text, speechToken);
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            speechTokenRef.current += 1;
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
        };
    }, [currentQIndex, loadingQuestions, isFinished, feedback, isMuted, speakQuestion]);

    const toggleMute = () => {
        if (!isMuted) {
            speechTokenRef.current += 1;
            window.speechSynthesis?.cancel();
            setIsMuted(true);
            setIsSpeaking(false);
        } else {
            setIsMuted(false);
            const q = questions[currentQIndex];
            if (q?.questionText && !feedback) {
                speakQuestion(q.questionText, ++speechTokenRef.current);
            }
        }
    };

    const handleSubmitAnswer = async (explicitText = '') => {
        speechTokenRef.current += 1;
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);

        let answerToSubmit = typeof explicitText === 'string' && explicitText.trim() ? explicitText.trim() : userAnswer.trim();
        if (!answerToSubmit) return;

        setLoading(true);
        setFeedback(null);
        setError('');

        try {
            const { data } = await API.post(`/interviews/${id}/answer`, {
                questionIndex: currentQIndex,
                userAnswer: answerToSubmit,
            });
            setFeedback(data.evaluation);
            
            const newOverall = Number(data.overallScore) || 0;
            const newTotalAnswered = Number(data.answeredCount) || 1;
            setTotalScore(newOverall * newTotalAnswered);
            setAnsweredCount(newTotalAnswered);
        } catch (err) {
            console.error('Failed to submit answer:', err);
            setError(err.response?.data?.message || 'Failed to submit answer.');
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
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#0f172a]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Loading Interview Room...</p>
            </div>
        );
    }

    if (isFinished) {
        const safeTotal = Number(totalScore) || 0;
        const totalAnswered = Number(answeredCount) || 1;
        const avgScore = (safeTotal / totalAnswered).toFixed(1);

        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
                <div className="bg-[#0e192c] border border-[#1b2a47] rounded-3xl p-8 max-w-lg w-full text-center shadow-xl space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-sm">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Interview Complete!</h1>
                        <p className="text-xs text-slate-300 mt-1">Here is your technical performance score</p>
                    </div>

                    <div className="bg-[#09101d] border border-[#1b2a47] rounded-2xl p-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Average Tech Score</p>
                        <p className="text-4xl font-extrabold text-white">{avgScore} <span className="text-sm text-slate-400 font-normal">/ 10</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="bg-[#09101d] border border-[#1b2a47] rounded-xl p-3.5">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Topic Track</p>
                            <p className="text-xs font-bold text-white mt-0.5 truncate">{interview?.topic}</p>
                        </div>
                        <div className="bg-[#09101d] border border-[#1b2a47] rounded-xl p-3.5">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Questions Answered</p>
                            <p className="text-xs font-bold text-white mt-0.5">{answeredCount} of {questions.length}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/results/${id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>View Detailed Feedback & Evaluation</span>
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
            
            {/* Header Controls */}
            <div className="bg-[#0e192c] border border-[#1b2a47] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                        {interview?.topic} INTERVIEW
                    </h1>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                        Question {currentQIndex + 1} of {questions.length} • {interview?.difficulty} Mode
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowQuitModal(true)}
                        className="p-2 rounded-xl bg-[#09101d] border border-[#1b2a47] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Quit Interview"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Question & Answer Component Stack */}
            <div className="bg-[#0e192c] border border-[#1b2a47] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <QuestionCard
                    questionText={currentQ?.questionText}
                    questionIndex={currentQIndex}
                    isMuted={isMuted}
                    isSpeaking={isSpeaking}
                    onToggleMute={toggleMute}
                />

                <div className="h-px bg-[#1b2a47] my-4" />

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
            </div>

            {/* Quit Confirmation Modal */}
            {showQuitModal && (
                <div className="fixed inset-0 bg-[#060b13]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0e192c] border border-[#1b2a47] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-white">Quit Interview Session?</h3>
                        <p className="text-xs text-slate-400">Unanswered questions will not be scored.</p>
                        
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowQuitModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-[#09101d] hover:bg-[#14233c] text-white text-xs font-semibold transition cursor-pointer border border-[#1b2a47]"
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => {
                                    setShowQuitModal(false);
                                    setIsFinished(true);
                                }}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                            >
                                Quit Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Interview;
