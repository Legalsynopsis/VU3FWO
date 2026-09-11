import React, { useState } from 'react';
import { BookOpen, FileText, CheckCircle2, XCircle, FileArchive, ArrowRight, RefreshCcw, Database, ShieldCheck, Download, History, Sparkles } from 'lucide-react';

export function SynopsisEngine() {
  const [activeTab, setActiveTab] = useState<'extractive' | 'abstractive'>('abstractive');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  const handleApprove = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Header */}
      <div className="h-14 z-10 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-500/10 rounded-md">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">LegalSynopsis Engine & Review UI</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">NLP Summarisation & Governance Workbench</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {syncStatus === 'success' && (
             <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
               <ShieldCheck className="w-3.5 h-3.5" />
               Synced to Eramba & OpenMetadata
             </span>
          )}
          <button className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-[#c9d1d9] bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] px-3 py-1.5 rounded border border-slate-200 dark:border-[#30363d] transition-colors">
            <History className="w-3.5 h-3.5" />
            Audit History
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Source Document & Ontology */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
          <div className="p-4 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between bg-slate-100 dark:bg-[#161b22]">
            <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9]">
              <FileArchive className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">Source: Master Service Agreement.pdf</h2>
            </div>
            <span className="text-[10px] bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-[#8b949e] px-2 py-0.5 rounded font-mono">
              LegalMD Format Active
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-500 dark:text-[#8b949e] bg-slate-50 dark:bg-[#010409]">
            <div className="mb-4 text-slate-900 dark:text-[#c9d1d9] font-sans text-sm font-semibold border-b border-slate-200 dark:border-[#30363d] pb-2">
              Extracted LegalMD Taxonomy
            </div>
            <p className="mb-6 whitespace-pre-wrap">
              This Master Services Agreement ("Agreement") is made effective as of <span className="bg-blue-500/20 text-blue-400 px-1 rounded">@deadline(2026-10-01)</span>, by and between:
              <br/><br/>
              <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">@party(Alpha Corp Legal)</span>, a corporation organized under the laws of Delaware ("Client"), and 
              <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">@party(Legalsynopsis LLC)</span> ("Provider").
              <br/><br/>
              <span className="bg-purple-500/20 text-purple-400 px-1 rounded">@clause(Term_and_Termination)</span>
              <br/>
              The term of this Agreement shall commence on the Effective Date and shall continue for a period of twelve (12) months unless terminated earlier in accordance with the provisions herein.
              <br/><br/>
              <span className="bg-purple-500/20 text-purple-400 px-1 rounded">@clause(Confidentiality)</span>
              <br/>
              Both parties agree to hold all proprietary information strictly confidential. Provider shall ensure compliance with OpenSCAP and Eramba protocols for data governance.
            </p>
            
            <div className="mt-8 p-4 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-[#c9d1d9] mb-3 flex items-center gap-2 font-sans">
                <Database className="w-4 h-4 text-blue-400" />
                Pipeline Metadata (OpenMetadata Sync)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <span className="block text-slate-500 dark:text-[#8b949e] mb-1">Ingestion</span>
                  <span className="text-slate-900 dark:text-[#c9d1d9]">pdfminer.six + Tesseract OCR</span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-[#8b949e] mb-1">Ontology</span>
                  <span className="text-slate-900 dark:text-[#c9d1d9]">SALI Alliance LMSS + LegalMD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: NLP Summaries & Governance Workflow */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-[#0d1117]">
          <div className="p-4 border-b border-slate-200 dark:border-[#30363d] flex items-center gap-4 bg-slate-100 dark:bg-[#161b22]">
            <button 
              onClick={() => setActiveTab('abstractive')}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                activeTab === 'abstractive' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:text-[#c9d1d9]'
              }`}
            >
              Abstractive (BART / T5)
            </button>
            <button 
              onClick={() => setActiveTab('extractive')}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                activeTab === 'extractive' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:text-[#c9d1d9]'
              }`}
            >
              Extractive (DELSumm)
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {activeTab === 'abstractive' ? (
              <div className="bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Fluent Narrative Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-4">Generated via Legal-LED / Pegasus ensemble. Reranked for flow.</p>
                <div className="text-sm text-slate-900 dark:text-[#c9d1d9] leading-relaxed">
                  Alpha Corp Legal and Legalsynopsis LLC have entered into a 12-month Master Services Agreement effective October 1, 2026. The agreement strictly enforces mutual confidentiality, mandating that the Provider maintains adherence to OpenSCAP and Eramba data governance frameworks to secure proprietary information.
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Rhetorical-Role Extractive
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-4">Generated via DELSumm (TransformerSum). Preserves exact clause wording.</p>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-md border-l-2 border-l-blue-500">
                    <span className="text-[9px] text-blue-400 uppercase tracking-wider block mb-1">Entity Definition</span>
                    <span className="text-xs text-slate-900 dark:text-[#c9d1d9] font-serif">Alpha Corp Legal... and Legalsynopsis LLC ("Provider").</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-md border-l-2 border-l-emerald-500">
                    <span className="text-[9px] text-emerald-400 uppercase tracking-wider block mb-1">Key Obligation</span>
                    <span className="text-xs text-slate-900 dark:text-[#c9d1d9] font-serif">Provider shall ensure compliance with OpenSCAP and Eramba protocols for data governance.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Governance Actions */}
            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-[#30363d]">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider mb-4">Governance Review</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleApprove}
                  disabled={syncStatus !== 'idle'}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-wait text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  {syncStatus === 'syncing' ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {syncStatus === 'syncing' ? 'Publishing Policy...' : 'Approve & Sync Policy (Eramba)'}
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-[#21262d] hover:bg-red-500/20 text-slate-500 dark:text-[#8b949e] hover:text-red-400 border border-slate-200 dark:border-[#30363d] hover:border-red-500/30 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-500 dark:text-[#8b949e] mt-4">
                Approving this synopsis will commit a new version to Git (DVC) and register the data product in OpenMetadata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

