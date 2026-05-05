import * as React from "react";

export type PageSectionVariant = "default" | "alt";

export type PageSectionProps = React.HTMLAttributes<HTMLElement> & {
  variant?: PageSectionVariant;
};

export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(function PageSection(
  { variant = "default", className, children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      className={["page-section", className].filter(Boolean).join(" ")}
      data-variant={variant === "alt" ? "alt" : undefined}
      {...rest}
    >
      <div className="page-section-content">{children}</div>
    </section>
  );
});
