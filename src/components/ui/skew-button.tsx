import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skewedButtonVariants = cva(
  "inline-flex items-center justify-center font-rajdhani whitespace-nowrap text-white font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 shadow-[0px_4px_4px_0px_#00000040]",
  {
    variants: {
      variant: {
        red: "",
        green: ""
      },
      size: {
        sm:"h-[26px] px-4 py-0 text-xs rounded",
        md: "h-10 px-8 py-4 text-lg rounded-lg", 
        lg: "h-12 px-12 py-6 text-xl rounded-lg"
      },
    },
    defaultVariants: {
      variant: "red",
      size: "sm",
    },
  }
)

export interface SkewedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof skewedButtonVariants> {
  asChild?: boolean
  fullWidth?: boolean
  skew?: "left" | "right"
}

const SkewedButton = React.forwardRef<HTMLButtonElement, SkewedButtonProps>(
  ({ className, variant, size, fullWidth, skew = "right", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Apply skew transformation
    const skewClass = skew === "right" ? "transform skew-x-12" : "transform -skew-x-12"
    
    // Counter-skew text to keep it readable
    const textSkewClass = skew === "right" ? "transform -skew-x-12" : "transform skew-x-12"
    
    // Apply gradient backgrounds
    const gradientStyle = {
      background: variant === "red" 
        ? 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)'
        : 'linear-gradient(180deg, #B0FF2A 0%, #3E8100 100%)'
    }

    return (
      <Comp
        className={cn(
          skewedButtonVariants({ variant, size, className }), 
          skewClass,
          fullWidth ? "w-full" : ""
        )}
        style={gradientStyle}
        ref={ref}
        {...props}
      >
        <span className={textSkewClass}>
          {children}
        </span>
      </Comp>
    )
  }
)
SkewedButton.displayName = "SkewedButton"

export { SkewedButton, skewedButtonVariants }