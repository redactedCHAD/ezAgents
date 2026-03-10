import React from 'react';
import { Copy, Image as ImageIcon, Search, Video } from 'lucide-react';

export function AgentPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string, agentName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/agentName', agentName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-ink-3 p-4 border-b border-border-1">
      <h3 className="text-sm font-medium text-subtle mb-3">Agent Palette (Drag & Drop)</h3>
      <div className="flex gap-2 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 bg-ink-2 border border-border-2 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Copy Agent')}
          draggable
        >
          <Copy className="w-4 h-4 text-brand-blue-light" />
          <span className="text-sm font-medium text-body">Copy Agent</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-ink-2 border border-border-2 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Image Agent')}
          draggable
        >
          <ImageIcon className="w-4 h-4 text-brand-green" />
          <span className="text-sm font-medium text-body">Image Agent</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-ink-2 border border-border-2 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'SEO Agent')}
          draggable
        >
          <Search className="w-4 h-4 text-brand-amber" />
          <span className="text-sm font-medium text-body">SEO Agent</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-ink-2 border border-border-2 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Video Agent')}
          draggable
        >
          <Video className="w-4 h-4 text-brand-pink" />
          <span className="text-sm font-medium text-body">Video Agent</span>
        </div>
      </div>
    </div>
  );
}
