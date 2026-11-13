import type { Metadata } from 'next';
import OriginalPage from '@/app/about/page';
import { SkyContent } from '@/components/sky-content';
import '../sky.css';
export const metadata:Metadata={title:'About · Skylight',robots:{index:false,follow:false},alternates:{canonical:'/about/'}};
export default function Page(){return <SkyContent><OriginalPage/></SkyContent>;}
