import { useEventStore } from '@/store/useEventStore';
import { Activity, Clock, Cpu } from 'lucide-react';

export function MetricsPanel() {
  const { totalTokens, totalLatency, activeAgents } = useEventStore();

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white p-3 rounded-[16px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)] flex flex-col items-start gap-3">
        <div className="p-2.5 bg-surface-tint border border-[#c4b5fd] text-brand-indigo rounded-[10px]">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-muted font-bold uppercase tracking-[0.06em] mb-0.5">Active</div>
          <div className="text-[20px] font-semibold text-ink-deep tracking-[-0.02em] leading-none">{activeAgents.length}</div>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-[16px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)] flex flex-col items-start gap-3">
        <div className="p-2.5 bg-[#dcfce7] border border-[#86efac] text-[#14532d] rounded-[10px]">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-muted font-bold uppercase tracking-[0.06em] mb-0.5">Tokens</div>
          <div className="text-[20px] font-semibold text-ink-deep tracking-[-0.02em] leading-none">{totalTokens.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-[16px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)] flex flex-col items-start gap-3">
        <div className="p-2.5 bg-[#fef3c7] border border-[#fcd34d] text-[#92400e] rounded-[10px]">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-muted font-bold uppercase tracking-[0.06em] mb-0.5">Latency</div>
          <div className="text-[20px] font-semibold text-ink-deep tracking-[-0.02em] leading-none">{(totalLatency / 1000).toFixed(1)}s</div>
        </div>
      </div>
    </div>
  );
}
