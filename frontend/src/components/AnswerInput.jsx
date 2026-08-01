import { useState } from 'react';
import { Send, Loader2, CheckCircle, XCircle, Award, ArrowRight, Mic, MicOff } from 'lucide-react';

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
                    if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
                }
                if (final) setUserAnswer((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
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
            <div className="space-y-4">
                <div className={`bg-[#0e192c] border rounded-xl p-5 ${feedback.score >= 7 ? 'border-emerald-500/40' : 'border-amber-500/40'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {feedback.score >= 7
                            ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                            : <XCircle className="w-5 h-5 text-amber-400" />
                        }
                        <span className="text-xl font-bold text-white">{feedback.score}/10</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{feedback.feedback}</p>
                    {feedback.idealAnswer && (
                        <div className="bg-[#09101d] border border-[#1b2a47] rounded-lg p-3 mt-3">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Model Answer</p>
                            <p className="text-xs text-white mt-0.5 leading-relaxed">{feedback.idealAnswer}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onNext}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                >
                    {currentQIndex + 1 >= questionsLength ? (
                        <><Award className="w-4 h-4" /><span>Complete Session & View Results</span></>
                    ) : (
                        <><span>Next Question</span><ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer or click mic to speak..."
                    rows={4}
                    className="w-full bg-[#09101d] border border-[#1b2a47] text-white rounded-xl p-4 text-xs outline-none focus:border-blue-400 transition resize-none"
                    disabled={loading}
                />
                <button
                    type="button"
                    onClick={toggleMic}
                    disabled={loading}
                    className={`absolute bottom-3 right-3 p-1.5 rounded-lg text-xs font-semibold border cursor-pointer flex items-center gap-1.5 transition ${
                        isListening
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-[#0e192c] border border-[#1b2a47] text-blue-400 hover:bg-[#182845]'
                    }`}
                >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Recording...' : 'Voice'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 text-xs">{error}</div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading || !userAnswer.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition shadow-sm"
            >
                {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Evaluating Answer...</span></>
                ) : (
                    <><Send className="w-4 h-4" /><span>Submit Answer</span></>
                )}
            </button>
        </div>
    );
};

export default AnswerInput;
