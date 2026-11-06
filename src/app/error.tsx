"use client";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2>这一页需要重新整理一下。</h2>
      <p>请稍后重试，或通过导航继续浏览。</p>
      <button className="pill-button" onClick={reset}>
        重新尝试 ↻
      </button>
    </div>
  );
}
