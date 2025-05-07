import { ShieldCheck, Lock, FileCheck, BadgeCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustItem({ icon, title, description }: TrustItemProps) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-4 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface TrustSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export function TrustSection({
  title = "Security & Compliance You Can Trust",
  description = "QuikBroker takes security and regulatory compliance seriously. Our platform is built with the highest security standards to protect your data and ensure compliance with industry regulations.",
  className,
}: TrustSectionProps) {
  // Trust items can be easily edited by marketing team
  const trustItems: TrustItemProps[] = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Enterprise-Grade Security",
      description: "End-to-end encryption for all data with regular security audits and industry best practices."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Protection",
      description: "Your data is protected with industry-leading security measures and strict access controls."
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Regulatory Compliance",
      description: "Automated compliance with transportation industry regulations and standards."
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Carrier Verification",
      description: "Thorough verification process to ensure all carriers are legitimate and properly insured."
    },
  ];

  return (
    <div className={cn("py-12 bg-accent/10", className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>
        
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {trustItems.map((item, index) => (
              <TrustItem 
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
          
          {/* Security badges removed as requested */}
        </div>
      </div>
    </div>
  );
}