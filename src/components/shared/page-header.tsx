import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-primary hidden md:block md:h-7 md:w-7" />}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground mt-1 text-sm md:text-base">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex-shrink-0 w-full md:w-auto">{actions}</div>}
      </div>
    </div>
  );
}
