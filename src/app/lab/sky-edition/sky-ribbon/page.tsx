import type { Metadata } from 'next';
import { SkyStudy } from '@/components/sky-study';
import '../sky.css';
export const metadata:Metadata={title:'B · Sky Ribbon — 视觉原型',robots:{index:false,follow:false},alternates:{canonical:'/lab/sky-edition/sky-ribbon/'}};
export default function Page(){return <SkyStudy variant="sky" study/>;}
