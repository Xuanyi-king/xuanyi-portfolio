import type { Metadata } from 'next';
import { MotionDirection } from '@/components/motion-direction';
import './study.css';
export const metadata: Metadata={title:'Motion Direction · 实验样片',description:'A Shape Becomes a World：两套真实互动导演实验，非正式首页。',robots:{index:false,follow:true},alternates:{canonical:'/lab/motion-direction/'}};
export default function Page(){return <MotionDirection/>}
