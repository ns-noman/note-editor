<h1>AI Note Editor</h1>

<p>
  An AI-enhanced note editor built using <strong>Laravel</strong>, <strong>Inertia.js</strong>, and <strong>React.js</strong>.
  This application allows users to register, log in (regular or Google OAuth), create notes, edit notes, and utilize AI features such as summarization.
</p>

<h2>🚀 Features</h2>
<ul>
  <li><strong>User Authentication</strong>
    <ul>
      <li>Google OAuth login</li>
      <li>Regular email/password login</li>
      <li>User registration</li>
    </ul>
  </li>
  <li><strong>Note Management</strong>
    <ul>
      <li>Create, view, update, and delete notes</li>
      <li>Notes associated with the logged-in user</li>
    </ul>
  </li>
  <li><strong>AI Features</strong>
    <ul>
      <li>Summarize notes using OpenAI API</li>
      <li>Pluggable for future AI enhancements</li>
    </ul>
  </li>
  <li><strong>Modern Tech Stack</strong>
    <ul>
      <li>Laravel (backend API & logic)</li>
      <li>React.js with Inertia.js (frontend SPA experience)</li>
      <li>Tailwind CSS + shadcn/ui for UI</li>
    </ul>
  </li>
  <li><strong>Streaming AI response</strong> — real-time summary chunks sent as the AI processes</li>
</ul>

<h2>📂 Project Structure</h2>
<pre>
app/Http/Controllers
 └── NoteController.php
 └── NoteListController.php
resources/js/Pages/Notes
 └── Index.jsx
 └── Edit.jsx
 └── Create.jsx
routes/web.php
database/migrations
 └── create_notes_table.php
...
</pre>

<h2>⚙️ Installation</h2>
<ol>
  <li>Clone the repository:
    <pre>git clone https://github.com/your-username/note-editor.git
cd note-editor</pre>
  </li>
  <li>Install dependencies:
    <pre>composer install
npm install</pre>
  </li>
  <li>Configure environment:
    <pre>cp .env.example .env
php artisan key:generate</pre>
    Set your database and OpenAI API key in <code>.env</code>:
    <pre>OPENAI_API_KEY=sk-xxxx</pre>
  </li>
  <li>Run migrations:
    <pre>php artisan migrate</pre>
  </li>
  <li>Run development server:
    <pre>php artisan serve
npm run dev</pre>
  </li>
</ol>

<h2>📝 Usage</h2>
<p>
  Register a new account or log in with Google.<br>
  Create and edit notes.<br>
  Click <strong>Summarize</strong> on a note to see AI-generated summaries in real-time.
</p>

<h2>📌 Requirements</h2>
<ul>
  <li>PHP >= 8.2</li>
  <li>Node.js >= 16</li>
  <li>Composer</li>
  <li>Laravel 12+</li>
  <li>OpenAI API key</li>
</ul>

<h2>🌟 Future Enhancements</h2>
<ul>
  <li>AI-based note improvement suggestions</li>
  <li>Export notes to PDF/Markdown</li>
  <li>Collaboration features</li>
</ul>
