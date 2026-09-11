import React, { useState } from 'react';
import { Binary, Cpu, GitMerge, FileCode2, Terminal, Play, CheckCircle2, ChevronRight, Layers, FileJson } from 'lucide-react';

export function ReverseEngineering() {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [outputReady, setOutputReady] = useState(false);
  const [code, setCode] = useState(`// Target: Legacy Compliance Module (v1.2.4)
// Extracting governing constraints...

function checkCompliance(contractData) {
  if (contractData.value > 50000) {
    if (!contractData.hasSignatures || contractData.signatures.length < 2) {
      return { valid: false, reason: 'High-value contracts require dual execution signatures.' };
    }
    if (contractData.region === 'EU' && !contractData.gdprClause) {
      return { valid: false, reason: 'EU entities must include GDPR article 28 standard clauses.' };
    }
  }
  
  if (contractData.type === 'EMPLOYMENT' && contractData.termMonths > 24) {
      return { valid: false, reason: 'Fixed-term employment cannot exceed 24 months per local labor laws.' };
  }
  
  return { valid: true, riskScore: calculateRisk(contractData) };
}`);

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setOutputReady(true);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Header */}
      <div className="h-14 z-10 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-md">
            <Binary className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Logic Extractor & Reverse Engineering</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Decompile legacy code into n8n executable policy logic</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left Column: Source Input */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl overflow-hidden shadow-lg">
          <div className="h-10 border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-slate-500 dark:text-[#8b949e]" />
              <span className="text-xs font-mono text-slate-900 dark:text-[#c9d1d9]">legacy_compliance.js</span>
            </div>
            <span className="text-[10px] bg-slate-200 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-[#8b949e] px-2 py-0.5 rounded uppercase tracking-wider">
              Target Source
            </span>
          </div>
          <div className="flex-1 relative">
            <textarea
              className="w-full h-full bg-transparent text-slate-900 dark:text-[#c9d1d9] font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                {isSynthesizing ? (
                  <Terminal className="w-4 h-4 animate-pulse" />
                ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
                )}
                {isSynthesizing ? 'Decompiling & Tracing...' : 'Synthesize Logic'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Logic Trees */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl overflow-hidden shadow-lg relative">
          <div className="h-10 border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-slate-500 dark:text-[#8b949e]" />
              <span className="text-xs font-semibold text-slate-900 dark:text-[#c9d1d9]">Extracted Policy Rulebook</span>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!outputReady && !isSynthesizing && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-[#8b949e] opacity-50">
                <Layers className="w-12 h-12 mb-4" />
                <p className="text-sm">Awaiting source code execution trace...</p>
                <p className="text-xs mt-2 text-center max-w-sm">Press "Synthesize Logic" to reverse-engineer the selected source code into structured business rules.</p>
              </div>
            )}

            {isSynthesizing && (
              <div className="h-full flex flex-col items-center justify-center text-slate-900 dark:text-[#c9d1d9]">
                <Cpu className="w-12 h-12 mb-4 text-blue-500 animate-pulse" />
                <p className="text-sm font-mono animate-pulse">Building Abstract Syntax Tree...</p>
                <p className="text-xs mt-2 text-slate-500 dark:text-[#8b949e] font-mono">Mapping conditional branches...</p>
              </div>
            )}

            {outputReady && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Visual Tree */}
                <div className="bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 font-mono text-xs text-slate-500 dark:text-[#8b949e]">
                   <div className="flex items-center gap-2 text-slate-900 dark:text-[#c9d1d9] mb-3">
                     <Terminal className="w-4 h-4 text-emerald-400" />
                     <span>Control Flow Graph (CFG) Mapped</span>
                   </div>
                   <div className="pl-2 border-l border-slate-200 dark:border-[#30363d] ml-2 space-y-2">
                      <div className="flex items-center gap-2">
                         <ChevronRight className="w-3 h-3 text-blue-400" />
                         <span>Branch: <span className="text-blue-400">value &gt; 50000</span></span>
                      </div>
                      <div className="pl-6 space-y-2">
                         <div className="flex items-center gap-2">
                           <ChevronRight className="w-3 h-3 text-red-400" />
                           <span>Condition: <span className="text-purple-400">signatures.length &lt; 2</span> → [DENY]</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <ChevronRight className="w-3 h-3 text-red-400" />
                           <span>Condition: <span className="text-purple-400">region == 'EU' && !gdprClause</span> → [DENY]</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                         <ChevronRight className="w-3 h-3 text-blue-400" />
                         <span>Branch: <span className="text-blue-400">type == 'EMPLOYMENT'</span></span>
                      </div>
                      <div className="pl-6 space-y-2">
                         <div className="flex items-center gap-2">
                           <ChevronRight className="w-3 h-3 text-red-400" />
                           <span>Condition: <span className="text-purple-400">termMonths &gt; 24</span> → [DENY]</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* JSON Output Payload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-[#c9d1d9] flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-amber-400" />
                      JSON Rule Engine Payload
                    </h3>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready for Eramba / n8n
                    </span>
                  </div>
                  <pre className="bg-slate-50 dark:bg-[#010409] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 overflow-x-auto text-[10px] font-mono text-slate-900 dark:text-[#c9d1d9] leading-relaxed">
{JSON.stringify({
  ruleset_id: "COMPLIANCE_v1_2_4",
  extracted_rules: [
    {
      id: "R1",
      condition: "contractData.value > 50000 && contractData.signatures.length < 2",
      action: "DENY",
      message: "High-value contracts require dual execution signatures."
    },
    {
      id: "R2",
      condition: "contractData.value > 50000 && contractData.region === 'EU' && !contractData.gdprClause",
      action: "DENY",
      message: "EU entities must include GDPR article 28 standard clauses."
    },
    {
      id: "R3",
      condition: "contractData.type === 'EMPLOYMENT' && contractData.termMonths > 24",
      action: "DENY",
      message: "Fixed-term employment cannot exceed 24 months per local labor laws."
    }
  ]
}, null, 2)}
                  </pre>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
