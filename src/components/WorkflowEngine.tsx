import React, { useState, useEffect } from 'react';
import { Play, Settings, Database, Activity, FileKey2, CircuitBoard, Clock, CheckCircle2, XCircle, Loader2, ArrowUpDown } from 'lucide-react';
import { NodeItem } from '../types';

const MOCK_NODES: NodeItem[] = [
  { id: 'n1', type: 'trigger', label: 'Document Upload (PDF/DOCX)', x: 50, y: 150, status: 'success' },
  { id: 'n2', type: 'action', label: 'Pre-processing (pdfminer + OCR)', x: 300, y: 150, status: 'success' },
  { id: 'n3', type: 'format-analyzer', label: 'Ontology Map (LegalMD)', x: 550, y: 150, status: 'success' },
  { id: 'n4', type: 'action', label: 'Extractive NLP (DELSumm)', x: 800, y: 50, status: 'running' },
  { id: 'n5', type: 'action', label: 'Abstractive Polish (BART)', x: 800, y: 250, status: 'idle' },
  { id: 'n6', type: 'condition', label: 'Governance Sync (Eramba)', x: 1050, y: 150, status: 'idle' },
];

type Priority = 'low' | 'medium' | 'high' | 'critical';

interface LogEntry {
  id: string;
  task: string;
  status: 'success' | 'running' | 'error' | 'pending';
  timestamp: string;
  duration?: string;
  priority: Priority;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', task: 'Document Upload (PDF/DOCX)', status: 'success', timestamp: new Date(Date.now() - 5000).toLocaleTimeString(), duration: '45ms', priority: 'high' },
  { id: 'l2', task: 'Pre-processing (pdfminer + OCR)', status: 'success', timestamp: new Date(Date.now() - 4000).toLocaleTimeString(), duration: '120ms', priority: 'medium' },
  { id: 'l3', task: 'Ontology Map (LegalMD)', status: 'success', timestamp: new Date(Date.now() - 3000).toLocaleTimeString(), duration: '180ms', priority: 'high' },
  { id: 'l4', task: 'Extractive NLP (DELSumm)', status: 'running', timestamp: new Date(Date.now() - 2000).toLocaleTimeString(), duration: '...', priority: 'critical' },
];

const PRIORITY_WEIGHTS = { critical: 4, high: 3, medium: 2, low: 1 };

export function WorkflowEngine() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [sortByPriority, setSortByPriority] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const lastLog = prev[prev.length - 1];
        if (lastLog && lastLog.status === 'running') {
          const updatedLogs = [...prev];
          updatedLogs[updatedLogs.length - 1] = { ...lastLog, status: 'success', duration: '2.4s' };
          
          const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
          const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
          
          updatedLogs.push({
            id: `l${Date.now()}`,
            task: 'Governance Sync (Eramba)',
            status: 'running',
            timestamp: new Date().toLocaleTimeString(),
            duration: '...',
            priority: randomPriority
          });
          return updatedLogs;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updatePriority = (id: string, newPriority: Priority) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, priority: newPriority } : log));
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortByPriority) {
      const diff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      if (diff !== 0) return diff;
    }
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] relative overflow-hidden">
      {/* Header */}
      <div className="h-14 z-10 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-500/10 rounded-md">
            <CircuitBoard className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Automated Governing Setup</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Global Automation Engine (n8n architecture)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-md text-xs text-white font-medium transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Play className="w-3.5 h-3.5 fill-current" />
            Execute Governing Flow
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Grid Canvas */}
        <div className="flex-1 relative bg-grid-pattern" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          
          {/* Connection Lines (Mocked SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 230 200 L 300 200" stroke="#30363d" strokeWidth="2" fill="none" />
            <path d="M 480 200 L 550 200" stroke="#30363d" strokeWidth="2" fill="none" />
            <path d="M 730 200 L 765 200 L 765 100 L 800 100" stroke="#30363d" strokeWidth="2" fill="none" />
            <path d="M 730 200 L 765 200 L 765 300 L 800 300" stroke="#30363d" strokeWidth="2" fill="none" />
            <path d="M 980 100 L 1015 100 L 1015 200 L 1050 200" stroke="#30363d" strokeWidth="2" fill="none" />
            <path d="M 980 300 L 1015 300 L 1015 200 L 1050 200" stroke="#30363d" strokeWidth="2" fill="none" />
          </svg>

          {/* Nodes */}
          {MOCK_NODES.map(node => (
            <div 
              key={node.id}
              className="absolute rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] shadow-xl w-[180px] cursor-grab active:cursor-grabbing hover:border-[#8b949e] transition-colors"
              style={{ left: node.x, top: node.y }}
            >
              <div className={`h-1.5 w-full rounded-t-lg ${
                node.type === 'trigger' ? 'bg-amber-500' : 
                node.type === 'action' ? 'bg-blue-500' : 
                node.type === 'condition' ? 'bg-purple-500' : 'bg-emerald-500'
              }`} />
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 bg-slate-100 dark:bg-[#161b22] rounded border border-slate-200 dark:border-[#30363d]">
                    {node.type === 'trigger' ? <Activity className="w-3.5 h-3.5 text-amber-400" /> :
                     node.type === 'action' ? <Database className="w-3.5 h-3.5 text-blue-400" /> :
                     node.type === 'condition' ? <Settings className="w-3.5 h-3.5 text-purple-400" /> :
                     <FileKey2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  {node.status === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />}
                  {node.status === 'running' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6] animate-pulse" />}
                </div>
                <h3 className="text-[11px] font-medium text-slate-900 dark:text-[#c9d1d9] leading-tight">{node.label}</h3>
                <p className="text-[9px] text-slate-500 dark:text-[#8b949e] mt-1 capitalize">{node.type}</p>
              </div>
              
              {/* Connection points */}
              {node.type !== 'trigger' && <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-[#30363d] border border-[#0d1117]" />}
              {node.type !== 'action' && <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-[#30363d] border border-[#0d1117]" />}
              {node.type === 'condition' && <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-[#30363d] border border-[#0d1117]" />}
            </div>
          ))}
        </div>

        {/* Activity Logs Panel */}
        <div className="w-80 border-l border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 dark:text-[#8b949e]" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-[#c9d1d9] uppercase tracking-wider">Activity Logs</h2>
            </div>
            <button 
              onClick={() => setSortByPriority(!sortByPriority)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold transition-colors border
                ${sortByPriority ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-200 dark:bg-[#21262d] text-slate-500 dark:text-[#8b949e] border-slate-200 dark:border-[#30363d] hover:text-slate-900 dark:text-[#c9d1d9]'}`}
              title="Toggle Sort by Priority"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortByPriority ? 'Priority' : 'Time'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {sortedLogs.map((log) => (
              <div key={log.id} className="bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-3 transition-all duration-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {log.status === 'running' && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                    {log.status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                    <span className="text-[11px] font-medium text-slate-900 dark:text-[#c9d1d9]">{log.task}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 dark:text-[#8b949e]">{log.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider
                      ${log.status === 'success' ? 'text-emerald-500' : 
                        log.status === 'running' ? 'text-blue-500' : 'text-red-500'}`}>
                      {log.status}
                    </span>
                    <span className="text-[#30363d] text-[10px]">|</span>
                    <select 
                      value={log.priority}
                      onChange={(e) => updatePriority(log.id, e.target.value as Priority)}
                      className={`text-[9px] font-bold uppercase tracking-wider bg-transparent outline-none cursor-pointer appearance-none
                        ${log.priority === 'critical' ? 'text-red-500' :
                          log.priority === 'high' ? 'text-orange-500' :
                          log.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                        }`}
                    >
                      <option value="low" className="bg-slate-100 dark:bg-[#161b22] text-blue-500">Low</option>
                      <option value="medium" className="bg-slate-100 dark:bg-[#161b22] text-amber-500">Medium</option>
                      <option value="high" className="bg-slate-100 dark:bg-[#161b22] text-orange-500">High</option>
                      <option value="critical" className="bg-slate-100 dark:bg-[#161b22] text-red-500">Critical</option>
                    </select>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-[#8b949e]">{log.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
