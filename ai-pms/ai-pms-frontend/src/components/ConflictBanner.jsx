import React from 'react';
import { motion } from 'framer-motion';
import { TriangleAlert, Info, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const ConflictBanner = ({ conflicts }) => {
  const hasConflicts = conflicts && conflicts.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white/5 border backdrop-blur-2xl p-6 rounded-[2rem] flex flex-col gap-4 relative overflow-hidden",
          hasConflicts ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"
        )}
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          {hasConflicts ? <TriangleAlert size={100} className="text-red-500" /> : <ShieldCheck size={100} className="text-emerald-500" />}
        </div>

        <div className={cn(
          "flex items-center gap-3 font-bold text-lg relative z-10",
          hasConflicts ? "text-red-400" : "text-emerald-400"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center",
            hasConflicts ? "bg-red-500/20" : "bg-emerald-500/20"
          )}>
            {hasConflicts ? <TriangleAlert size={20} /> : <ShieldCheck size={20} />}
          </div>
          <span>{hasConflicts ? "Conflict Intelligence Detected" : "No Conflicts Detected"}</span>
        </div>
        
        <div className="flex flex-col gap-3 relative z-10">
          {hasConflicts ? (
            conflicts.map((conflict, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="mt-1 text-red-500 group-hover:scale-110 transition-transform">
                  <Info size={18} />
                </div>
                <div>
                  <div className="font-bold text-white text-md tracking-tight mb-1">{conflict.task}</div>
                  <div className="text-white/60 text-sm leading-relaxed">{conflict.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 text-sm italic">
              Neutral core active. No logical contradictions found in the provided context.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConflictBanner;
