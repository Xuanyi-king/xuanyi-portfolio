"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { XMark } from "./x-mark";
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab") {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        if (e.shiftKey && document.activeElement === links[0]) {
          e.preventDefault();
          buttonRef.current?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === links[links.length - 1]
        ) {
          e.preventDefault();
          buttonRef.current?.focus();
        } else if (e.shiftKey && document.activeElement === buttonRef.current) {
          e.preventDefault();
          links[links.length - 1].focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="xuanyi. 首页">
        <XMark compact />
        <span>
          xuanyi<span className="logo-period">.</span>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {[
          ["Work", "/work"],
          ["Notes", "/notes"],
          ["About", "/about"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path.startsWith(href) ? "page" : undefined}
          >
            {label}
            <span />
          </Link>
        ))}
      </nav>
      <a
        className="github-nav"
        href="https://github.com/xuanyi-king"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
        <ArrowUpRight size={16} />
        <span className="sr-only">（新标签页打开）</span>
      </a>
      <button
        ref={buttonRef}
        className="menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "关闭导航" : "打开导航"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        id="mobile-menu"
        ref={menuRef}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="移动端导航">
          {[
            ["Work", "/work"],
            ["Notes", "/notes"],
            ["About", "/about"],
            ["Lab", "/lab"],
            ["Now", "/now"],
          ].map(([label, href], i) => (
            <Link key={href} href={href}>
              <small>0{i + 1}</small>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
        </nav>
        <a
          href="https://github.com/xuanyi-king"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
