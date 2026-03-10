import { useEventStore } from '@/store/useEventStore';
import { Activity, Clock, Cpu } from 'lucide-react';

export function MetricsPanel() {
  const { totalTokens, totalLatency, activeAgents } = useEventStore();

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-ink-2 p-4 rounded-xl border border-border-1 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet rounded-lg">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-subtle font-medium">Active Agents</div>
          <div className="text-xl font-semibold text-white">{activeAgents.length}</div>
        </div>
      </div>
      
      <div className="bg-ink-2 p-4 rounded-xl border border-border-1 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-lg">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-subtle font-medium">Total Tokens</div>
          <div className="text-xl font-semibold text-white">{totalTokens.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-ink-2 p-4 rounded-xl border border-border-1 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-brand-amber/10 border border-brand-amber/20 text-brand-amber rounded-lg">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-subtle font-medium">Total Latency</div>
          <div className="text-xl font-semibold text-white">{(totalLatency / 1000).toFixed(2)}s</div>
        </div>
      </div>
    </div>
  );
}
