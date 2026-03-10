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
    <div className="flex flex-col h-screen bg-ink font-sans text-body">
      <NodeModal />
      {/* Header & Input */}
      <header className="bg-ink-2 border-b border-border-1 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-brand-violet to-brand-blue p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-serif text-white tracking-tight">ezAgents AI</h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8 flex items-center gap-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe your marketing task (e.g., 'Launch campaign for new eco-friendly sneakers')"
            className="flex-1 px-4 py-2 bg-ink-3 border border-border-2 rounded-lg text-white placeholder-muted focus:outline-none focus:border-brand-violet transition-colors"
            disabled={isExecuting}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          />
          <button
            onClick={handleExecute}
            disabled={isExecuting || !task.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-brand-violet to-brand-blue text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Execute
          </button>
          <button
            onClick={resetWorkflow}
            disabled={isExecuting}
            className="p-2 text-subtle hover:text-white hover:bg-white/5 border border-transparent hover:border-border-2 rounded-lg transition-all disabled:opacity-50"
            title="Reset Workflow"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex p-4 gap-4">
        {/* Left Column: React Flow */}
        <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-border-1 bg-ink-2">
          <AgentPalette />
          <AgentMap />
        </div>

        {/* Right Column: Dashboards */}
        <div className="w-96 flex flex-col gap-4 shrink-0">
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
