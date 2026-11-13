import type { Metadata } from "next";
import { SkyStudy } from "@/components/sky-study";
import "./lab/sky-edition/sky.css";

/** Preview-only homepage. The PR #5 product homepage is unchanged. */
export const metadata: Metadata = {
  title: "Sky Ribbon — XUANYI 3D Sky Edition Preview",
  description: "XUANYI 3D Sky Edition · Sky Ribbon experimental preview",
  robots: { index: false, follow: false },
};

export default function PreviewHome() {
  return <SkyStudy variant="sky" />;
}
