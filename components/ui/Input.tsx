import * as React from "react";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  error?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", error = false, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={["input", className].filter(Boolean).join(" ")}
      data-size={size === "md" ? undefined : size}
      data-err={error ? "" : undefined}
      {...rest}
    />
  );
});
