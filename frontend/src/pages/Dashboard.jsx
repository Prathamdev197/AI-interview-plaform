import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Calendar, Trophy, TrendingUp, Loader2, Code, Terminal, Globe, Database, Cpu, Layers } from 'lucide-react';
import API from '../api/axiosInstance';

import StatCard from '../components/StatCard';
import PastInterviews from '../components/PastInterviews';

const PRESET_ROLES = [
    { name: 'Full Stack MERN Developer', topic: 'MERN Stack Developer', icon: <Code className="w-5 h-5 text-blue-400" /> },
    { name: 'Frontend React Engineer', topic: 'Frontend React Engineer', icon: <Globe className="w-5 h-5 text-blue-400" /> },
    { name: 'Backend Node.js Engineer', topic: 'Backend Node.js Engineer', icon: <Terminal className="w-5 h-5 text-blue-400" /> },
    { name: 'Data Structures & Algorithms', topic: 'Data Structures & Algorithms', icon: <Database className="w-5 h-5 text-blue-400" /> },
    { name: 'Python & AI Engineer', topic: 'Python & AI Engineer', icon: <Cpu className="w-5 h-5 text-blue-400" /> },
    { name: 'System Design Architect', topic: 'System Design Architect', icon: <Layers className="w-5 h-5 text-blue-400" /> },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('MERN Stack Developer');
    const [customTopic, setCustomTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(true);
    const [startLoading, setStartLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchInterviews(); }, []);

    const fetchInterviews = async () => {
        try {
            const { data } = await API.get('/interviews');
            setInterviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch interviews:', err);
            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInterview = async (id) => {
        try {
            await API.delete(`/interviews/${id}`);
            setInterviews((prev) => prev.filter((i) => i._id !== id));
        } catch (err) {
            console.error('Failed to delete interview:', err);
        }
    };

    const handleStartInterview = async () => {
        const finalTopic = (customTopic.trim() || selectedTopic).trim();
        if (!finalTopic) { setError('Please select or enter an interview topic'); return; }
        setStartLoading(true);
        setError('');
        try {
            const { data } = await API.post('/interviews/start', { topic: finalTopic, difficulty });
            navigate(`/interview/${data._id}`);
        } catch (err) {
            const errorData = err.response?.data;
            setError(typeof errorData === 'string' ? errorData : errorData?.message || 'Failed to start interview.');
        } finally {
            setStartLoading(false);
        }
    };

    const safeInterviews = Array.isArray(interviews) ? interviews : [];
    const totalScoreSum = safeInterviews.reduce((sum, i) => {
        const ansCnt = i.answers?.length || 0;
        const scoreSum = i.answers?.reduce((s, a) => s + (a.score || 0), 0) || 0;
        return sum + (ansCnt > 0 ? scoreSum / ansCnt : 0);
    }, 0);
    const avgScore = safeInterviews.length > 0 ? (Number(totalScoreSum) / safeInterviews.length).toFixed(1) : '0.0';

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <p className="text-xs text-slate-300 font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2a47] pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Welcome back, <span className="text-blue-400">{user?.name || 'Candidate'}</span> 👋
                    </h1>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Select a role track to launch your AI Technical Interview</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-[#0e192c] border border-[#1b2a47] px-4 py-2 rounded-xl self-start md:self-auto">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Total Interviews" value={safeInterviews.length} icon={<Trophy className="w-5 h-5 text-blue-400" />} />
                <StatCard title="Average Score" value={`${avgScore} / 10`} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
                <StatCard title="Questions Answered" value={safeInterviews.reduce((sum, i) => sum + (i.answers?.length || 0), 0)} icon={<Calendar className="w-5 h-5 text-blue-400" />} />
            </div>

            {/* Start Session Card */}
            <div className="bg-[#0e192c] border border-[#1b2a47] rounded-2xl p-6 sm:p-8">

                <div className="mb-6 pb-4 border-b border-[#1b2a47]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        Select Interview Track
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Choose a role or type a custom topic below</p>
                </div>

                {/* Preset Roles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {PRESET_ROLES.map((role) => {
                        const isSelected = selectedTopic === role.topic && !customTopic.trim();
                        return (
                            <button
                                key={role.name}
                                type="button"
                                onClick={() => { setSelectedTopic(role.topic); setCustomTopic(''); }}
                                className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition cursor-pointer ${
                                    isSelected
                                        ? 'bg-blue-500/15 border-blue-400 text-white shadow-sm'
                                        : 'bg-[#09101d] border-[#1b2a47] text-slate-300 hover:border-blue-500/40'
                                }`}
                            >
                                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-500/20' : 'bg-[#0e192c]'}`}>
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">{role.name}</h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Technical Track</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Custom Topic */}
                <div className="space-y-2 mb-6">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Or Type Custom Topic</label>
                    <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="e.g. GraphQL, Next.js, Kubernetes, Docker..."
                        className="w-full bg-[#09101d] border border-[#1b2a47] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-400 transition"
                    />
                </div>

                {/* Difficulty */}
                <div className="space-y-2 mb-6">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-3 max-w-md">
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                onClick={() => setDifficulty(diff)}
                                className={`py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                    difficulty === diff
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                                        : 'bg-[#09101d] border-[#1b2a47] text-slate-300 hover:bg-[#14233c]'
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs font-semibold mb-6">{error}</div>
                )}

                <button
                    onClick={handleStartInterview}
                    disabled={startLoading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {startLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating Questions...</span></>
                    ) : (
                        <><Play className="w-4 h-4 fill-white" /><span>Start Interview Session</span></>
                    )}
                </button>
            </div>

            {/* Past Interviews */}
            <PastInterviews
                interviews={safeInterviews}
                onViewDetails={(id) => navigate(`/results/${id}`)}
                onDelete={handleDeleteInterview}
            />
        </div>
    );
};

export default Dashboard;
