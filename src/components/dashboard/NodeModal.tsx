import { useWorkflowStore } from '@/store/useWorkflowStore';
import { X } from 'lucide-react';

export function NodeModal() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeSystemPrompt } = useWorkflowStore();
  
  if (!selectedNodeId) return null;
  
  const node = nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;
  
  const { data } = node;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/20 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(26,26,46,0.12)] w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border bg-white">
          <h2 className="text-[18px] font-semibold text-ink-deep tracking-[-0.01em]">{data.agentName} Details</h2>
          <button onClick={() => setSelectedNodeId(null)} className="p-1.5 text-muted hover:text-ink-deep hover:bg-surface rounded-[8px] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Settings Section */}
          <section>
            <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] mb-4">Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.06em] mb-1.5">Agent Type</label>
                <div className="px-3.5 py-2.5 bg-surface border border-border rounded-[10px] text-[14px] font-medium text-ink-deep">
                  {data.agentName}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.06em] mb-1.5">Model</label>
                <div className="px-3.5 py-2.5 bg-surface border border-border rounded-[10px] text-[13px] font-mono text-ink-light">
                  {data.modelName}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.06em] mb-1.5">Status</label>
                <div className="px-3.5 py-2.5 bg-surface border border-border rounded-[10px] text-[14px] text-ink-light">
                  {data.status}
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.06em] mb-1.5">System Prompt</label>
              <textarea
                value={data.systemPrompt || ''}
                onChange={(e) => updateNodeSystemPrompt(selectedNodeId, e.target.value)}
                className="w-full px-4 py-3 bg-white border-[1.5px] border-[#d8d8ec] rounded-[12px] text-[14px] text-ink-deep placeholder-[#b0b0c8] focus:outline-none focus:border-brand-purple focus:ring-[3px] focus:ring-brand-purple/10 min-h-[120px] resize-y transition-all leading-[1.6]"
                placeholder="Enter system instructions for this agent..."
              />
            </div>
          </section>

          {/* Metrics Section */}
          <section>
            <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] mb-4">Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
                <div className="text-[11px] text-muted font-bold uppercase tracking-[0.06em] mb-1">Tokens Used</div>
                <div className="text-[20px] font-semibold text-ink-deep tracking-[-0.02em]">{data.tokens}</div>
              </div>
              <div className="bg-white p-4 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
                <div className="text-[11px] text-muted font-bold uppercase tracking-[0.06em] mb-1">Latency</div>
                <div className="text-[20px] font-semibold text-ink-deep tracking-[-0.02em]">{data.latency} ms</div>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section>
            <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] mb-4">Generated Output</h3>
            {data.output ? (
              <div className="bg-[#1a1a2e] rounded-[12px] p-5 overflow-x-auto border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
                <pre className="text-[13px] text-[#a5b4fc] font-mono leading-[1.6]">
                  {JSON.stringify(data.output, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-[14px] text-muted italic bg-surface p-5 rounded-[12px] border border-border text-center">
                No output generated yet. Run the workflow to see results.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
