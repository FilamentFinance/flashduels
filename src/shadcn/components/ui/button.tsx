import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shadcn/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800/90',
        destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        outline: 'border border-zinc-800 bg-transparent hover:bg-zinc-800/50 hover:text-zinc-50',
        secondary: 'bg-zinc-800 text-zinc-50 hover:bg-zinc-700/90',
        ghost: 'hover:bg-zinc-800/50 hover:text-zinc-50',
        link: 'text-zinc-400 underline-offset-4 hover:text-zinc-50 hover:underline',
        pink: 'bg-[#F19ED2] text-white hover:opacity-90',
        pinkOutline: 'text-[#F19ED2] border border-[#F19ED2]/20 hover:bg-[#F19ED2]/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
