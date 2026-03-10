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
    <div className="flex flex-col h-full bg-ink-3 text-body rounded-xl overflow-hidden border border-border-1 shadow-lg">
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-2 border-b border-border-1">
        <Terminal className="w-4 h-4 text-brand-violet" />
        <h3 className="text-sm font-medium text-white">Reasoning Console</h3>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
        {events.length === 0 ? (
          <div className="text-muted italic">Waiting for execution to start...</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex gap-3">
              <span className="text-subtle shrink-0">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div>
                <span className={`font-semibold ${
                  event.agent === 'Orchestrator' ? 'text-brand-violet' :
                  event.agent === 'Copy Agent' ? 'text-brand-blue-light' :
                  event.agent === 'Image Agent' ? 'text-brand-green' : 'text-subtle'
                }`}>
                  [{event.agent}]
                </span>{' '}
                <span className={event.type === 'ERROR' ? 'text-brand-pink' : 'text-body'}>
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
