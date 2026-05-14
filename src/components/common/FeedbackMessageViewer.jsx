'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

export default function FeedbackMessageViewer({ message = '', maxLength = 150 }) {
  const [open, setOpen] = useState(false);

  const isLong = message.length > maxLength;
  const displayMessage = isLong ? message.slice(0, maxLength) + '...' : message;

  return (
    <div className="flex flex-col gap-2 items-start">
      <p className="text-xs text-text-muted font-medium break-words">
        {displayMessage}
      </p>
      {isLong && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-highlight hover:text-highlight/80 transition-colors py-1">
              <Eye className="w-3.5 h-3.5" /> View More
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-surface border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Eye className="w-6 h-6 text-highlight" /> 
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Full Feedback Message</span>
                </DialogTitle>
              </DialogHeader>
            </div>
            
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 min-h-[200px] max-h-[60vh]">
              <p className="text-base text-white/90 leading-relaxed font-medium whitespace-pre-wrap break-words">
                {message}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
