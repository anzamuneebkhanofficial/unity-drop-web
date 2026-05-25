/** @format */
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

function Dialog({ ...props }) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-[9999] bg-bg/80 data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'bg-surface/95 backdrop-blur-2xl text-white border border-white/5 fixed top-1/2 left-1/2 z-[9999] grid w-full max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)] duration-200 sm:max-w-4xl lg:max-w-5xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-6 right-6 bg-surface-2 text-white hover:bg-highlight hover:text-black p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-highlight/50 [&_svg]:w-5 [&_svg]:h-5">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-lg font-semibold text-highlight leading-none',
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};

function DialogClose({ ...props }) {
  return (
    <DialogPrimitive.Close
      {...props}
      className={cn(
        buttonVariants(),
        'bg-black text-white hover:bg-highlight p-2 rounded transition-colors'
      )}
    />
  );
}
