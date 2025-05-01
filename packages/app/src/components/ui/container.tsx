import React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "small" | "large"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6",
          size === "small" ? "max-w-3xl" : size === "large" ? "max-w-7xl" : "max-w-5xl",
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }