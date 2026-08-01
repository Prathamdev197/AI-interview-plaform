import { Volume2, VolumeX } from 'lucide-react';

const QuestionCard = ({ questionText = '', questionIndex = 0, isMuted, onToggleMute }) => {
    return (
        <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 flex justify-between items-start gap-4 text-left">
            <div>
                <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
                    Question {questionIndex + 1}
                </span>
                <h2 className="text-base font-semibold text-[#1C1917] mt-1.5 leading-relaxed">{questionText}</h2>
            </div>
            
            <button
                onClick={onToggleMute}
                className="p-2 rounded-md bg-stone-100 border border-[#E7E5E4] text-stone-500 hover:text-[#1C1917] cursor-pointer shrink-0 transition"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-orange-600" />}
            </button>
        </div>
    );
};

export default QuestionCard;
