import type { Metadata } from 'next';
import { MotionDirection } from '@/components/motion-direction';
import './study.css';
import './passing.css';
export const metadata: Metadata={title:'The Passing Curve · Director’s Cut',description:'The Passing Curve 精修导演实验，保留旧 A/B 对照；非正式首页。',robots:{index:false,follow:true},alternates:{canonical:'/lab/motion-direction/'}};
export default function Page(){return <MotionDirection/>}
