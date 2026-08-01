import { useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, Award, ArrowRight, Mic, MicOff } from 'lucide-react';

const AnswerInput = ({
    userAnswer = '',
    setUserAnswer,
    feedback = null,
    loading = false,
    error = '',
    onSubmit,
    onNext,
    currentQIndex = 0,
    questionsLength = 0
}) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    const toggleMic = () => {
        if (isListening) {
            if (recognition) recognition.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('Voice recording requires Google Chrome or Microsoft Edge.');
                return;
            }

            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'en-US';

            rec.onresult = (event) => {
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript + ' ';
                    }
                }
                if (final) {
                    setUserAnswer((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
                }
            };

            rec.start();
            setRecognition(rec);
            setIsListening(true);
        }
    };

    const handleSubmit = () => {
        if (isListening && recognition) {
            recognition.stop();
            setIsListening(false);
        }
        onSubmit(userAnswer);
    };

    if (feedback) {
        return (
            <div className="space-y-4 text-left">
                <div className={`bg-white border rounded-lg p-5 ${
                    feedback.score >= 7 ? 'border-emerald-300' : 'border-amber-300'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {feedback.score >= 7 ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <XCircle className="w-5 h-5 text-amber-600" />
                        )}
                        <span className="text-xl font-semibold text-[#1C1917]">{feedback.score} / 10</span>
                    </div>
                    <p className="text-xs text-[#78716C] leading-relaxed">{feedback.feedback}</p>
                    
                    {feedback.idealAnswer && (
                        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-md p-3.5 mt-3">
                            <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">Model Answer</p>
                            <p className="text-xs text-[#1C1917] mt-0.5 leading-relaxed">{feedback.idealAnswer}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onNext}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                    {currentQIndex + 1 >= questionsLength ? (
                        <>
                            <Award className="w-4 h-4" />
                            <span>Complete Session & View Results</span>
                        </>
                    ) : (
                        <>
                            <span>Next Question</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-left">
            <div className="relative">
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer or click mic to speak..."
                    rows={4}
                    className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] rounded-lg p-4 text-xs outline-none focus:border-orange-600 transition resize-none font-sans"
                    disabled={loading}
                />
                
                <button
                    type="button"
                    onClick={toggleMic}
                    disabled={loading}
                    className={`absolute bottom-3 right-3 p-2 rounded-md text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition ${
                        isListening
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] hover:bg-stone-100'
                    }`}
                >
                    {isListening ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{isListening ? 'Recording...' : 'Voice'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-md p-3 text-xs font-medium">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading || !userAnswer.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Answer...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>Submit Answer</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default AnswerInput;
