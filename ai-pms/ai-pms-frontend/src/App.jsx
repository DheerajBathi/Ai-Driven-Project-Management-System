import React, { useState, useRef, useEffect } from 'react';
import TranscriptInput from './components/TranscriptInput';
import TaskCard from './components/TaskCard';
import ConflictBanner from './components/ConflictBanner';
import HistorySidebar from './components/HistorySidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Terminal, Github, Filter, Sparkles, History } from 'lucide-react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const resultsRef = useRef(null);

  // Load history from localStorage on mounting
  useEffect(() => {
    const saved = localStorage.getItem('ai_pms_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai_pms_history', JSON.stringify(history));
  }, [history]);

  const analyzeTranscript = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
        throw new Error('Intelligence engine connection failed');
      }

      const result = await response.json();
      setData(result);
      setActiveFilter('All');

      // Add to history
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        transcript: transcript,
        result: result
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 20)); // Keep last 20

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry) => {
    setTranscript(entry.transcript);
    setData(entry.result);
    setActiveFilter('All');
    setShowHistory(false);
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  const allTasks = data?.tasks || [];

  const filteredTasks = allTasks.filter(task => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Standard') return task.priority >= 1 && task.priority <= 4;
    if (activeFilter === 'High') return task.priority >= 5 && task.priority <= 7;
    if (activeFilter === 'Critical') return task.priority >= 8 && task.priority <= 10;
    return true;
  });

  const filterOptions = [
    { name: 'All', count: allTasks.length },
    { name: 'Critical', count: allTasks.filter(t => t.priority >= 8).length },
    { name: 'High', count: allTasks.filter(t => t.priority >= 5 && t.priority <= 7).length },
    { name: 'Standard', count: allTasks.filter(t => t.priority <= 4).length },
  ];

  return (
    <div className="min-h-screen px-4 pb-20 pt-10 text-white">
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">AI-PMS <span className="text-blue-400">OS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
          >
            <History size={16} />
            History
          </button>
          <a href="https://github.com/DheerajBathi/Ai-Driven-Project-Management-System.git" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
            <Github size={18} />
          </a>
        </div>
      </nav>

      <HistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelect={loadFromHistory}
        onDelete={removeFromHistory}
      />

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto mb-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Terminal size={12} />
          Next-Gen Context-Aware Orchestrator
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none"
        >
          Smarter Tasks. <br />
          <span className="text-gradient">Zero Noise.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Transform raw meeting dialogue into structured technical roadmaps with autonomous conflict detection.
        </motion.p>
      </header>

      <TranscriptInput
        value={transcript}
        onChange={setTranscript}
        onAnalyze={analyzeTranscript}
        isLoading={loading}
      />

      <div className="max-w-7xl mx-auto mt-20" ref={resultsRef}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium flex items-center justify-center gap-3 mb-12 backdrop-blur-xl"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {data && (
            <div className="space-y-12">
              <ConflictBanner conflicts={data.conflicts} />

              <div className="px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                      Extracted Roadmap
                    </h2>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-400" />
                      Neural Extraction Results
                    </p>
                  </div>

                  {/* Filter UI */}
                  <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    {filterOptions.filter(opt => opt.count > 0 || opt.name === 'All').map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => setActiveFilter(opt.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === opt.name
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                          }`}
                      >
                        {opt.name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeFilter === opt.name ? 'bg-black/10 text-black' : 'bg-white/10 text-white/40'
                          }`}>
                          {opt.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, idx) => (
                        <TaskCard key={`${task.task}-${idx}`} task={task} index={idx} />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"
                      >
                        <p className="text-white/30 italic">No tasks match the selected filter.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {data && data.tasks?.length === 0 && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                <LayoutDashboard className="text-white/20" />
              </div>
              <p className="text-white/30 font-medium italic">
                Ready for analysis. Neural core idle.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
