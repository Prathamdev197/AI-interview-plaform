import { Trash2, Eye, Award } from 'lucide-react';

const PastInterviews = ({ interviews = [], onViewDetails, onDelete }) => {
    if (interviews.length === 0) {
        return (
            <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 text-center text-xs text-[#78716C]">
                No past interview sessions found. Start your first practice session above.
            </div>
        );
    }

    return (
        <div className="space-y-3 text-left">
            <h2 className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                <Award className="w-4 h-4 text-stone-400" />
                <span>Past Interview Sessions</span>
            </h2>

            <div className="bg-white border border-[#E7E5E4] rounded-lg divide-y divide-[#E7E5E4] overflow-hidden">
                {interviews.map((interview) => (
                    <div
                        key={interview._id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAFAF9] transition text-xs"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-[#1C1917] truncate">{interview.topic}</p>
                                <span className="text-[10px] font-mono text-[#78716C] bg-stone-100 px-2 py-0.5 rounded border border-[#E7E5E4]">
                                    {interview.difficulty}
                                </span>
                            </div>
                            <p className="text-[#78716C] mt-1 text-[11px]">
                                {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Overall Score: <strong className="text-orange-600 font-semibold">{interview.overallScore}/10</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => onViewDetails(interview._id)}
                                className="bg-stone-100 hover:bg-stone-200 border border-[#E7E5E4] text-[#1C1917] px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 cursor-pointer transition"
                            >
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>View</span>
                            </button>

                            <button
                                onClick={() => onDelete(interview._id)}
                                className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-stone-100 cursor-pointer transition"
                                title="Delete Record"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PastInterviews;
