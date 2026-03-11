import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const HistorySidebar = ({ isOpen, onClose, history, onSelect, onDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs md:max-w-md premium-glass border-l border-white/10 z-[60] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <History className="text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Analysis History</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Local Persistence</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-30">
                  <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
                    <History size={32} />
                  </div>
                  <p className="text-sm font-medium italic">No history found. Start an analysis to see your journey here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                      onClick={() => onSelect(entry)}
                    >
                      <div className="mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={12} className="text-white/30" />
                          <span className="text-[10px] text-white/40 font-bold">{entry.timestamp}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white/80 truncate mb-1 pr-8">
                          {entry.transcript.split('\n')[0].replace('### SOURCE: ', '') || 'Untitled Analysis'}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-white/30 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {entry.result?.tasks?.length || 0} Tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {entry.result?.conflicts?.length || 0} Conflicts
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(entry.id);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="absolute bottom-4 right-4 text-white/10 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/20 text-center">
              <p className="text-[10px] text-white/20 font-medium flex items-center justify-center gap-2">
                <CheckCircle2 size={12} />
                Stored locally on your device
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistorySidebar;
