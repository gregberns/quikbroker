import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarSrc?: string;
  className?: string;
}

export function Testimonial({
  quote,
  author,
  role,
  company,
  avatarSrc,
  className,
}: TestimonialProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4 text-3xl text-muted-foreground">&quot;</div>
          <p className="flex-grow text-muted-foreground mb-6">
            {quote}
          </p>
          <div className="flex items-center">
            {avatarSrc ? (
              <div className="mr-4 flex-shrink-0">
                <Image
                  src={avatarSrc}
                  alt={author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="mr-4 flex-shrink-0 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center">
                {author.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{author}</p>
              <p className="text-sm text-muted-foreground">
                {role}, {company}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TestimonialSectionProps {
  testimonials: TestimonialProps[];
  className?: string;
}

export function TestimonialSection({ testimonials, className }: TestimonialSectionProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {testimonials.map((testimonial, index) => (
        <Testimonial key={index} {...testimonial} />
      ))}
    </div>
  );
}