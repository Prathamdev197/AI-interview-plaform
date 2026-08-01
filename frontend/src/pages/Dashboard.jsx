import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Calendar, Trophy, TrendingUp, Loader2, Code, Terminal, Globe, Database, Cpu, Layers } from 'lucide-react';
import API from '../api/axiosInstance';

import PastInterviews from '../components/PastInterviews';

const PRESET_ROLES = [
    { name: 'Full Stack MERN Developer', topic: 'MERN Stack Developer', icon: <Code className="w-4 h-4 text-[#1C1917]" /> },
    { name: 'Frontend React Engineer', topic: 'Frontend React Engineer', icon: <Globe className="w-4 h-4 text-[#1C1917]" /> },
    { name: 'Backend Node.js Engineer', topic: 'Backend Node.js Engineer', icon: <Terminal className="w-4 h-4 text-[#1C1917]" /> },
    { name: 'Data Structures & Algorithms', topic: 'Data Structures & Algorithms', icon: <Database className="w-4 h-4 text-[#1C1917]" /> },
    { name: 'Python & AI Engineer', topic: 'Python & AI Engineer', icon: <Cpu className="w-4 h-4 text-[#1C1917]" /> },
    { name: 'System Design Architect', topic: 'System Design Architect', icon: <Layers className="w-4 h-4 text-[#1C1917]" /> },
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
    const totalQuestionsAnswered = safeInterviews.reduce((sum, i) => sum + (i.answers?.length || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#FAFAF9]">
                <Loader2 className="w-6 h-6 animate-spin text-orange-600 mb-2" />
                <p className="text-xs text-[#78716C]">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5E4] pb-5 text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                        Welcome, {user?.name || 'Candidate'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-medium">Select a role track or custom topic to launch a session</p>
                </div>

                {/* Date Badge — Crisp Black Text */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1C1917] bg-white border border-[#D6D3D1] px-3.5 py-1.5 rounded-md self-start sm:self-auto font-mono shadow-xs">
                    <Calendar className="w-4 h-4 text-[#1C1917]" />
                    <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="bg-white border border-[#E7E5E4] rounded-lg px-6 py-4 flex flex-col sm:flex-row sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-[#E7E5E4] shadow-xs">
                <div className="flex-1 py-2 sm:py-0 sm:pr-6 flex items-center gap-3 text-left">
                    <Trophy className="w-4 h-4 text-[#1C1917] shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Total Sessions</p>
                        <p className="text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">{safeInterviews.length}</p>
                    </div>
                </div>

                <div className="flex-1 py-2 sm:py-0 sm:px-6 flex items-center gap-3 text-left">
                    <TrendingUp className="w-4 h-4 text-[#1C1917] shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Average Score</p>
                        <p className="text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">{avgScore} <span className="text-xs text-[#78716C] font-normal">/ 10</span></p>
                    </div>
                </div>

                <div className="flex-1 py-2 sm:py-0 sm:pl-6 flex items-center gap-3 text-left">
                    <Code className="w-4 h-4 text-[#1C1917] shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Questions Answered</p>
                        <p className="text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">{totalQuestionsAnswered}</p>
                    </div>
                </div>
            </div>

            {/* Start Session Section */}
            <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 sm:p-7 text-left space-y-6 shadow-xs">

                <div className="border-b border-[#E7E5E4] pb-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#1C1917]">Select Interview Track</h2>
                    <p className="text-xs sm:text-sm text-[#78716C] mt-0.5 font-medium">Choose a pre-configured role or type a custom topic below</p>
                </div>

                {/* Preset Roles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {PRESET_ROLES.map((role) => {
                        const isSelected = selectedTopic === role.topic && !customTopic.trim();
                        return (
                            <button
                                key={role.name}
                                type="button"
                                onClick={() => { setSelectedTopic(role.topic); setCustomTopic(''); }}
                                className={`flex items-center gap-3.5 p-3.5 rounded-md border text-left transition cursor-pointer ${
                                    isSelected
                                        ? 'bg-orange-50/50 border-orange-600 text-[#1C1917]'
                                        : 'bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] hover:border-stone-400'
                                }`}
                            >
                                <div className="p-2 rounded-md bg-white border border-[#E7E5E4] shrink-0">
                                    {role.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs sm:text-sm font-semibold truncate text-[#1C1917]">{role.name}</h3>
                                    <p className="text-[11px] text-[#78716C] font-medium mt-0.5">Technical Track</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Custom Topic Input */}
                <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#78716C]">Or Custom Technical Topic</label>
                    <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="e.g. GraphQL, Next.js, System Architecture..."
                        className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-md px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1C1917] outline-none focus:border-orange-600 transition"
                    />
                </div>

                {/* Difficulty Selector */}
                <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#78716C]">Difficulty Level</label>
                    <div className="flex gap-2.5 max-w-xs">
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                onClick={() => setDifficulty(diff)}
                                className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                                    difficulty === diff
                                        ? 'bg-orange-600 border-orange-600 text-white'
                                        : 'bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] hover:bg-stone-100'
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-md p-3.5 text-xs sm:text-sm font-semibold">{error}</div>
                )}

                <button
                    onClick={handleStartInterview}
                    disabled={startLoading}
                    className="w-full sm:w-auto px-7 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm rounded-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                    {startLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating Questions...</span></>
                    ) : (
                        <><Play className="w-4 h-4 fill-white" /><span>Start Interview Session</span></>
                    )}
                </button>
            </div>

            {/* Past Interviews List */}
            <PastInterviews
                interviews={safeInterviews}
                onViewDetails={(id) => navigate(`/results/${id}`)}
                onDelete={handleDeleteInterview}
            />
        </div>
    );
};

export default Dashboard;
