import React from 'react';
import { Settings } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { IntegrationSettings } from './IntegrationSettings';

export function SettingsModule() {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      <div className="h-14 z-10 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-200 dark:bg-[#21262d] rounded-md">
            <Settings className="w-5 h-5 text-slate-500 dark:text-[#8b949e]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Setup & Settings</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Global configurations & Integrations</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          <IntegrationSettings />

          <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9] mb-4 flex items-center gap-2">
              Native App Installation
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-6 leading-relaxed">
              Install the LegalSynopsis Governing Setup as a native application on Android, Windows, ChromeOS, or iOS. Enjoy offline capabilities, background syncing, and a seamless native window experience.
            </p>
            <div className="flex items-center justify-center p-6 border border-dashed border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-50 dark:bg-[#010409] mt-auto">
               <PWAInstallButton />
               <p className="text-xs text-slate-500 dark:text-[#8b949e] italic ml-2 hidden lg:block">
                 (Button hidden if already installed)
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
