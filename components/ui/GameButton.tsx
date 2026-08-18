"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "ghost" | "accent" | "solid";

const BASE =
  "inline-block font-[family-name:var(--font-display)] tracking-[3px] " +
  "text-[15px] px-5 py-2.5 border-2 transition-colors duration-150 select-none";

const VARIANTS: Record<Variant, string> = {
  ghost: "border-ink text-ink hover:bg-ink hover:text-bg",
  accent: "border-accent text-accent hover:bg-accent hover:text-bg",
  solid: "border-accent bg-accent text-bg hover:bg-ink hover:border-ink",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Angular arcade-style button. Renders an <a> when `href` is given. */
export function GameButton(props: ButtonProps | LinkProps) {
  const { variant = "ghost", className = "", ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as LinkProps;
    return <a href={href} className={cls} {...anchorRest} />;
  }
  return (
    <button
      type="button"
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
