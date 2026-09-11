import React from 'react';
import { 
  FolderTree, 
  FileCode2, 
  Settings2, 
  Activity,
  HardDrive,
  Globe2,
  Database,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FileAsset } from '../types';

const MOCK_FILES: FileAsset[] = [
  {
    id: 'root',
    name: 'NixOS Core',
    type: 'system',
    children: [
      {
        id: 'var',
        name: '/var',
        type: 'folder',
        children: [
          { id: 'log', name: 'log', type: 'folder' },
          { id: 'lib', name: 'lib', type: 'folder' },
        ]
      },
      {
        id: 'etc',
        name: '/etc',
        type: 'folder',
        children: [
          { id: 'nixos', name: 'nixos', type: 'folder', children: [{ id: 'config', name: 'configuration.nix', type: 'file', format: 'nix', size: '2.4kb' }] },
        ]
      }
    ]
  },
  {
    id: 'volumes',
    name: 'Connected Volumes',
    type: 'system',
    children: [
      { id: 'vol-1', name: 'data-lake-alpha', type: 'folder' },
      { id: 'vol-2', name: 'governance-archive', type: 'folder' }
    ]
  }
];

export function SystemScanner({ isCollapsed = false, onToggleCollapse }: { isCollapsed?: boolean, onToggleCollapse?: () => void }) {
  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-[#30363d] w-12 flex-shrink-0 transition-all duration-300">
        <button 
          onClick={onToggleCollapse}
          className="mt-4 p-1.5 hover:bg-slate-200 dark:bg-[#21262d] rounded-md text-slate-500 dark:text-[#8b949e] transition-colors"
          title="Expand Scanner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="mt-8 flex flex-col items-center gap-6 text-slate-500 dark:text-[#8b949e]">
          <Globe2 className="w-5 h-5 text-emerald-500" title="Global Asset Visibility" />
          <HardDrive className="w-5 h-5" title="Connected Volumes" />
          <Activity className="w-5 h-5 text-emerald-500" title="Optimal Status" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-[#30363d] w-72 flex-shrink-0 transition-all duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-500" />
            Global Asset Visibility
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-[#8b949e] mt-1">Deep compatibility scanning active</p>
        </div>
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-slate-200 dark:bg-[#21262d] rounded-md text-slate-500 dark:text-[#8b949e] transition-colors"
          title="Collapse Scanner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {MOCK_FILES.map(node => (
          <FileNode key={node.id} node={node} level={0} />
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-500 dark:text-[#8b949e]">System Status</span>
          <span className="text-emerald-500 flex items-center gap-1"><Activity className="w-3 h-3" /> Optimal</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded p-2 flex flex-col gap-1 text-center">
            <span className="text-emerald-400 font-mono text-xs">8,492</span>
            <span className="text-[9px] text-slate-500 dark:text-[#8b949e] uppercase">Formats</span>
          </div>
          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded p-2 flex flex-col gap-1 text-center">
            <span className="text-emerald-400 font-mono text-xs">4.2PB</span>
            <span className="text-[9px] text-slate-500 dark:text-[#8b949e] uppercase">Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FileNode: React.FC<{ node: FileAsset; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = React.useState(level < 2);
  
  const Icon = node.type === 'system' ? HardDrive : node.type === 'folder' ? FolderTree : FileCode2;
  const iconColor = node.type === 'system' ? 'text-indigo-400' : node.type === 'folder' ? 'text-blue-400' : 'text-slate-500 dark:text-[#8b949e]';
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-slate-100 dark:bg-[#161b22] rounded cursor-pointer ${level === 0 ? 'mt-2' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        <span className="text-xs text-slate-900 dark:text-[#c9d1d9] truncate">{node.name}</span>
        {node.format && <span className="text-[9px] px-1 py-0.5 rounded bg-slate-200 dark:bg-[#21262d] text-slate-500 dark:text-[#8b949e] ml-auto">{node.format}</span>}
      </div>
      
      {isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
