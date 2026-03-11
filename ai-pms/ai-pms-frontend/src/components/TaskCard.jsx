import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, ShieldCheck, Zap, Activity } from 'lucide-react';

const TaskCard = ({ task, index }) => {
  const getPriorityConfig = (p) => {
    if (p >= 8) return { 
      bg: 'bg-red-500/10', 
      text: 'text-red-400', 
      border: 'border-red-500/20',
      icon: <Zap size={14} />,
      label: 'Critical'
    };
    if (p >= 5) return { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      border: 'border-amber-500/20',
      icon: <Activity size={14} />,
      label: 'High'
    };
    return { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20',
      icon: <ShieldCheck size={14} />,
      label: 'Standard'
    };
  };

  const config = getPriorityConfig(task.priority);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05 }}
      className="premium-glass p-7 rounded-[2rem] flex flex-col gap-6 group relative overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
      
      <div className="flex justify-between items-start">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} border`}>
          {config.icon}
          {config.label}
        </div>
        <div className="text-white/20 font-black text-2xl select-none">
          {task.priority}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
          {task.task}
        </h3>
      </div>

      <div className="pt-4 mt-auto border-t border-white/5 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <User size={14} className="text-blue-400" />
          <span className="text-sm font-medium text-white/70">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <Calendar size={14} className="text-blue-400" />
          <span className="text-sm font-medium text-white/70">{task.deadline}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
