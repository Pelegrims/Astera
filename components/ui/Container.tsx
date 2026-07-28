import { ReactNode } from "react";

const widths = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export function Container({
  children,
  className = "",
  width = "md",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof widths;
}) {
  return (
    <div className={`mx-auto w-full ${widths[width]} px-6 ${className}`}>
      {children}
    </div>
  );
}
