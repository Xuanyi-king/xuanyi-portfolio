import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number} /</span>
      {children}
    </p>
  );
}
export function TextLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const content = (
    <>
      {children}
      <span className="link-arrow">
        <ArrowUpRight size={19} strokeWidth={1.5} />
      </span>
    </>
  );
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`text-link ${className}`}
    >
      {content}
      <span className="sr-only">（新标签页打开）</span>
    </a>
  ) : (
    <Link href={href} className={`text-link ${className}`}>
      {content}
    </Link>
  );
}
export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="back-link" href={href}>
      <ArrowRight size={17} />
      {children}
    </Link>
  );
}
export function PageIntro({
  label,
  title,
  italic,
  description,
}: {
  label: string;
  title: string;
  italic?: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow reveal">{label}</p>
      <h1 className="reveal">
        {title}
        {italic && (
          <em>
            {italic}
            <span className="apricot-dot">.</span>
          </em>
        )}
      </h1>
      <p className="page-description reveal">{description}</p>
    </header>
  );
}
