import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { AgentNodeData, useWorkflowStore } from '@/store/useWorkflowStore';
import { Activity, CheckCircle2, CircleDashed, AlertCircle, Settings2, Copy, Image as ImageIcon, Search, Video } from 'lucide-react';

export function CustomNode({ id, data }: { id: string; data: AgentNodeData }) {
  const isThinking = data.status === 'Thinking' || data.status === 'Executing';
  const isCompleted = data.status === 'Completed';
  const isError = data.status === 'Error';
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);

  let agentBorderColor = 'border-border-2';
  let agentShadowColor = 'rgba(255,255,255,0)';
  let agentTextColor = 'text-white';
  let AgentIcon = CircleDashed;
  
  switch (data.agentName) {
    case 'Copy Agent':
      agentBorderColor = 'border-brand-blue-light';
      agentShadowColor = 'rgba(96,165,250,0.5)';
      agentTextColor = 'text-brand-blue-light';
      AgentIcon = Copy;
      break;
    case 'Image Agent':
      agentBorderColor = 'border-brand-green';
      agentShadowColor = 'rgba(16,185,129,0.5)';
      agentTextColor = 'text-brand-green';
      AgentIcon = ImageIcon;
      break;
    case 'SEO Agent':
      agentBorderColor = 'border-brand-amber';
      agentShadowColor = 'rgba(245,158,11,0.5)';
      agentTextColor = 'text-brand-amber';
      AgentIcon = Search;
      break;
    case 'Video Agent':
      agentBorderColor = 'border-brand-pink';
      agentShadowColor = 'rgba(219,39,119,0.5)';
      agentTextColor = 'text-brand-pink';
      AgentIcon = Video;
      break;
  }

  return (
    <motion.div
      className={`relative rounded-xl border bg-ink-3 p-4 shadow-sm w-64 ${
        isError ? 'border-brand-pink' : agentBorderColor
      }`}
      animate={isThinking ? { scale: [1, 1.02, 1], boxShadow: ['0px 0px 0px rgba(0,0,0,0)', `0px 0px 15px ${agentShadowColor}`, '0px 0px 0px rgba(0,0,0,0)'] } : {}}
      transition={isThinking ? { repeat: Infinity, duration: 2 } : {}}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-subtle border-none" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AgentIcon className={`w-4 h-4 ${agentTextColor}`} />
          <div className="font-semibold text-white">{data.agentName}</div>
          <button 
            onClick={() => setSelectedNodeId(id)}
            className="p-1 text-subtle hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Settings & Status"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {isThinking && <Activity className={`w-4 h-4 ${agentTextColor} animate-pulse`} />}
        {isCompleted && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
        {data.status === 'Idle' && <CircleDashed className="w-4 h-4 text-subtle" />}
        {isError && <AlertCircle className="w-4 h-4 text-brand-pink" />}
      </div>
      
      <div className="text-xs text-muted mb-3 font-mono bg-ink-2 p-1.5 rounded border border-border-1">
        {data.modelName}
      </div>
      
      <div className="flex justify-between text-xs text-subtle border-t border-border-1 pt-2 mt-2">
        <div>
          <span className="font-medium text-body">{data.tokens}</span> tkns
        </div>
        <div>
          <span className="font-medium text-body">{data.latency}</span> ms
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-subtle border-none" />
    </motion.div>
  );
}
