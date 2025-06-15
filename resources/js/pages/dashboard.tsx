import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
  const [notes, setNotes] = useState<{ id: number; title: string; details: string }[]>([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [prevNote, setPrevNote] = useState<{ title: string; details: string } | null>(null);
  const [hasUserSetTitle, setHasUserSetTitle] = useState(false);

  const getNoteList = async () => {
    try {
      const res = await axios.get('/notes/list');
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  };

  const saveNote = async () => {
    try {
      const response = await axios.post('/notes/save', {
        note_id: noteId,
        title: title.trim(),
        details: details.trim(),
      });

      if (response.data?.note?.id) {
        setNoteId(response.data.note.id);
      }

      console.log('Note saved');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await axios.delete(`/notes/${id}`);
      console.log('Note deleted');
      getNoteList();

      if (noteId === id) {
        setNoteId(null);
        setTitle('');
        setDetails('');
        setPrevNote(null);
        setHasUserSetTitle(false);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      const hasChanged =
        prevNote === null ||
        title.trim() !== prevNote.title.trim() ||
        details.trim() !== prevNote.details.trim();

      if (hasChanged && (title.trim() || details.trim())) {
        (async () => {
          await saveNote();
          setPrevNote({ title: title.trim(), details: details.trim() });
          getNoteList();
        })();
      }
    }, 1000);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [title, details]);

  useEffect(() => {
    getNoteList();
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-1/4 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">📝 My Notes</h1>
              <button
                onClick={() => {
                  setNoteId(null);
                  setTitle('');
                  setDetails('');
                  setPrevNote(null);
                  setHasUserSetTitle(false);
                }}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition"
                title="New Note"
              >
                + New
              </button>
            </div>

            {notes.map((note) => (
              <div
                key={note.id}
                className="group flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                onClick={() => {
                  setTitle(note.title || '');
                  setDetails(note.details || '');
                  setNoteId(note.id);
                  setPrevNote({ title: note.title || '', details: note.details || '' });
                  setHasUserSetTitle(true);
                }}
              >
                <span className="text-sm text-gray-800 dark:text-gray-100 truncate">{note.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      deleteNote(note.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete note"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 01-1 1H6a1 1 0 01-1-1m3-3h8a1 1 0 011 1v1H5V5a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="w-3/4 h-full p-2 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border space-y-0">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUserSetTitle(true);
              }}
              placeholder="Title"
              className="w-full rounded-t-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows={30}
              value={details}
              onChange={(e) => {
                const newDetails = e.target.value;
                setDetails(newDetails);

                if (!hasUserSetTitle) {
                  const trimmedDetails = newDetails.trimStart();
                  if (trimmedDetails.length > 0) {
                    setTitle(trimmedDetails.substring(0, 30));
                  }
                }
              }}
              placeholder="Write your note here..."
              className="w-full rounded-b-lg border-t-0 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
