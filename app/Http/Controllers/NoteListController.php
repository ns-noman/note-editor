<?php

namespace App\Http\Controllers;

use App\Models\NoteList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Auth;

class NoteListController extends Controller
{
    public function index()
    {
        $noteList = NoteList::where('user_id', Auth::guard('web')->user()->id)->select('*')->latest()->get();
        return response()->json($noteList, 200);
    }

    public function save(Request $request)
    {
        $request->validate([
            'note_id' => 'nullable|exists:note_lists,id',
            'title' => 'required|string|max:255',
            'details' => 'nullable|string',
        ]);

        if ($request->filled('note_id')) {
            // Update
            $note = NoteList::where('id', $request->note_id)
                        ->where('user_id', auth()->id())
                        ->firstOrFail();

            $note->update([
                'title' => $request->title,
                'details' => $request->details,
            ]);

            return response()->json(['message' => 'Note updated', 'note' => $note]);
        } else {
            // Create
            $note = NoteList::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'details' => $request->details,
                'note_date' => now(),
            ]);

            return response()->json(['message' => 'Note created', 'note' => $note]);
        }
    }

    public function summarize(Request $request)
    {
        $content = $request->input('details');
        $apiKey = env('OPENAI_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4.1-nano-2025-04-14',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an assistant that summarizes notes.'],
                ['role' => 'user', 'content' => $content],
            ],
        ]);

        $data = $response->json();


        $summary = '';

        if (isset($data['choices'][0]['message']['content'])) {
            $summary = $data['choices'][0]['message']['content'];
        }

        // return response($summary);


         $chunks = [
            '⚠️ The API key provided is invalid or expired.',
            'Please verify your OpenAI API key and update it accordingly.',
            'Until then, this is a manual example summary to demonstrate the feature.',
            'Thank you for understanding.',
            'Nowab Shorif...',
        ];

        return response()->stream(function () use ($chunks) {
            foreach ($chunks as $chunk) {
                echo $chunk . "\n";  // add newline for better readability in stream
                ob_flush();
                flush();
                usleep(500000); // 0.5 seconds delay
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
        ]);



    }

    public function destroy($id)
    {
        $note = NoteList::findOrFail($id);
        $note->delete();
        return response()->json(['message' => 'Note deleted successfully']);
    }

}
