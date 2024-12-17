import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@core/lib/utils";
import { useEditorStore } from "@core/store/editor";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "shadow hover:opacity-70",
        destructive: "shadow-sm hover:opacity-70",
        outline: "border shadow-sm hover:opacity-70",
        secondary: "shadow-sm hover:opacity-70",
        ghost: "hover:opacity-70",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const { getCurrentTheme } = useEditorStore();
    const theme = getCurrentTheme();
    const Comp = asChild ? Slot : "button";

    const getVariantStyles = () => {
      switch (variant) {
        case "default":
          return {
            backgroundColor: theme.ui.accent,
            color: theme.ui.background,
          };
        case "destructive":
          return {
            backgroundColor: theme.ui.error,
            color: theme.ui.background,
          };
        case "outline":
          return {
            borderColor: theme.ui.border,
            color: theme.ui.foreground,
            backgroundColor: "transparent",
          };
        case "secondary":
          return {
            backgroundColor: theme.ui.muted,
            color: theme.ui.background,
          };
        case "ghost":
          return {
            color: theme.ui.foreground,
            backgroundColor: "transparent",
          };
        case "link":
          return {
            color: theme.ui.accent,
            backgroundColor: "transparent",
          };
        default:
          return {};
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          ...getVariantStyles(),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
