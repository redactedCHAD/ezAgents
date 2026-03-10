import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { CustomNode } from './CustomNode';

const nodeTypes: NodeTypes = {
  agentNode: CustomNode,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const agentName = event.dataTransfer.getData('application/agentName');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let defaultSystemPrompt = 'You are a helpful AI agent.';
      if (agentName === 'Copy Agent') {
        defaultSystemPrompt = 'You are an expert marketing copywriter. Generate a catchy headline, an engaging post body, and relevant hashtags.';
      } else if (agentName === 'Image Agent') {
        defaultSystemPrompt = 'You are an expert visual director. Generate a detailed image prompt, a social media caption for the image, and alt text.';
      } else if (agentName === 'SEO Agent') {
        defaultSystemPrompt = 'You are an SEO expert. Generate optimized keywords, meta descriptions, and search intent analysis.';
      } else if (agentName === 'Video Agent') {
        defaultSystemPrompt = 'You are a video producer. Generate a storyboard, script, and visual directions for a short video.';
      }

      const newNode = {
        id: `${agentName.toLowerCase().replace(' ', '-')}-${Date.now()}`,
        type,
        position,
        data: {
          agentName,
          modelName: 'gemini-3-flash-preview',
          status: 'Idle' as const,
          tokens: 0,
          latency: 0,
          systemPrompt: defaultSystemPrompt,
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="w-full h-full bg-ink-2" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-ink-2"
      >
        <Background color="rgba(255,255,255,0.05)" gap={16} />
        <Controls className="bg-ink-3 border-border-1 shadow-sm fill-body" />
        <MiniMap nodeStrokeColor="rgba(255,255,255,0.1)" nodeColor="#1c1f2e" maskColor="rgba(10,11,16,0.7)" />
      </ReactFlow>
    </div>
  );
}

export function AgentMap() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
