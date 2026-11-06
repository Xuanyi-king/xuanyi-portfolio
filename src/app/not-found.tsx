import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">A LITTLE DETOUR / 绕了一点路</p>
      <h1>
        404<span className="apricot-dot">.</span>
      </h1>
      <p>
        这里暂时没有内容。
        <br />
        好奇心可以继续，先回到有作品的地方。
      </p>
      <Link href="/" className="pill-button">
        回到首页 ↗
      </Link>
    </div>
  );
}
