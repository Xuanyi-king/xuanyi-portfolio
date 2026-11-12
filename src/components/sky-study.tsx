import { getNotes } from '@/lib/notes';
import { SkyEdition } from './sky-edition';
import type { SkyProfile } from '@/motion/sky-surface';
export function SkyStudy({variant='sky',study=false}:{variant?:SkyProfile;study?:boolean}) {
  const note=getNotes()[0];
  return <SkyEdition variant={variant} study={study} note={note&&{slug:note.slug,title:note.title,date:note.date,category:note.category}}/>;
}
