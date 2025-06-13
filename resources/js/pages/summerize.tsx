import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  // Add breadcrumb items if needed
];

export default function Summarize() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeNote = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setOutputText(''); // clear previous output

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    try {
      const response = await fetch('/notes/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        body: JSON.stringify({ details: inputText })
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setOutputText(prev => prev + chunk);
      }

    } catch (error) {
      console.error('Error:', error);
      setOutputText('❌ Failed to summarize. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Summarize" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Input Area */}
          <div className="w-full lg:w-1/2 h-full p-6 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Note Input
              </label>
              <textarea
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write your note here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={summarizeNote}
                variant="outline"
                className="text-sm"
                disabled={loading}
              >
                {loading ? 'Summarizing...' : '🧠 Summarize'}
              </Button>
            </div>
          </div>

          {/* Output Area */}
          <div className="w-full lg:w-1/2 h-full p-6 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Summarized Output
              </label>
              <textarea
                rows={12}
                value={outputText}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
