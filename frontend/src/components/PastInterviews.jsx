import { Trash2, Eye, Award } from 'lucide-react';

const PastInterviews = ({ interviews = [], onViewDetails, onDelete }) => {
    if (interviews.length === 0) {
        return (
            <div className="bg-[#0e192c] border border-[#1b2a47] rounded-xl p-6 text-center text-xs font-medium text-slate-400">
                No past interviews found. Start your first session above!
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" /> Past Interview Sessions
            </h2>

            <div className="space-y-3">
                {interviews.map((interview) => (
                    <div
                        key={interview._id}
                        className="bg-[#0e192c] border border-[#1b2a47] hover:border-blue-500/30 rounded-xl p-4 flex items-center justify-between text-xs transition"
                    >
                        <div>
                            <p className="font-bold text-white text-sm">
                                {interview.topic} <span className="text-slate-400 font-normal">({interview.difficulty})</span>
                            </p>
                            <p className="text-slate-400 mt-0.5">
                                {new Date(interview.createdAt).toLocaleDateString()} • Score: <strong className="text-blue-400">{interview.overallScore}/10</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onViewDetails(interview._id)}
                                className="bg-[#182845] hover:bg-[#20365c] border border-[#1b2a47] text-white px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
                            >
                                <Eye className="w-3.5 h-3.5 text-blue-400" /> View
                            </button>

                            <button
                                onClick={() => onDelete(interview._id)}
                                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 p-1.5 rounded-lg cursor-pointer transition"
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
