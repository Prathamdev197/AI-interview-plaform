import { Volume2, VolumeX } from 'lucide-react';

const QuestionCard = ({ questionText = '', questionIndex = 0, isMuted, onToggleMute }) => {
    return (
        <div className="bg-[#0e192c] border border-[#1b2a47] rounded-xl p-6 flex justify-between items-start gap-4">
            <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Question {questionIndex + 1}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-relaxed">{questionText}</h2>
            </div>
            <button
                onClick={onToggleMute}
                className="p-2.5 rounded-lg bg-[#09101d] border border-[#1b2a47] text-slate-400 hover:text-white cursor-pointer shrink-0 transition"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            </button>
        </div>
    );
};

export default QuestionCard;
