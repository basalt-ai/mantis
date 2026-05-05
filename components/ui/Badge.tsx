import * as React from "react";

export type BadgeVariant =
  | "neutral"
  | "inverted"
  | "brand"
  | "brand-alt-1"
  | "brand-alt-2"
  | "success"
  | "warning"
  | "negative";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={["badge", className].filter(Boolean).join(" ")}
      data-variant={variant === "neutral" ? undefined : variant}
      {...rest}
    >
      {children}
    </span>
  );
});
