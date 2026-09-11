import React, { useState, useEffect, useRef } from 'react';
import { Search, FolderTree, Activity, Settings, ShieldAlert, FileCode2, Terminal, X, Command, Binary, Bot } from 'lucide-react';
import { Module } from '../types';

interface SearchResult {
  id: string;
  title: string;
  type: 'file' | 'workflow' | 'setting' | 'client' | 'security';
  description?: string;
  icon: React.ElementType;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModule: (module: Module) => void;
}

export function CommandPalette({ isOpen, onClose, setActiveModule }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close on Escape, handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      
      if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        results[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems: SearchResult[] = [
    { id: '1', title: 'Open Workflow Engine', type: 'workflow', icon: Activity, description: 'Manage n8n automated governing flows', action: () => { setActiveModule('workflow'); onClose(); } },
    { id: '1b', title: 'NLP Synopsis Engine', type: 'workflow', icon: FileCode2, description: 'Legal document summarisation & governance', action: () => { setActiveModule('synopsis'); onClose(); } },
    { id: '1c', title: 'Logic Extractor (Reverse Engineering)', type: 'workflow', icon: Binary, description: 'Decompile & synthesize rule models', action: () => { setActiveModule('reverse'); onClose(); } },
    { id: '1d', title: 'Flowise Studio (LLM Flows)', type: 'workflow', icon: Bot, description: 'Visual Builder for Langchain AI workflows', action: () => { setActiveModule('flowise' as any); onClose(); } },
    { id: '2', title: 'Security & Vulnerability Audit', type: 'security', icon: ShieldAlert, description: 'View active threats and critical risks', action: () => { setActiveModule('security'); onClose(); } },
    { id: '3', title: 'System Health & Telemetry', type: 'setting', icon: Terminal, description: 'View D3 storage maps and CPU usage', action: () => { setActiveModule('health'); onClose(); } },
    { id: '3b', title: 'Setup & Settings (GitHub, PWA)', type: 'setting', icon: Settings, description: 'Manage global configuration', action: () => { setActiveModule('settings' as any); onClose(); } },
    { id: '4', title: 'Client Governance List', type: 'client', icon: FolderTree, description: 'Manage connected environments', action: () => { setActiveModule('clients'); onClose(); } },
    { id: '5', title: '/etc/nixos/configuration.nix', type: 'file', icon: FileCode2, description: 'NixOS Core Configuration File', action: () => { setActiveModule('scanner'); onClose(); } },
    { id: '6', title: '/var/lib/docker/volumes', type: 'file', icon: FolderTree, description: 'Container storage blocks', action: () => { setActiveModule('scanner'); onClose(); } },
    { id: '7', title: 'Global Theme Settings', type: 'setting', icon: Settings, description: 'Adjust UI contrast and layout', action: () => onClose() },
  ];

  const results = query === '' 
    ? allItems 
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22]">
          <Search className="w-5 h-5 text-slate-500 dark:text-[#8b949e] mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-slate-900 dark:text-[#c9d1d9] text-base focus:outline-none placeholder:text-slate-500 dark:text-[#8b949e]"
            placeholder="Search commands, files, or environments..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-1.5 ml-3">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-[#8b949e]">
              <Command className="w-3 h-3" /> K
            </kbd>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-300 dark:bg-[#30363d] rounded-md text-slate-500 dark:text-[#8b949e] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-14 text-center text-slate-500 dark:text-[#8b949e]">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                {query ? 'Search Results' : 'Suggested Actions'}
              </div>
              {results.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left
                      ${isSelected ? 'bg-blue-500/10 border-blue-500/30' : 'hover:bg-slate-100 dark:bg-[#161b22] border-transparent'} border`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md border 
                        ${isSelected ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-slate-200 dark:bg-[#21262d] border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-[#8b949e]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-slate-900 dark:text-[#c9d1d9]'}`}>
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-xs text-slate-500 dark:text-[#8b949e]">{item.description}</span>
                        )}
                      </div>
                    </div>
                    
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-[#8b949e] bg-slate-200 dark:bg-[#21262d] px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2 px-4 flex items-center gap-4 text-[10px] text-slate-500 dark:text-[#8b949e]">
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded px-1.5 py-0.5 font-mono">↑↓</kbd> to navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded px-1.5 py-0.5 font-mono">↵</kbd> to select</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded px-1.5 py-0.5 font-mono">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
