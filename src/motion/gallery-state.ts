export function galleryStateKey(route: string, slugs: readonly string[]) {
  return `xuanyi-gallery-v22:${route}:${slugs.join(",")}`;
}
export function readGalleryState(raw: string | null) {
  try {
    const n = JSON.parse(raw ?? "null");
    return typeof n === "number" && Number.isInteger(n) && Math.abs(n) < 1e6
      ? n
      : 0;
  } catch {
    return 0;
  }
}
/** Only CSS initial values: the live controller owns inline transforms later.
 * This prevents a saved card from flashing as project 01 before hydration. */
export function galleryBootstrap(slugs: readonly string[]) {
  const key = JSON.stringify(galleryStateKey("/", slugs));
  return `;try{if(location.pathname==='/'){var p=JSON.parse(sessionStorage.getItem(${key})),n=${slugs.length},r=document.documentElement;if(typeof p==='number'&&Number.isInteger(p)&&Math.abs(p)<1e6&&n>0){for(var i=0;i<n;i++){var d=n<=1?0:((i-p+n/2)%n+n)%n-n/2,a=Math.abs(d),w=Math.min(n/2,1.8),b=Math.min(.85,w*.6),t=Math.max(0,Math.min(1,(a-b)/(w-b))),o=n<=1?1:1-t*t*(3-2*t);r.style.setProperty('--gallery-d'+i,d);r.style.setProperty('--gallery-a'+i,a);r.style.setProperty('--gallery-s'+i,Math.max(.65,1-a*.12));r.style.setProperty('--gallery-o'+i,o);r.style.setProperty('--gallery-selected'+i,d===0?1:0)}}}}catch{}`;
}
