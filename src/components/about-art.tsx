import { XMark } from "./x-mark";
export function AboutArt() {
  return (
    <div className="about-art" aria-hidden="true">
      <div className="about-disk" />
      <div className="about-paper" data-parallax>
        <XMark />
        <p>保持好奇。</p>
        <span>A NOTE TO MYSELF / 玄屹</span>
      </div>
      <span className="about-caption">Always a work in progress.</span>
    </div>
  );
}
