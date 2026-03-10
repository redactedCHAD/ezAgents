/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AgentMap } from '@/components/flow/AgentMap';
import { AgentPalette } from '@/components/dashboard/AgentPalette';
import { ReasoningConsole } from '@/components/dashboard/ReasoningConsole';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { OutputPanel } from '@/components/dashboard/OutputPanel';
import { NodeModal } from '@/components/dashboard/NodeModal';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import { runCopyAgent } from '@/lib/agents/copy-agent';
import { runImageAgent } from '@/lib/agents/image-agent';
import { runSEOAgent } from '@/lib/agents/seo-agent';
import { runVideoAgent } from '@/lib/agents/video-agent';
import { useEventStore } from '@/store/useEventStore';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Play, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [task, setTask] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [outputs, setOutputs] = useState<any[]>([]);
  const clearEvents = useEventStore((state) => state.clearEvents);
  const { nodes, updateNodeStatus } = useWorkflowStore();

  const resetWorkflow = () => {
    clearEvents();
    setOutputs([]);
    nodes.forEach(node => {
      updateNodeStatus(node.id, 'Idle', -node.data.tokens, -node.data.latency, undefined);
    });
  };

  const handleExecute = async () => {
    if (!task.trim()) return;
    
    setIsExecuting(true);
    resetWorkflow();
    
    try {
      // 1. Run Orchestrator
      const agentsToRun = await runOrchestrator(task);
      
      // 2. Run selected agents in parallel
      const promises = [];
      
      if (agentsToRun.includes('Copy Agent')) {
        promises.push(runCopyAgent(task, (data) => {
          setOutputs(prev => [...prev, data]);
        }));
      }
      
      if (agentsToRun.includes('Image Agent')) {
        promises.push(runImageAgent(task, (data) => {
          setOutputs(prev => [...prev, data]);
        }));
      }

      if (agentsToRun.includes('SEO Agent')) {
        promises.push(runSEOAgent(task, (data) => {
          setOutputs(prev => [...prev, data]);
        }));
      }

      if (agentsToRun.includes('Video Agent')) {
        promises.push(runVideoAgent(task, (data) => {
          setOutputs(prev => [...prev, data]);
        }));
      }
      
      await Promise.all(promises);
      
      useEventStore.getState().addEvent({
        agent: 'System',
        type: 'COMPLETED',
        message: 'All agents completed successfully.'
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface font-sans text-ink-deep">
      <NodeModal />
      {/* Header & Input */}
      <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between shrink-0 z-10 h-[60px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-mid flex items-center justify-center text-[13px]">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h1 className="text-[15px] font-semibold text-ink-deep tracking-tight">IdeaBrowser</h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe your marketing task (e.g., 'Launch campaign for new eco-friendly sneakers')"
              className="w-full px-4 py-3 bg-white border-[1.5px] border-[#d8d8ec] rounded-[10px] text-[15px] text-ink-deep placeholder-[#b0b0c8] focus:outline-none focus:border-brand-purple focus:ring-[3px] focus:ring-brand-purple/10 transition-all"
              disabled={isExecuting}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
          </div>
          <button
            onClick={handleExecute}
            disabled={isExecuting || !task.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#6c5dd3] via-[#8b5cf6] to-[#a855f7] text-white text-[15px] font-semibold rounded-[10px] hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(108,93,211,0.45)] shadow-[0_2px_12px_rgba(108,93,211,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-[-0.01em] whitespace-nowrap"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Execute <span className="transition-transform group-hover:translate-x-[3px]">→</span>
          </button>
          <button
            onClick={resetWorkflow}
            disabled={isExecuting}
            className="p-2 text-ink-light hover:text-brand-indigo hover:bg-surface-tint rounded-lg transition-all disabled:opacity-50"
            title="Reset Workflow"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex p-6 gap-6 max-w-[1100px] mx-auto w-full">
        {/* Left Column: React Flow */}
        <div className="flex-1 flex flex-col rounded-[16px] overflow-hidden border border-border bg-white shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
          <AgentPalette />
          <AgentMap />
        </div>

        {/* Right Column: Dashboards */}
        <div className="w-96 flex flex-col gap-6 shrink-0">
          <MetricsPanel />
          <div className="h-1/2 min-h-0">
            <OutputPanel outputs={outputs} />
          </div>
          <div className="h-1/2 min-h-0">
            <ReasoningConsole />
          </div>
        </div>
      </main>
    </div>
  );
}
