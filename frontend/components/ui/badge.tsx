import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md",
        secondary: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300",
        destructive: "border-transparent bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md",
        success: "border-transparent bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md",
        warning: "border-transparent bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md",
        outline: "text-gray-700 border-2 border-gray-300 bg-white hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

