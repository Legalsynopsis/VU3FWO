import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Server, ShieldCheck, Download, Trash2, Sparkles, CheckSquare, Square, Loader2, PieChart, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DiskHeatmap } from './DiskHeatmap';
import { useLocalStorage } from '../hooks/useLocalStorage';

const generateInitialData = () => {
  const data = [];
  const now = new Date().getTime();
  for (let i = 30; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 2000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      cpu: Math.floor(Math.random() * 30) + 20,
      ram: Math.floor(Math.random() * 20) + 50,
      disk: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
};

interface CleanupItem {
  id: string;
  path: string;
  size: string;
  sizeBytes: number;
  type: string;
}

const INITIAL_CLEANUP_ITEMS: CleanupItem[] = [
  { id: 'c1', path: '/tmp/nix-build-python3-3.11.tar.gz', size: '1.2 GB', sizeBytes: 1200000000, type: 'Orphaned Build' },
  { id: 'c2', path: '~/.npm/_cacache', size: '850 MB', sizeBytes: 850000000, type: 'Package Cache' },
  { id: 'c3', path: '/var/log/journal (Archived)', size: '4.5 GB', sizeBytes: 4500000000, type: 'System Logs' },
  { id: 'c4', path: '/var/cache/apt/archives', size: '320 MB', sizeBytes: 320000000, type: 'Package Cache' },
];

export function SystemHealth() {
  const [data, setData] = useState(generateInitialData());
  const [cleanupItems, setCleanupItems] = useState<CleanupItem[]>(INITIAL_CLEANUP_ITEMS);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(INITIAL_CLEANUP_ITEMS.map(i => i.id)));
  const [isCleaning, setIsCleaning] = useState(false);
  
  // Alert Threshold State
  const [cpuThreshold, setCpuThreshold] = useLocalStorage<number>('legalsynopsis_cpu_alert_threshold', 85);
  const [ramThreshold, setRamThreshold] = useLocalStorage<number>('legalsynopsis_ram_alert_threshold', 80);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const last = newData[newData.length - 1];
        
        // Occasionally spike data to demonstrate threshold crossing if not already high
        const cpuSpike = Math.random() > 0.9 ? 40 : 0;
        const ramSpike = Math.random() > 0.9 ? 30 : 0;

        newData.push({
          time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          cpu: Math.min(100, Math.max(5, last.cpu + (Math.random() * 20 - 10) + cpuSpike)),
          ram: Math.min(100, Math.max(10, last.ram + (Math.random() * 10 - 5) + ramSpike)),
          disk: Math.max(10, last.disk + (Math.random() * 60 - 30)),
        });
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] p-3 rounded-lg shadow-xl z-50">
          <p className="text-slate-500 dark:text-[#8b949e] text-xs mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}{entry.name === 'Disk I/O' ? ' MB/s' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDownloadReport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-health-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const handleClean = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setCleanupItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setIsCleaning(false);
    }, 1500);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSelectedBytes = cleanupItems.filter(i => selectedItems.has(i.id)).reduce((acc, curr) => acc + curr.sizeBytes, 0);
  
  const currentCpu = data[data.length - 1].cpu;
  const currentRam = data[data.length - 1].ram;
  const isCpuAlert = currentCpu >= cpuThreshold;
  const isRamAlert = currentRam >= ramThreshold;
  const isSystemAlert = isCpuAlert || isRamAlert;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Module Header */}
      <div className="h-14 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-md">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">System Health & Telemetry</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Real-time Deep Visibility (NixOS / Global)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-[#c9d1d9] bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] px-3 py-1.5 rounded border border-slate-200 dark:border-[#30363d] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
          
          {isSystemAlert ? (
             <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-500/10 px-2 py-1.5 rounded border border-red-500/20 animate-pulse">
               <AlertTriangle className="w-3.5 h-3.5" />
               Threshold Exceeded
             </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1.5 rounded border border-emerald-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              System Secure
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
          
          {/* CPU Chart */}
          <div className={`bg-white dark:bg-[#0d1117] border rounded-xl p-5 flex flex-col transition-colors duration-300 ${isCpuAlert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-200 dark:border-[#30363d]'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
                <Cpu className={`w-5 h-5 ${isCpuAlert ? 'text-red-500' : 'text-blue-400'}`} />
                <h2 className="font-semibold text-sm">CPU Utilization</h2>
              </div>
              <span className={`font-mono font-bold text-lg ${isCpuAlert ? 'text-red-500' : 'text-blue-400'}`}>
                {currentCpu.toFixed(1)}%
              </span>
            </div>
            
            {/* Threshold Configuration */}
            <div className="flex items-center justify-between mb-6 bg-slate-100 dark:bg-[#161b22] p-2 rounded-md border border-slate-200 dark:border-[#30363d]">
               <span className="text-[10px] text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Alert Threshold</span>
               <div className="flex items-center gap-2">
                 <input 
                   type="range" 
                   min="50" max="100" 
                   value={cpuThreshold} 
                   onChange={(e) => setCpuThreshold(Number(e.target.value))}
                   className="w-24 h-1 bg-slate-300 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-red-500"
                 />
                 <span className="text-xs text-slate-900 dark:text-[#c9d1d9] font-mono">{cpuThreshold}%</span>
               </div>
            </div>

            <div className="flex-1 min-h-[160px] relative">
              {/* Visual Threshold Line Guide */}
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-red-500/50 z-10 pointer-events-none" 
                style={{ bottom: `${cpuThreshold}%` }}
              >
                <span className="absolute -top-3 right-0 text-[9px] text-red-500 font-mono">Alert &gt; {cpuThreshold}%</span>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isCpuAlert ? "#ef4444" : "#3b82f6"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isCpuAlert ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#8b949e" fontSize={10} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    name="CPU" 
                    stroke={isCpuAlert ? "#ef4444" : "#3b82f6"} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorCpu)" 
                    isAnimationActive={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RAM Chart */}
          <div className={`bg-white dark:bg-[#0d1117] border rounded-xl p-5 flex flex-col transition-colors duration-300 ${isRamAlert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-200 dark:border-[#30363d]'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
                <Server className={`w-5 h-5 ${isRamAlert ? 'text-red-500' : 'text-purple-400'}`} />
                <h2 className="font-semibold text-sm">Memory Allocation (RAM)</h2>
              </div>
              <span className={`font-mono font-bold text-lg ${isRamAlert ? 'text-red-500' : 'text-purple-400'}`}>
                {currentRam.toFixed(1)}%
              </span>
            </div>
            
            {/* Threshold Configuration */}
            <div className="flex items-center justify-between mb-6 bg-slate-100 dark:bg-[#161b22] p-2 rounded-md border border-slate-200 dark:border-[#30363d]">
               <span className="text-[10px] text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Alert Threshold</span>
               <div className="flex items-center gap-2">
                 <input 
                   type="range" 
                   min="50" max="100" 
                   value={ramThreshold} 
                   onChange={(e) => setRamThreshold(Number(e.target.value))}
                   className="w-24 h-1 bg-slate-300 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-red-500"
                 />
                 <span className="text-xs text-slate-900 dark:text-[#c9d1d9] font-mono">{ramThreshold}%</span>
               </div>
            </div>

            <div className="flex-1 min-h-[160px] relative">
              {/* Visual Threshold Line Guide */}
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-red-500/50 z-10 pointer-events-none" 
                style={{ bottom: `${ramThreshold}%` }}
              >
                <span className="absolute -top-3 right-0 text-[9px] text-red-500 font-mono">Alert &gt; {ramThreshold}%</span>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isRamAlert ? "#ef4444" : "#a855f7"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isRamAlert ? "#ef4444" : "#a855f7"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#8b949e" fontSize={10} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="ram" 
                    name="RAM" 
                    stroke={isRamAlert ? "#ef4444" : "#a855f7"} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRam)" 
                    isAnimationActive={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disk I/O Chart */}
          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 flex flex-col lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
                <HardDrive className="w-5 h-5 text-emerald-400" />
                <h2 className="font-semibold text-sm">Disk I/O Throughput</h2>
              </div>
              <span className="text-emerald-400 font-mono font-medium">{data[data.length - 1].disk.toFixed(1)} MB/s</span>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#8b949e" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="disk" name="Disk I/O" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDisk)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disk Space Heatmap */}
          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 flex flex-col lg:col-span-2 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
                <PieChart className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold text-sm">Storage Allocation Heatmap (D3)</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-[#8b949e]">Hierarchical volume mapping</span>
            </div>
            <div className="flex-1 -mx-2 -mb-2">
              <DiskHeatmap />
            </div>
          </div>

          {/* Smart Cleanup Panel */}
          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 flex flex-col lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-sm">Smart Cleanup (Cache & Orphaned Data)</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-[#8b949e]">Scanned across {cleanupItems.length > 0 ? 'all volumes' : 'optimized state'}</span>
            </div>
            
            {cleanupItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-slate-500 dark:text-[#8b949e]">
                <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">System is fully optimized.</p>
                <p className="text-xs opacity-70">No temporary or cached data found.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto border border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-100 dark:bg-[#161b22] mb-4">
                  {cleanupItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleSelection(item.id)}
                      className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-[#30363d] last:border-b-0 hover:bg-slate-200 dark:bg-[#21262d] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-slate-500 dark:text-[#8b949e] group-hover:text-blue-400 transition-colors">
                          {selectedItems.has(item.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <p className="text-xs font-mono text-slate-900 dark:text-[#c9d1d9]">{item.path}</p>
                          <p className="text-[10px] text-slate-500 dark:text-[#8b949e] uppercase mt-0.5">{item.type}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-amber-400">{item.size}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#30363d]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Selected to Clean</span>
                    <span className="text-sm font-semibold text-amber-400">{formatBytes(totalSelectedBytes)}</span>
                  </div>
                  <button
                    onClick={handleClean}
                    disabled={selectedItems.size === 0 || isCleaning}
                    className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCleaning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Clean Selected
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
