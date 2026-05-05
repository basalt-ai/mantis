import * as React from "react";

export type ToastVariant = "outline" | "inverted" | "success" | "warning" | "error";

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: ToastVariant;
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = "outline", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={["toast", className].filter(Boolean).join(" ")}
      data-variant={variant === "outline" ? undefined : variant}
      {...rest}
    >
      {children}
    </div>
  );
});
