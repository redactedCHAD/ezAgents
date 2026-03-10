import { useWorkflowStore } from '@/store/useWorkflowStore';
import { X } from 'lucide-react';

export function NodeModal() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeSystemPrompt } = useWorkflowStore();
  
  if (!selectedNodeId) return null;
  
  const node = nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;
  
  const { data } = node;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-ink-2 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-border-1">
        <div className="flex items-center justify-between p-4 border-b border-border-1 bg-ink-3">
          <h2 className="text-lg font-semibold text-white">{data.agentName} Details</h2>
          <button onClick={() => setSelectedNodeId(null)} className="p-1 text-subtle hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Settings Section */}
          <section>
            <h3 className="text-sm font-bold text-subtle uppercase tracking-wider mb-3">Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Agent Type</label>
                <div className="px-3 py-2 bg-ink-3 border border-border-2 rounded-lg text-sm font-medium text-white">
                  {data.agentName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Model</label>
                <div className="px-3 py-2 bg-ink-3 border border-border-2 rounded-lg text-sm font-mono text-body">
                  {data.modelName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Status</label>
                <div className="px-3 py-2 bg-ink-3 border border-border-2 rounded-lg text-sm text-body">
                  {data.status}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-medium text-muted mb-1">System Prompt</label>
              <textarea
                value={data.systemPrompt || ''}
                onChange={(e) => updateNodeSystemPrompt(selectedNodeId, e.target.value)}
                className="w-full px-3 py-2 bg-ink-3 border border-border-2 rounded-lg text-sm text-white placeholder-muted focus:outline-none focus:border-brand-violet min-h-[100px] resize-y transition-colors"
                placeholder="Enter system instructions for this agent..."
              />
            </div>
          </section>

          {/* Metrics Section */}
          <section>
            <h3 className="text-sm font-bold text-subtle uppercase tracking-wider mb-3">Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ink-3 p-3 rounded-lg border border-border-2">
                <div className="text-xs text-muted mb-1">Tokens Used</div>
                <div className="font-semibold text-white">{data.tokens}</div>
              </div>
              <div className="bg-ink-3 p-3 rounded-lg border border-border-2">
                <div className="text-xs text-muted mb-1">Latency</div>
                <div className="font-semibold text-white">{data.latency} ms</div>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section>
            <h3 className="text-sm font-bold text-subtle uppercase tracking-wider mb-3">Generated Output</h3>
            {data.output ? (
              <div className="bg-ink-3 rounded-lg p-4 overflow-x-auto border border-border-2">
                <pre className="text-xs text-brand-green font-mono">
                  {JSON.stringify(data.output, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-sm text-muted italic bg-ink-3 p-4 rounded-lg border border-border-2">
                No output generated yet. Run the workflow to see results.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
