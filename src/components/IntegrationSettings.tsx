import React, { useEffect, useState } from 'react';
import { Github, Link as LinkIcon, ShieldCheck, RefreshCcw, Save, FolderGit2, CheckCircle2 } from 'lucide-react';

export function IntegrationSettings() {
  const [githubConnected, setGithubConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('legalsynopsis/governance-rules');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('10 minutes ago');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'github') {
        setGithubConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGithub = async () => {
    try {
      const response = await fetch('/api/auth/github/url');
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your GitHub account.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9] flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub Integration
        </h2>
        {githubConnected && (
          <span className="text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </span>
        )}
      </div>

      {!githubConnected ? (
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-6 leading-relaxed">
            Connect your GitHub account (legalsynopsismail@protonmail.com) to synchronize workflows, fetch repository configurations, and enable automated PR governance directly from the LegalSynopsis engine.
          </p>
          
          <button 
            onClick={handleConnectGithub}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] border border-slate-200 dark:border-[#30363d] text-slate-900 dark:text-[#c9d1d9] px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-auto"
          >
            <LinkIcon className="w-4 h-4" />
            Connect GitHub
          </button>
          
          <div className="mt-4 p-3 bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-md">
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">
              <strong>Required Scopes:</strong> <span className="font-mono text-slate-900 dark:text-[#c9d1d9]">user:email, repo</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-5 animate-in fade-in duration-300">
          
          {/* Target Repository Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Target Repository</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#010409] border border-slate-200 dark:border-[#30363d] rounded-lg p-2 px-3">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              <input 
                type="text" 
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="bg-transparent text-sm text-slate-900 dark:text-[#c9d1d9] outline-none flex-1 font-mono"
                placeholder="org/repo-name"
              />
            </div>
          </div>

          {/* Sync & Backup Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-[#c9d1d9] flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-slate-500 dark:text-[#8b949e]" />
                  Real-time Configuration Sync
                </p>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Automatically pull governance rule updates.</p>
              </div>
              <button 
                onClick={() => setSyncEnabled(!syncEnabled)}
                className={`w-10 h-5 rounded-full relative transition-colors ${syncEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d]'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${syncEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-[#c9d1d9] flex items-center gap-2">
                  <Save className="w-4 h-4 text-slate-500 dark:text-[#8b949e]" />
                  Automated Branch Backups
                </p>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Commit abstractive synopses on schedule.</p>
              </div>
              <button 
                onClick={() => setBackupEnabled(!backupEnabled)}
                className={`w-10 h-5 rounded-full relative transition-colors ${backupEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d]'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${backupEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Manual Sync Trigger */}
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#30363d] flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-[#8b949e]">Last synced: {lastSync}</span>
            <button 
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] text-slate-900 dark:text-[#c9d1d9] text-xs font-medium rounded-md border border-slate-200 dark:border-[#30363d] transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}
