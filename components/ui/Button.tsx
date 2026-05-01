import * as React from "react";

export type ButtonVariant = "brand" | "subtle" | "alternative" | "outline" | "negative" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "brand", size = "md", className, type = "button", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={["button", className].filter(Boolean).join(" ")}
      data-variant={variant === "brand" ? undefined : variant}
      data-size={size === "md" ? undefined : size}
      {...rest}
    >
      {children}
    </button>
  );
});
