const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-[#0e192c] border border-[#1b2a47] rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/30 transition">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
                <p className="text-xl font-bold text-white mt-0.5">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
