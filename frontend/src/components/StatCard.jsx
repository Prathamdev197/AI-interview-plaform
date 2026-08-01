const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white border border-[#E7E5E4] rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 rounded-md bg-stone-100 border border-[#E7E5E4] text-stone-500 shrink-0">
                {icon}
            </div>
            <div className="text-left">
                <p className="text-[#78716C] text-[10px] font-medium uppercase tracking-wider">{title}</p>
                <p className="text-base font-semibold text-[#1C1917] mt-0.5">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
