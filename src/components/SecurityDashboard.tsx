import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Shield, FileWarning, Search, Filter } from 'lucide-react';

interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  file: string;
  language: string;
  description: string;
  detectedAt: string;
}

const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'v1',
    severity: 'critical',
    title: 'Remote Code Execution (RCE)',
    file: '/var/lib/nixos/scripts/deploy.sh',
    language: 'Bash',
    description: 'Unsanitized input passed to eval() allows arbitrary command execution.',
    detectedAt: '10m ago'
  },
  {
    id: 'v2',
    severity: 'high',
    title: 'Hardcoded Credentials',
    file: '/etc/nixos/configuration.nix',
    language: 'Nix',
    description: 'Database password found in plain text in the configuration file.',
    detectedAt: '45m ago'
  },
  {
    id: 'v3',
    severity: 'medium',
    title: 'Insecure Direct Object Reference (IDOR)',
    file: 'api/handlers/user.go',
    language: 'Go',
    description: 'User ID in request parameters is not validated against session permissions.',
    detectedAt: '2h ago'
  },
  {
    id: 'v4',
    severity: 'low',
    title: 'Missing Security Headers',
    file: 'nginx.conf',
    language: 'Config',
    description: 'Strict-Transport-Security (HSTS) header is missing from server response.',
    detectedAt: '5h ago'
  },
  {
    id: 'v5',
    severity: 'critical',
    title: 'SQL Injection',
    file: 'src/db/queries.ts',
    language: 'TypeScript',
    description: 'Raw SQL query constructed using string concatenation with user input.',
    detectedAt: '1d ago'
  }
];

export function SecurityDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const criticalCount = MOCK_VULNERABILITIES.filter(v => v.severity === 'critical').length;
  const highCount = MOCK_VULNERABILITIES.filter(v => v.severity === 'high').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-500/10 rounded-md">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Security & Vulnerability Audit</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Automated Deep Scanning & Threat Detection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search threats..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-[#010409] border border-slate-200 dark:border-[#30363d] rounded-md text-xs text-slate-900 dark:text-[#c9d1d9] pl-8 pr-3 py-1.5 focus:outline-none focus:border-red-500/50 w-64"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] border border-slate-200 dark:border-[#30363d] px-3 py-1.5 rounded-md text-xs text-slate-900 dark:text-[#c9d1d9] transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-[#0d1117] border border-red-500/30 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-[11px] text-red-400 font-medium uppercase tracking-wider">Critical Threats</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-[#c9d1d9] mt-1">{criticalCount}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0d1117] border border-orange-500/30 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <div className="p-3 bg-orange-500/10 rounded-md border border-orange-500/20">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[11px] text-orange-400 font-medium uppercase tracking-wider">High Risk</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-[#c9d1d9] mt-1">{highCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-[#161b22] rounded-md border border-slate-200 dark:border-[#30363d]">
              <FileWarning className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-[#8b949e] font-medium uppercase tracking-wider">Files Audited</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-[#c9d1d9] mt-1">1.2M</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-[#161b22] rounded-md border border-slate-200 dark:border-[#30363d]">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-[#8b949e] font-medium uppercase tracking-wider">System Status</p>
              <p className="text-xl font-semibold text-emerald-400 mt-1">Governing</p>
            </div>
          </div>
        </div>

        {/* Vulnerability List */}
        <div className="border border-slate-200 dark:border-[#30363d] rounded-lg bg-white dark:bg-[#0d1117] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22]">
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Severity</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Vulnerability</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Target Asset</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Language / Type</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Detected</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VULNERABILITIES.map((vuln) => (
                <tr key={vuln.id} className="border-b border-slate-200 dark:border-[#30363d]/50 hover:bg-slate-100 dark:bg-[#161b22]/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider w-20
                      ${vuln.severity === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        vuln.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                        vuln.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-[#c9d1d9] group-hover:text-blue-400 transition-colors">{vuln.title}</span>
                      <span className="text-xs text-slate-500 dark:text-[#8b949e] line-clamp-1">{vuln.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileWarning className="w-3.5 h-3.5 text-slate-500 dark:text-[#8b949e]" />
                      <span className="text-xs font-mono text-slate-900 dark:text-[#c9d1d9] truncate max-w-[200px]">{vuln.file}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[11px] px-2 py-1 rounded bg-slate-200 dark:bg-[#21262d] text-slate-900 dark:text-[#c9d1d9] border border-slate-200 dark:border-[#30363d]">
                      {vuln.language}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-[#8b949e] whitespace-nowrap">
                    {vuln.detectedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
