import type { Metadata } from 'next';
import OriginalPage from '@/app/work/page';
import { SkyContent } from '@/components/sky-content';
import '../sky.css';
export const metadata:Metadata={title:'Work · Skylight',robots:{index:false,follow:false},alternates:{canonical:'/work/'}};
export default function Page(){return <SkyContent><OriginalPage/></SkyContent>;}
