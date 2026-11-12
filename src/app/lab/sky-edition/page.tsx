import type { Metadata } from 'next';
import { SkyStudy } from '@/components/sky-study';
import './sky.css';
export const metadata: Metadata={title:'Skylight · 3D Sky Edition',robots:{index:false,follow:false},alternates:{canonical:'/lab/sky-edition/'}};
export default function Page(){return <SkyStudy/>;}
