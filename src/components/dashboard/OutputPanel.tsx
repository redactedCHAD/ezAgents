import { FileText, Image as ImageIcon, Search, Video } from 'lucide-react';

export function OutputPanel({ outputs }: { outputs: any[] }) {
  const copyOutput = outputs.find(o => o.type === 'copy')?.data;
  const imageOutput = outputs.find(o => o.type === 'image')?.data;
  const seoOutput = outputs.find(o => o.type === 'seo')?.data;
  const videoOutput = outputs.find(o => o.type === 'video')?.data;

  return (
    <div className="flex flex-col h-full bg-white rounded-[16px] overflow-hidden border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border">
        <FileText className="w-4 h-4 text-brand-indigo" />
        <h3 className="text-[14px] font-semibold text-ink-deep">Generated Assets</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {outputs.length === 0 && (
          <div className="text-center text-muted mt-10 text-[14px]">
            No assets generated yet.
          </div>
        )}

        {copyOutput && (
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] flex items-center gap-2">
              <FileText className="w-3 h-3" /> Copy
            </h4>
            <div className="bg-white p-5 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
              <h5 className="font-semibold text-[16px] text-ink-deep mb-2 tracking-[-0.01em]">{copyOutput.headline}</h5>
              <p className="text-ink-light whitespace-pre-wrap text-[14px] mb-4 leading-[1.65]">{copyOutput.post}</p>
              <div className="flex flex-wrap gap-2">
                {copyOutput.hashtags?.map((tag: string, i: number) => (
                  <span key={i} className="text-[11px] font-bold text-[#1e40af] bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] border border-[#93c5fd] px-2.5 py-1 rounded-full uppercase tracking-[0.03em]">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {imageOutput && (
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Image Prompt
            </h4>
            <div className="bg-white p-5 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
              <div className="mb-4">
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Prompt</div>
                <p className="text-[14px] text-ink-light italic leading-[1.65]">"{imageOutput.image_prompt}"</p>
              </div>
              <div className="mb-4">
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Caption</div>
                <p className="text-[14px] text-ink-light leading-[1.65]">{imageOutput.caption}</p>
              </div>
              <div>
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Alt Text</div>
                <p className="text-[13px] text-muted leading-[1.6]">{imageOutput.alt_text}</p>
              </div>
            </div>
          </div>
        )}
        {seoOutput && (
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] flex items-center gap-2">
              <Search className="w-3 h-3" /> SEO Strategy
            </h4>
            <div className="bg-white p-5 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
              <div className="mb-4">
                <div className="text-[11px] text-muted mb-2 font-bold uppercase tracking-[0.06em]">Primary Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {seoOutput.primary_keywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-[11px] font-bold text-[#92400e] bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#fcd34d] px-2.5 py-1 rounded-full uppercase tracking-[0.03em]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-[11px] text-muted mb-2 font-bold uppercase tracking-[0.06em]">Secondary Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {seoOutput.secondary_keywords?.map((kw: string, i: number) => (
                    <span key={i} className="text-[11px] font-bold text-brand-indigo bg-surface-tint border border-[#c4b5fd] px-2.5 py-1 rounded-full uppercase tracking-[0.03em]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Meta Description</div>
                <p className="text-[14px] text-ink-light leading-[1.65]">{seoOutput.meta_description}</p>
              </div>
              <div>
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Search Intent</div>
                <p className="text-[13px] text-muted leading-[1.6]">{seoOutput.search_intent}</p>
              </div>
            </div>
          </div>
        )}

        {videoOutput && (
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-muted uppercase tracking-[0.06em] flex items-center gap-2">
              <Video className="w-3 h-3" /> Video Storyboard
            </h4>
            <div className="bg-white p-5 rounded-[12px] border border-border shadow-[0_1px_3px_rgba(26,26,46,0.04)]">
              <div className="mb-5">
                <div className="text-[11px] text-muted mb-3 font-bold uppercase tracking-[0.06em]">Scenes</div>
                <div className="space-y-3">
                  {videoOutput.storyboard_scenes?.map((scene: any, i: number) => (
                    <div key={i} className="bg-surface p-4 rounded-[10px] border border-border">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[12px] font-bold text-[#db2777] uppercase tracking-[0.06em]">Scene {scene.scene_number}</span>
                        <span className="text-[12px] font-medium text-muted">{scene.duration_seconds}s</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1 font-bold">Visual</div>
                          <p className="text-[13px] text-ink-light leading-[1.6]">{scene.visual}</p>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1 font-bold">Audio</div>
                          <p className="text-[13px] text-ink-light leading-[1.6]">{scene.audio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted mb-1 font-bold uppercase tracking-[0.06em]">Directorial Notes</div>
                <p className="text-[13px] text-muted italic leading-[1.6]">{videoOutput.directorial_notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
