import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import { Terminal } from 'lucide-react';

export function ReasoningConsole() {
  const events = useEventStore((state) => state.events);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-white text-ink-deep rounded-[16px] overflow-hidden border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border">
        <Terminal className="w-4 h-4 text-brand-indigo" />
        <h3 className="text-[14px] font-semibold text-ink-deep">Reasoning Console</h3>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12px] space-y-2 bg-[#1a1a2e] text-[#a5b4fc]">
        {events.length === 0 ? (
          <div className="text-[#64748b] italic">Waiting for execution to start...</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex gap-3">
              <span className="text-[#64748b] shrink-0">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div>
                <span className={`font-semibold ${
                  event.agent === 'Orchestrator' ? 'text-[#a855f7]' :
                  event.agent === 'Copy Agent' ? 'text-[#3b82f6]' :
                  event.agent === 'Image Agent' ? 'text-[#10b981]' :
                  event.agent === 'SEO Agent' ? 'text-[#f59e0b]' :
                  event.agent === 'Video Agent' ? 'text-[#db2777]' : 'text-[#94a3b8]'
                }`}>
                  [{event.agent}]
                </span>{' '}
                <span className={event.type === 'ERROR' ? 'text-[#ef4444]' : 'text-[#a5b4fc]'}>
                  {event.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
