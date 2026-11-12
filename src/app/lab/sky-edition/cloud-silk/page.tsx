import type { Metadata } from 'next';
import { SkyStudy } from '@/components/sky-study';
import '../sky.css';
export const metadata:Metadata={title:'A · Cloud Silk — 视觉原型',robots:{index:false,follow:false},alternates:{canonical:'/lab/sky-edition/cloud-silk/'}};
export default function Page(){return <SkyStudy variant="cloud" study/>;}
