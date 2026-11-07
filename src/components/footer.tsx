import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { XMark } from "./x-mark";
export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <p className="eyebrow">A GOOD CONVERSATION STARTS WITH CURIOSITY.</p>
          <span className="footer-note">保持好奇，也保持联系。</span>
        </div>
        <div className="footer-callout">
          <h2>
            Have a little
            <br />
            <em>curiosity?</em>
            <span className="apricot-dot">*</span>
          </h2>
          <a
            className="contact-circle"
            href="https://github.com/xuanyi-king"
            target="_blank"
            rel="noreferrer"
            aria-label="通过 GitHub 认识玄屹（新标签页打开）"
          >
            <ArrowUpRight />
            <span>
              Say hello
              <br />
              on GitHub
            </span>
          </a>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="footer-signature">
            <XMark compact />
            <span>xuanyi.</span>
          </Link>
          <p>© {new Date().getUTCFullYear()} 玄屹 · 用好奇心制作</p>
          <nav aria-label="更多链接">
            <Link href="/lab">Lab ↗</Link>
            <Link href="/now">Now ↗</Link>
            <a href="/rss.xml">RSS ↗</a>
            <a
              href="https://github.com/xuanyi-king"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗<span className="sr-only">（新标签页打开）</span>
            </a>
          </nav>
          <a className="back-top" href="#top" aria-label="回到顶部">
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
