'use client';

import {
  DialogClose,
  DialogContent,
  DialogHeader,
  Dialog as DialogPrimitive,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { cn } from '@/shadcn/lib/utils';
import { X } from 'lucide-react';
import { FC } from 'react';

interface DialogProps {
  trigger: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?:
    | 'max-w-sm'
    | 'max-w-md'
    | 'max-w-lg'
    | 'max-w-xl'
    | 'max-w-2xl'
    | 'max-w-3xl'
    | 'max-w-4xl'
    | 'max-w-5xl'
    | 'max-w-6xl'
    | 'max-w-7xl';
  className?: string;
}

export const Dialog: FC<DialogProps> = ({
  trigger,
  title,
  children,
  maxWidth = 'max-w-md',
  className = '',
}) => {
  return (
    <DialogPrimitive>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          maxWidth,
          'bg-zinc-900 border-zinc-700',
          'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
          'max-h-[90vh] flex flex-col',
          'p-0',
          'rounded-xl',
          className,
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="w-8" /> {/* Spacer to balance the close button */}
          <DialogTitle className="text-2xl font-medium">{title}</DialogTitle>
          <DialogClose className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors">
            <X className="h-5 w-5 text-zinc-400" />
          </DialogClose>
        </DialogHeader>
        <div className="p-6 overflow-y-auto">{children}</div>
      </DialogContent>
    </DialogPrimitive>
  );
};
