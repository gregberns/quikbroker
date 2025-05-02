import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CtaSectionProps {
  title: string;
  description: string;
  primaryAction: {
    text: string;
    href: { pathname: string };
  };
  secondaryAction?: {
    text: string;
    href: { pathname: string };
  };
  className?: string;
}

export function CtaSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: CtaSectionProps) {
  return (
    <div className={cn("bg-primary/5 py-16 md:py-24", className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 flex-col sm:flex-row">
            <Button asChild size="lg">
              <Link href={primaryAction.href}>{primaryAction.text}</Link>
            </Button>
            {secondaryAction && (
              <Button asChild variant="outline" size="lg">
                <Link href={secondaryAction.href}>{secondaryAction.text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}