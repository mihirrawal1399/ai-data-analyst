import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary-1 text-white hover:shadow-neon hover:scale-105',
                secondary: 'bg-secondary-1 text-white hover:shadow-glow hover:scale-105',
                ghost: 'hover:bg-surface hover:text-primary-1',
                outline: 'border border-primary-1 text-primary-1 hover:bg-primary-1 hover:text-white',
            },
            size: {
                sm: 'h-9 px-3 text-sm',
                md: 'h-10 px-4 py-2',
                lg: 'h-11 px-8 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface NeonButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);

NeonButton.displayName = 'NeonButton';

export { NeonButton, buttonVariants };
