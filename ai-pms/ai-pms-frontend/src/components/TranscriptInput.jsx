import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Sparkles, Paperclip, FileText, X } from 'lucide-react';
import { NoiseBackground } from './ui/noise-background';
import { cn } from '../lib/utils';

const TranscriptInput = ({ value, onChange, onAnalyze, isLoading }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]); // Array of { name, content }

  const updateCombinedTranscript = (newFiles) => {
    // Merge all files with clear source markers
    const combined = newFiles.map(f => `### SOURCE: ${f.name}\n${f.content}`).join('\n\n---\n\n');
    onChange(combined);
  };

  const processFile = async (file) => {
    return new Promise((resolve) => {
      const allowedExtensions = ['txt', 'md', 'csv'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        alert(`Invalid file type: ${file.name}. Please upload .txt, .md, or .csv.`);
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        let text = event.target.result;
        
        // Noise Reduction for CSV - Shared with original logic
        if (extension === 'csv') {
          const lines = text.split('\n');
          if (lines.length > 5) {
            const header = lines[0].toLowerCase().split(',');
            const wbsIdx = header.findIndex(h => h.includes('wbs'));
            const statusIdx = header.findIndex(h => h.includes('status'));
            const taskIdx = header.findIndex(h => h.includes('task') || h.includes('name'));
            const assigneeIdx = header.findIndex(h => h.includes('resource') || h.includes('assignee') || h.includes('owner'));
            const deadlineIdx = header.findIndex(h => h.includes('deadline') || h.includes('finish') || h.includes('date'));
            const priorityIdx = header.findIndex(h => h.includes('priority') || h.includes('duration'));

            if (taskIdx !== -1) {
              const cleanedLines = lines.map(line => {
                const parts = line.split(',');
                const wbs = wbsIdx !== -1 ? parts[wbsIdx]?.trim() : '';
                const status = statusIdx !== -1 ? parts[statusIdx]?.trim() : '';
                const task = parts[taskIdx]?.trim() || '';
                
                if (!task || task.toLowerCase().includes('task_name')) return null;
                if (status?.toLowerCase() === 'completed') return null;
                if (wbs && wbs.split('.').length < 3) return null;

                const assignee = assigneeIdx !== -1 ? parts[assigneeIdx]?.trim() : '';
                const deadline = deadlineIdx !== -1 ? parts[deadlineIdx]?.trim() : '';
                const priority = priorityIdx !== -1 ? parts[priorityIdx]?.trim() : '';
                
                return `T:${task}${assignee ? `,A:${assignee}` : ''}${deadline ? `,D:${deadline}` : ''}${priority ? `,Info:${priority}` : ''}`;
              }).filter(Boolean);
              
              text = cleanedLines.slice(0, 40).join('\n');
            }
          }
        }
        resolve({ name: file.name, content: text });
      };
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const processed = await Promise.all(selectedFiles.map(processFile));
    const valid = processed.filter(Boolean);
    
    // Merge only unique new files
    const newFiles = [...files];
    valid.forEach(v => {
      if (!newFiles.some(f => f.name === v.name)) {
        newFiles.push(v);
      }
    });

    setFiles(newFiles);
    updateCombinedTranscript(newFiles);
    
    // Reset input so the same file can be uploaded again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAll = () => {
    setFiles([]);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 mt-8">
      <div className="premium-glass p-8 rounded-3xl relative overflow-hidden group">
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Sparkles size={16} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white/90 tracking-tight">Meeting Intelligence</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 max-w-md justify-end">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.8, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 10 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <FileText size={12} />
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <button 
                        onClick={() => removeFile(file.name)}
                        className="hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/10"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.md,.csv"
                multiple
                onChange={handleFileChange}
              />
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium whitespace-nowrap"
                >
                  <Paperclip size={16} />
                  <span>Add Files</span>
                </motion.button>

                {(files.length > 0 || value.trim() !== '') && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all text-sm font-medium whitespace-nowrap"
                  >
                    <X size={16} />
                    <span>Reset</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              className="w-full h-56 bg-black/20 border border-white/5 rounded-2xl p-5 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-inner"
              placeholder="Paste context here or upload multiple meeting files..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center mt-2">
            <NoiseBackground
              containerClassName="w-fit p-1.5 rounded-full mx-auto"
              gradientColors={[
                "rgb(59, 130, 246)",
                "rgb(147, 51, 234)",
                "rgb(37, 99, 235)",
              ]}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAnalyze}
                disabled={isLoading || !value.trim()}
                className={cn(
                  "h-full w-full cursor-pointer rounded-full px-12 py-4 text-white font-bold transition-all duration-100",
                  isLoading || !value.trim()
                    ? "bg-neutral-800 text-white/30 cursor-not-allowed"
                    : "bg-black/80 hover:bg-black/60 shadow-[0px_1px_0px_0px_var(--color-neutral-800)_inset]"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Batch...</span>
                  </div>
                ) : (
                  <>
                    Analyze All Context <span className="ml-2">&rarr;</span>
                  </>
                )}
              </motion.button>
            </NoiseBackground>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptInput;
