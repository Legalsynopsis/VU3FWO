import React, { useState } from 'react';
import { Client } from '../types';
import { Users, Server, Zap, Search, Plus, Filter, ShieldCheck, PlayCircle, Settings2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Alpha Corp Legal', status: 'governing', environment: 'NixOS Cluster A', lastSync: '2m ago', filesProcessed: 145920 },
  { id: 'c2', name: 'Beta Analytics', status: 'active', environment: 'AWS us-east-1', lastSync: '15m ago', filesProcessed: 8940 },
  { id: 'c3', name: 'Gamma Security', status: 'active', environment: 'On-Prem VM', lastSync: '1h ago', filesProcessed: 430 },
  { id: 'c4', name: 'Delta Processing', status: 'inactive', environment: 'Azure West', lastSync: '2d ago', filesProcessed: 12044 },
];

export function ClientsModule() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('legalsynopsis_clients_search', '');

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Module Header */}
      <div className="h-14 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-md">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Clients Module</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Phase 3 Point 6 Implementation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-[#010409] border border-slate-200 dark:border-[#30363d] rounded-md text-xs text-slate-900 dark:text-[#c9d1d9] pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] border border-slate-200 dark:border-[#30363d] px-3 py-1.5 rounded-md text-xs text-slate-900 dark:text-[#c9d1d9] transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 px-3 py-1.5 rounded-md text-xs text-emerald-400 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Client
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Clients" value={MOCK_CLIENTS.length.toString()} icon={<Server className="w-4 h-4 text-blue-400" />} />
          <StatCard title="Actively Governing" value="1" icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} />
          <StatCard title="Files Processed" value="167.3K" icon={<Zap className="w-4 h-4 text-amber-400" />} />
          <StatCard title="Global Environments" value="4" icon={<Server className="w-4 h-4 text-indigo-400" />} />
        </div>

        <div className="border border-slate-200 dark:border-[#30363d] rounded-lg bg-white dark:bg-[#0d1117] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22]">
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Client Name</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Status</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Environment</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Files Processed</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">Last Sync</th>
                <th className="py-3 px-4 text-xs font-medium text-slate-500 dark:text-[#8b949e] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-slate-200 dark:border-[#30363d]/50 hover:bg-slate-100 dark:bg-[#161b22]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200 dark:bg-[#21262d] flex items-center justify-center text-xs font-bold text-slate-900 dark:text-[#c9d1d9]">
                        {client.name.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-900 dark:text-[#c9d1d9]">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border
                      ${client.status === 'governing' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        client.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        'bg-slate-200 dark:bg-[#21262d] text-slate-500 dark:text-[#8b949e] border-slate-200 dark:border-[#30363d]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'governing' ? 'bg-emerald-400' : client.status === 'active' ? 'bg-blue-400' : 'bg-[#8b949e]'}`} />
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-[#8b949e]">{client.environment}</td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-900 dark:text-[#c9d1d9]">{client.filesProcessed.toLocaleString()}</td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-[#8b949e]">{client.lastSync}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:text-[#c9d1d9] transition-colors p-1">
                      <Settings2 className="w-4 h-4" />
                    </button>
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

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 flex items-center gap-4">
      <div className="p-3 bg-slate-100 dark:bg-[#161b22] rounded-md border border-slate-200 dark:border-[#30363d]">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 dark:text-[#8b949e] font-medium uppercase tracking-wider">{title}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-[#c9d1d9] mt-1">{value}</p>
      </div>
    </div>
  );
}
