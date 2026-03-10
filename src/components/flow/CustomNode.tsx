import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { AgentNodeData, useWorkflowStore } from '@/store/useWorkflowStore';
import { Activity, CheckCircle2, CircleDashed, AlertCircle, Settings2, Copy, Image as ImageIcon, Search, Video } from 'lucide-react';

export function CustomNode({ id, data }: { id: string; data: AgentNodeData }) {
  const isThinking = data.status === 'Thinking' || data.status === 'Executing';
  const isCompleted = data.status === 'Completed';
  const isError = data.status === 'Error';
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);

  let agentBorderColor = 'border-border';
  let agentShadowColor = 'rgba(255,255,255,0)';
  let agentTextColor = 'text-ink-deep';
  let AgentIcon = CircleDashed;
  
  switch (data.agentName) {
    case 'Copy Agent':
      agentBorderColor = 'border-[#3b82f6]';
      agentShadowColor = 'rgba(59,130,246,0.3)';
      agentTextColor = 'text-[#3b82f6]';
      AgentIcon = Copy;
      break;
    case 'Image Agent':
      agentBorderColor = 'border-[#10b981]';
      agentShadowColor = 'rgba(16,185,129,0.3)';
      agentTextColor = 'text-[#10b981]';
      AgentIcon = ImageIcon;
      break;
    case 'SEO Agent':
      agentBorderColor = 'border-[#f59e0b]';
      agentShadowColor = 'rgba(245,158,11,0.3)';
      agentTextColor = 'text-[#f59e0b]';
      AgentIcon = Search;
      break;
    case 'Video Agent':
      agentBorderColor = 'border-[#db2777]';
      agentShadowColor = 'rgba(219,39,119,0.3)';
      agentTextColor = 'text-[#db2777]';
      AgentIcon = Video;
      break;
  }

  return (
    <motion.div
      className={`relative rounded-[16px] border-[1.5px] bg-white p-5 shadow-[0_1px_3px_rgba(26,26,46,0.04)] hover:shadow-[0_4px_24px_rgba(79,70,229,0.08)] hover:-translate-y-[1px] transition-all w-[280px] ${
        isError ? 'border-[#ef4444]' : agentBorderColor
      }`}
      animate={isThinking ? { scale: [1, 1.02, 1], boxShadow: ['0px 0px 0px rgba(0,0,0,0)', `0px 0px 15px ${agentShadowColor}`, '0px 0px 0px rgba(0,0,0,0)'] } : {}}
      transition={isThinking ? { repeat: Infinity, duration: 2 } : {}}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted border-none" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#f3f3f8] flex items-center justify-center">
            <AgentIcon className={`w-4 h-4 ${agentTextColor}`} />
          </div>
          <div className="font-semibold text-[15px] text-ink-deep tracking-[-0.01em]">{data.agentName}</div>
          <button 
            onClick={() => setSelectedNodeId(id)}
            className="p-1.5 text-muted hover:text-brand-indigo hover:bg-surface-tint rounded-md transition-colors ml-1"
            title="Settings & Status"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {isThinking && <Activity className={`w-4 h-4 ${agentTextColor} animate-pulse`} />}
        {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
        {data.status === 'Idle' && <CircleDashed className="w-4 h-4 text-muted" />}
        {isError && <AlertCircle className="w-4 h-4 text-[#ef4444]" />}
      </div>
      
      <div className="text-[11px] text-muted mb-4 font-mono bg-surface p-2 rounded-[6px] border border-border">
        {data.modelName}
      </div>
      
      <div className="flex justify-between text-[13px] text-ink-light border-t border-border pt-3 mt-3">
        <div>
          <span className="font-medium text-ink-medium">{data.tokens}</span> tkns
        </div>
        <div>
          <span className="font-medium text-ink-medium">{data.latency}</span> ms
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-muted border-none" />
    </motion.div>
  );
}
