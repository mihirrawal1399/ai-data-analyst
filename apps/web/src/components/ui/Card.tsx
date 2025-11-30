import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva(
    'rounded-lg transition-all duration-200',
    {
        variants: {
            variant: {
                glass: 'glass-surface hover:shadow-glow',
                solid: 'bg-surface border border-border',
                neon: 'neon-border bg-surface/50',
            },
            padding: {
                none: '',
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
            },
        },
        defaultVariants: {
            variant: 'glass',
            padding: 'md',
        },
    }
);

export interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, padding }), className)}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

export { Card, cardVariants };
