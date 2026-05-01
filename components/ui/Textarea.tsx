import * as React from "react";

export type TextareaSize = "sm" | "md" | "lg";

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  size?: TextareaSize;
  error?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = "md", error = false, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={["textarea", className].filter(Boolean).join(" ")}
      data-size={size === "md" ? undefined : size}
      data-err={error ? "" : undefined}
      {...rest}
    />
  );
});
