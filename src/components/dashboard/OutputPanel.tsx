import { FileText, Image as ImageIcon } from 'lucide-react';

export function OutputPanel({ outputs }: { outputs: any[] }) {
  const copyOutput = outputs.find(o => o.type === 'copy')?.data;
  const imageOutput = outputs.find(o => o.type === 'image')?.data;

  return (
    <div className="flex flex-col h-full bg-ink-2 rounded-xl overflow-hidden border border-border-1 shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-3 border-b border-border-1">
        <FileText className="w-4 h-4 text-subtle" />
        <h3 className="text-sm font-medium text-white">Generated Assets</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {outputs.length === 0 && (
          <div className="text-center text-muted mt-10">
            No assets generated yet.
          </div>
        )}

        {copyOutput && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-subtle uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3 h-3" /> Copy
            </h4>
            <div className="bg-ink-3 p-4 rounded-lg border border-border-2">
              <h5 className="font-bold text-white mb-2">{copyOutput.headline}</h5>
              <p className="text-body whitespace-pre-wrap text-sm mb-3">{copyOutput.post}</p>
              <div className="flex flex-wrap gap-2">
                {copyOutput.hashtags?.map((tag: string, i: number) => (
                  <span key={i} className="text-xs font-medium text-brand-blue-light bg-brand-blue/10 border border-brand-blue/20 px-2 py-1 rounded-full">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {imageOutput && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-subtle uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Image Prompt
            </h4>
            <div className="bg-ink-3 p-4 rounded-lg border border-border-2">
              <div className="mb-3">
                <div className="text-xs text-muted mb-1 font-medium">Prompt</div>
                <p className="text-sm text-body italic">"{imageOutput.image_prompt}"</p>
              </div>
              <div className="mb-3">
                <div className="text-xs text-muted mb-1 font-medium">Caption</div>
                <p className="text-sm text-body">{imageOutput.caption}</p>
              </div>
              <div>
                <div className="text-xs text-muted mb-1 font-medium">Alt Text</div>
                <p className="text-sm text-subtle">{imageOutput.alt_text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
