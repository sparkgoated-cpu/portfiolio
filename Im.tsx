import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, Bot, FileCode, Play, Terminal, FolderOpen, 
  ChevronRight, LayoutTemplate, MessageSquare, Loader2, Save 
} from 'lucide-react';

export default function SparkAgentIDE() {
  // 1. PROJECT FILES STATE (Multi-file Support)
  const [files, setFiles] = useState({
    'index.html': { language: 'html', content: '<h1>Hello Spark!</h1>' },
    'style.css': { language: 'css', content: 'body { background: #0f172a; color: white; }' },
    'app.js': { language: 'javascript', content: 'console.log("Spark Agent Active");' }
  });
  
  const [activeFile, setActiveFile] = useState('index.html');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hey! I am Spark Agent. Tell me what app I should build for you?' }]);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // 2. LIVE PREVIEW ENGINE
  const [iframeSrc, setIframeSrc] = useState('');
  const updatePreview = () => {
    const html = files['index.html']?.content || '';
    const css = files['style.css']?.content || '';
    const js = files['app.js']?.content || '';
    const combined = `
      <html><head><style>${css}</style></head>
      <body>${html}<script>${js}</script></body></html>
    `;
    setIframeSrc(combined);
  };

  useEffect(() => updatePreview(), [files]);

  // 3. AI AGENT SIMULATOR (Replit-style Action)
  const handleAgentPrompt = async () => {
    if (!prompt.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsThinking(true);
    setPrompt('');

    // Simulate Agent Work (Here you connect to your AI API)
    setTimeout(() => {
      // Agent modifies files
      setFiles({
        'index.html': { language: 'html', content: '<div class="app"><h2>AI Generator</h2><button id="btn">Click me</button></div>' },
        'style.css': { language: 'css', content: '.app { padding: 20px; font-family: sans-serif; } #btn { background: indigo; color: white; border: none; padding: 10px; }' },
        'app.js': { language: 'javascript', content: 'document.getElementById("btn").onclick = () => alert("Spark Agent created this!");' }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: 'I have updated index.html, style.css, and app.js. Check the preview!' }]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-200 overflow-hidden">
      
      {/* LEFT: AGENT CHAT PANEL */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Bot className="text-indigo-500" />
          <h2 className="font-bold text-white">Spark Agent</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'ai' ? 'bg-gray-800' : 'bg-indigo-900/50'}`}>
              {m.text}
            </div>
          ))}
          {isThinking && <Loader2 className="animate-spin text-indigo-500" />}
        </div>
        <div className="p-4 border-t border-gray-800">
          <input 
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAgentPrompt()}
            className="w-full bg-gray-800 rounded p-2 text-sm outline-none border border-gray-700"
            placeholder="Type your instruction..." 
          />
        </div>
      </div>

      {/* CENTER: IDE & FILES */}
      <div className="flex-1 flex flex-col">
        {/* File Tabs */}
        <div className="flex bg-gray-900 border-b border-gray-800 overflow-x-auto">
          {Object.keys(files).map(file => (
            <button 
              key={file} onClick={() => setActiveFile(file)}
              className={`px-4 py-2 text-sm flex items-center gap-2 ${activeFile === file ? 'bg-gray-800 text-indigo-400 border-t-2 border-indigo-500' : 'text-gray-500'}`}
            >
              <FileCode size={14} /> {file}
            </button>
          ))}
        </div>
        {/* Editor */}
        <div className="flex-1">
          <Editor
            theme="vs-dark"
            path={activeFile}
            language={files[activeFile].language}
            value={files[activeFile].content}
            onChange={(val) => setFiles(prev => ({ ...prev, [activeFile]: { ...prev[activeFile], content: val || '' } }))}
          />
        </div>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="w-1/3 border-l border-gray-800 bg-white">
        <div className="h-10 bg-gray-100 flex items-center px-4 border-b text-xs font-bold text-gray-500">
          LIVE PREVIEW
        </div>
        <iframe title="preview" srcDoc={iframeSrc} className="w-full h-full" />
      </div>

    </div>
  );
}
