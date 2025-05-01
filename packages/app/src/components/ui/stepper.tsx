import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProps {
  title: string;
  description?: string;
  status?: "completed" | "current" | "upcoming";
}

interface StepperProps {
  currentStep: number;
  children: React.ReactNode;
}

export const Step = ({ title, description, status = "upcoming" }: StepProps) => {
  return (
    <div className="flex flex-col items-center">
      {/* Step component structure defined but is controlled by the Stepper parent */}
      <div data-title={title} data-description={description} data-status={status} />
    </div>
  );
};

export const Stepper: React.FC<StepperProps> = ({ currentStep, children }) => {
  // Filter out non-Step children and only take Step components
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child.type as any).name === "Step"
  ) as React.ReactElement[];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          // Extract props from the Step component
          const { title, description } = step.props as StepProps;
          
          // Determine the status of this step
          let status: "completed" | "current" | "upcoming" = "upcoming";
          if (index < currentStep) status = "completed";
          if (index === currentStep) status = "current";
          
          // Get the appropriate styles based on status
          const circleStyles = {
            completed: "bg-primary text-primary-foreground border-primary",
            current: "bg-primary text-primary-foreground border-primary",
            upcoming: "bg-muted text-muted-foreground border-muted-foreground",
          };
          
          const titleStyles = {
            completed: "text-foreground",
            current: "text-foreground font-medium",
            upcoming: "text-muted-foreground",
          };
          
          const descriptionStyles = {
            completed: "text-muted-foreground",
            current: "text-muted-foreground",
            upcoming: "text-muted-foreground opacity-80",
          };

          return (
            <div key={index} className="flex flex-col items-center relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute h-[2px] top-4 w-full right-0" style={{ width: "calc(100% - 2rem)", left: "50%" }}>
                  <div
                    className={cn(
                      "h-full w-full",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                </div>
              )}
              
              {/* Circle with number or check icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 mb-2",
                  circleStyles[status]
                )}
              >
                {status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step title */}
              <div
                className={cn(
                  "text-sm mt-1",
                  titleStyles[status]
                )}
              >
                {title}
              </div>
              
              {/* Optional description */}
              {description && (
                <div
                  className={cn(
                    "text-xs mt-1 max-w-[120px] text-center",
                    descriptionStyles[status]
                  )}
                >
                  {description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};