/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Module } from './types';
import { SystemScanner } from './components/SystemScanner';
import { ClientsModule } from './components/ClientsModule';
import { WorkflowEngine } from './components/WorkflowEngine';
import { SystemHealth } from './components/SystemHealth';
import { SecurityDashboard } from './components/SecurityDashboard';
import { CommandPalette } from './components/CommandPalette';
import { SynopsisEngine } from './components/SynopsisEngine';
import { SettingsModule } from './components/SettingsModule';
import { ReverseEngineering } from './components/ReverseEngineering';
import { FlowiseBuilder } from './components/FlowiseBuilder';
import { LayoutGrid, Users, Settings, Workflow, ShieldAlert, Activity, ShieldCheck, BookOpen, Binary, Bot, Sun, Moon } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [activeModule, setActiveModule] = useLocalStorage<Module>('legalsynopsis_active_module', 'workflow');
  const [isScannerCollapsed, setIsScannerCollapsed] = useLocalStorage<boolean>('legalsynopsis_scanner_collapsed', false);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('legalsynopsis_theme', 'dark');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    // Apply theme to document element so child components and modals inherit correctly
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#010409] text-slate-900 dark:text-[#c9d1d9] font-sans overflow-hidden transition-colors duration-200">
      {/* Sidebar Navigation */}
      <div className="w-16 flex flex-col items-center py-4 bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-[#30363d] flex-shrink-0 z-20 shadow-xl transition-colors duration-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex flex-col gap-2 w-full px-2">
          <NavButton 
            icon={<Workflow className="w-5 h-5" />} 
            isActive={activeModule === 'workflow'} 
            onClick={() => setActiveModule('workflow')}
            tooltip="Governing Engine"
          />
          <NavButton 
            icon={<Users className="w-5 h-5" />} 
            isActive={activeModule === 'clients'} 
            onClick={() => setActiveModule('clients')}
            tooltip="Clients Module"
          />
          <NavButton 
            icon={<BookOpen className="w-5 h-5" />} 
            isActive={activeModule === 'synopsis'} 
            onClick={() => setActiveModule('synopsis')}
            tooltip="NLP Synopsis Engine"
          />
          <NavButton 
            icon={<Binary className="w-5 h-5" />} 
            isActive={activeModule === 'reverse' as any} 
            onClick={() => setActiveModule('reverse' as any)}
            tooltip="Logic Extractor (Reverse Engineering)"
          />
          <NavButton 
            icon={<Bot className="w-5 h-5" />} 
            isActive={activeModule === 'flowise' as any} 
            onClick={() => setActiveModule('flowise' as any)}
            tooltip="Flowise Studio (LLM Flows)"
          />
          <NavButton 
            icon={<LayoutGrid className="w-5 h-5" />} 
            isActive={activeModule === 'scanner'} 
            onClick={() => setActiveModule('scanner')}
            tooltip="System Visibility"
          />
          <NavButton 
            icon={<Activity className="w-5 h-5" />} 
            isActive={activeModule === 'health'} 
            onClick={() => setActiveModule('health')}
            tooltip="System Health & Telemetry"
          />
          <NavButton 
            icon={<ShieldCheck className="w-5 h-5" />} 
            isActive={activeModule === 'security'} 
            onClick={() => setActiveModule('security')}
            tooltip="Security Audit"
          />
        </div>

        <div className="mt-auto w-full px-2 flex flex-col gap-2">
          <NavButton 
            icon={theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} 
            isActive={false} 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            tooltip={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          />
          <NavButton 
            icon={<Settings className="w-5 h-5" />} 
            isActive={activeModule === 'settings' as any} 
            onClick={() => setActiveModule('settings' as any)}
            tooltip="Setup & Settings"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* We keep the System Scanner persistently visible on the left to show "deep compatibility" and file visibility */}
        <SystemScanner 
          isCollapsed={isScannerCollapsed} 
          onToggleCollapse={() => setIsScannerCollapsed(prev => !prev)} 
        />
        
        {/* Dynamic Main View */}
        <div className="flex-1 overflow-hidden">
          {activeModule === 'clients' && <ClientsModule />}
          {activeModule === 'workflow' && <WorkflowEngine />}
          {activeModule === 'synopsis' && <SynopsisEngine />}
          {activeModule === 'reverse' as any && <ReverseEngineering />}
          {activeModule === 'flowise' as any && <FlowiseBuilder />}
          {activeModule === 'health' && <SystemHealth />}
          {activeModule === 'security' && <SecurityDashboard />}
          {activeModule === 'settings' as any && <SettingsModule />}
          {activeModule === 'scanner' && (
            <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-[#010409]">
              <div className="text-center max-w-md">
                <LayoutGrid className="w-12 h-12 text-[#30363d] mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-[#c9d1d9] mb-2">Deep System Scan Active</h2>
                <p className="text-sm text-slate-500 dark:text-[#8b949e]">
                  Legalsynopsis is continuously monitoring all file formats, folders, and compatible computing languages across the connected environments. Select an asset from the left panel to begin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        setActiveModule={setActiveModule}
      />
    </div>
  );
}

function NavButton({ icon, isActive, onClick, tooltip }: { icon: React.ReactNode, isActive: boolean, onClick: () => void, tooltip: string }) {
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 relative group
        ${isActive ? 'bg-[#1f2937] text-white shadow-inner' : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:text-[#c9d1d9] hover:bg-slate-100 dark:bg-[#161b22]'}`}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full" />}
      {icon}
    </button>
  );
}

