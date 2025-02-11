'use client';

import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { FC } from 'react';

interface DialogProps {
  trigger: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Dialog: FC<DialogProps> = ({
  trigger,
  title,
  children,
  maxWidth = 'max-w-sm',
  className = '',
}) => {
  return (
    <DialogPrimitive>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`${maxWidth} bg-zinc-900 border-zinc-700 ${className}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-left">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogPrimitive>
  );
};
