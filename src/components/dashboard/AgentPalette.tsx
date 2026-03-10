import React from 'react';
import { Copy, Image as ImageIcon, Search, Video } from 'lucide-react';

export function AgentPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string, agentName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/agentName', agentName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white p-4 border-b border-border">
      <h3 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] mb-3">Agent Palette (Drag & Drop)</h3>
      <div className="flex gap-2 flex-wrap">
        <div
          className="group flex items-center gap-2 px-3 py-2 bg-white border-[1.5px] border-border rounded-[10px] cursor-grab hover:border-[#c0b8f8] hover:bg-[#fafafe] transition-all"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Copy Agent')}
          draggable
        >
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#f3f3f8] flex items-center justify-center group-hover:bg-[#ede9fe] transition-colors">
            <Copy className="w-4 h-4 text-[#3b82f6]" />
          </div>
          <span className="text-[14px] font-medium text-ink-medium">Copy Agent</span>
        </div>
        <div
          className="group flex items-center gap-2 px-3 py-2 bg-white border-[1.5px] border-border rounded-[10px] cursor-grab hover:border-[#c0b8f8] hover:bg-[#fafafe] transition-all"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Image Agent')}
          draggable
        >
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#f3f3f8] flex items-center justify-center group-hover:bg-[#ede9fe] transition-colors">
            <ImageIcon className="w-4 h-4 text-[#10b981]" />
          </div>
          <span className="text-[14px] font-medium text-ink-medium">Image Agent</span>
        </div>
        <div
          className="group flex items-center gap-2 px-3 py-2 bg-white border-[1.5px] border-border rounded-[10px] cursor-grab hover:border-[#c0b8f8] hover:bg-[#fafafe] transition-all"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'SEO Agent')}
          draggable
        >
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#f3f3f8] flex items-center justify-center group-hover:bg-[#ede9fe] transition-colors">
            <Search className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <span className="text-[14px] font-medium text-ink-medium">SEO Agent</span>
        </div>
        <div
          className="group flex items-center gap-2 px-3 py-2 bg-white border-[1.5px] border-border rounded-[10px] cursor-grab hover:border-[#c0b8f8] hover:bg-[#fafafe] transition-all"
          onDragStart={(event) => onDragStart(event, 'agentNode', 'Video Agent')}
          draggable
        >
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#f3f3f8] flex items-center justify-center group-hover:bg-[#ede9fe] transition-colors">
            <Video className="w-4 h-4 text-[#db2777]" />
          </div>
          <span className="text-[14px] font-medium text-ink-medium">Video Agent</span>
        </div>
      </div>
    </div>
  );
}
