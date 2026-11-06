import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Note } from "@/lib/notes";
export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <Link
          key={note.slug}
          href={`/notes/${note.slug}`}
          className="note-row reveal"
        >
          <time dateTime={note.date}>{note.date.replaceAll("-", ".")}</time>
          <div>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
          </div>
          <span className="note-category">
            {note.category} · {note.minutes} MIN READ
          </span>
          <ArrowUpRight />
        </Link>
      ))}
    </div>
  );
}
