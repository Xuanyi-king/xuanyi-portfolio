import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { XMark } from "../src/components/x-mark";

// tsx runs JSX without Next's compiler in this maintenance script.
Object.assign(globalThis, { React });
function svg(compact: boolean) {
  return renderToStaticMarkup(<XMark compact={compact} decorative={false} />)
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/<path[^>]+class="[^"]*x-centerline[^>]+><\/path>/g, "");
}
writeFileSync("public/brand/x-mark.svg", svg(false) + "\n");
// Solid, optically heavier edges; a tighter viewBox protects 16px legibility.
const icon = svg(true)
  .replace(/<defs>[\s\S]*?<\/defs>/, "")
  .replace('viewBox="0 0 500 500"', 'viewBox="65 65 370 370"')
  .replace(
    /(<svg[^>]+>)/,
    '$1<rect x="65" y="65" width="370" height="370" rx="80" fill="#fafaf6"/>',
  );
writeFileSync("src/app/icon.svg", icon + "\n");
console.log("Identity assets generated from the selected Cloud Silk geometry.");
