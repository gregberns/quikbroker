import { cn } from '@/lib/utils';

interface StatProps {
  value: string;
  label: string;
  description?: string;
}

function Stat({ value, label, description }: StatProps) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-lg font-medium">{label}</div>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

interface StatsSectionProps {
  stats: StatProps[];
  title?: string;
  description?: string;
  className?: string;
}

export function StatsSection({
  stats,
  title,
  description,
  className,
}: StatsSectionProps) {
  return (
    <div className={cn("py-16 bg-muted/30", className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {(title || description) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
            {description && <p className="text-muted-foreground text-lg">{description}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Stat
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}