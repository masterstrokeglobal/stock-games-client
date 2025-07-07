
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:bg-transparent",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white shadow-sm hover:bg-green-600",
        "game-secondary": "bg-tertiary text-white justify-start border border-[#EFF8FF17]",
        "game-tertiary": "bg-primary-game text-white justify-start border border-[#0053B7]",
        "game-quaternary": "bg-[#0053B7] text-white justify-start border border-[#00214E]",
        "platform-primary": "dark:bg-[#753CFF] bg-white dark:text-white text-primary-game justify-start",
        "platform-outline": "border dark:border-platform-border border-primary-game dark:text-white text-[#142553] !rounded-none",
        "platform-gradient": "bg-[linear-gradient(90deg,#040029_0%,#4467CC_50%,#040029_100%)] text-white justify-start border border-[#]",
        "platform-gradient-secondary": "w-full text-platform-text bg-gradient-to-r dark:from-[#3B4BFF] dark:to-[#262BB5] from-[#64B6FD] to-[#466CCF] rounded-md font-semibold text-lg py-3 border-2 dark:border-platform-border border-primary-game hover:from-[#4B5BFF] hover:to-[#3B3BC5] transition-all",
        game: "bg-gradient-to-b from-[var(--bet-button-start)] via-[var(--bet-button-mid)] to-[var(--bet-button-end)] border border-[var(--bet-button-border)] text-white h-14"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 text-md tracking-wide rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), fullWidth ? "w-full" : "")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
