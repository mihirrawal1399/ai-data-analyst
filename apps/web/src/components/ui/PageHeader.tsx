import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('mb-8', className)}>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">{title}</h1>
                    {description && (
                        <p className="text-muted text-lg">{description}</p>
                    )}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-primary-1 via-primary-2 to-transparent" />
        </div>
    );
}
