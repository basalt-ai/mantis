import * as React from "react";

export type CardVariant = "outline" | "brand" | "brand-alt-1" | "brand-alt-2";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outline", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={["card", className].filter(Boolean).join(" ")}
      data-variant={variant === "outline" ? undefined : variant}
      {...rest}
    >
      {children}
    </div>
  );
});
