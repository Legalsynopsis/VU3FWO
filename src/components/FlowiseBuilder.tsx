import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Handle,
  Position,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bot, MessageSquare, Link2, Sparkles, BrainCircuit } from 'lucide-react';

const nodeStyles = {
  background: '#0d1117',
  color: '#c9d1d9',
  border: '1px solid #30363d',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const CustomNode = ({ data, icon: Icon, colorClass }: { data: any, icon: any, colorClass: string }) => {
  return (
    <div style={nodeStyles} className="w-[280px] overflow-hidden">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-slate-300 dark:bg-[#30363d] !border-2 !border-slate-50 dark:border-[#010409]" />
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-[#30363d] bg-slate-100 dark:bg-[#161b22]">
        <div className={`p-1.5 rounded-lg ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="font-semibold text-sm">{data.label}</div>
      </div>
      <div className="p-4 bg-white dark:bg-[#0d1117]">
        {data.description && <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-3">{data.description}</p>}
        {data.params && (
          <div className="space-y-2 mt-2">
            {data.params.map((param: any, i: number) => (
              <div key={i} className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">{param.name}</label>
                <input 
                  type="text" 
                  defaultValue={param.value} 
                  className="bg-slate-50 dark:bg-[#010409] border border-slate-200 dark:border-[#30363d] rounded px-2 py-1 text-xs text-slate-900 dark:text-[#c9d1d9] outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-slate-50 dark:border-[#010409]" />
    </div>
  );
};

// Node variants
const LLMNode = (props: any) => <CustomNode {...props} icon={BrainCircuit} colorClass="bg-purple-500/20 text-purple-400" />;
const PromptNode = (props: any) => <CustomNode {...props} icon={MessageSquare} colorClass="bg-emerald-500/20 text-emerald-400" />;
const ChainNode = (props: any) => <CustomNode {...props} icon={Link2} colorClass="bg-blue-500/20 text-blue-400" />;

const initialNodes = [
  {
    id: '1',
    type: 'promptNode',
    position: { x: 50, y: 150 },
    data: {
      label: 'System Prompt Template',
      description: 'Defines the base instructions for the model.',
      params: [
        { name: 'Template', value: 'You are a legal governance AI...' }
      ]
    }
  },
  {
    id: '2',
    type: 'llmNode',
    position: { x: 450, y: 50 },
    data: {
      label: 'ChatOpenAI',
      description: 'OpenAI language model wrapper.',
      params: [
        { name: 'Model Name', value: 'gpt-4' },
        { name: 'Temperature', value: '0.0' }
      ]
    }
  },
  {
    id: '3',
    type: 'chainNode',
    position: { x: 850, y: 150 },
    data: {
      label: 'LLM Chain',
      description: 'Chain to run queries against LLMs.',
      params: [
        { name: 'Chain Name', value: 'Compliance Check Chain' }
      ]
    }
  }
];

const initialEdges = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#8b949e', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#8b949e', strokeWidth: 2 } },
];

export function FlowiseBuilder() {
  const nodeTypes = useMemo(() => ({
    llmNode: LLMNode,
    promptNode: PromptNode,
    chainNode: ChainNode,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } } as any, eds)),
    [setEdges],
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#010409] overflow-hidden">
      {/* Header */}
      <div className="h-14 z-10 border-b border-slate-200 dark:border-[#30363d] flex items-center justify-between px-6 bg-white dark:bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/10 rounded-md">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#c9d1d9]">Flowise Studio</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#8b949e]">Visual LLM Builder & Langchain Workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-200 dark:bg-[#21262d] hover:bg-slate-300 dark:bg-[#30363d] border border-slate-200 dark:border-[#30363d] text-slate-900 dark:text-[#c9d1d9] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Test Chat
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-50 dark:bg-[#010409]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="dark"
        >
          <Controls className="!bg-white dark:bg-[#0d1117] !border-slate-200 dark:border-[#30363d] !fill-[#8b949e]" />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'llmNode': return '#a855f7';
                case 'promptNode': return '#10b981';
                case 'chainNode': return '#3b82f6';
                default: return '#8b949e';
              }
            }}
            maskColor="rgba(1, 4, 9, 0.8)"
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#30363d" />
        </ReactFlow>
      </div>
    </div>
  );
}
