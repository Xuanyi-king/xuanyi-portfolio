import type { ReactNode } from 'react';
export function SkyContent({children}:{children:ReactNode}){
  return <div className="sky-content"><div className="sky-lab-bar"><a href="/lab/sky-edition/">SKYLIGHT / 3D Sky Edition</a><span>内容页 · 阅读优先</span><a href="/">现有版本 ↗</a></div>{children}</div>;
}
