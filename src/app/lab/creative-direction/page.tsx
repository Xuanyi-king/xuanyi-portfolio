import {Suspense} from 'react';
import type {Metadata} from 'next';
import {CreativePrototype} from './prototype';
import './prototype.css';
export const metadata:Metadata={title:'Creative Direction — XUANYI Lab',description:'三个关于好奇如何成形的交互实验。',robots:{index:false,follow:false},alternates:{canonical:'/lab/creative-direction/'}};
export default function CreativeDirectionPage(){return <><noscript><h1>XUANYI / 玄屹</h1><p>交互实验需要 JavaScript；真实作品始终可以阅读。</p><a href="/work/">查看全部作品 ↗</a></noscript><Suspense fallback={<div className="cd-root cd-loading"><p>XUANYI / 玄屹</p><h1>好奇，正在成形。</h1><a href="/work/">先看真实作品 ↗</a></div>}><CreativePrototype/></Suspense></>}
