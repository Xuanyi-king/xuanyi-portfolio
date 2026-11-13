import type { Metadata } from 'next';
import OriginalPage from '@/app/notes/page';
import { SkyContent } from '@/components/sky-content';
import '../sky.css';
export const metadata:Metadata={title:'Notes · Skylight',robots:{index:false,follow:false},alternates:{canonical:'/notes/'}};
export default function Page(){return <SkyContent><OriginalPage/></SkyContent>;}
