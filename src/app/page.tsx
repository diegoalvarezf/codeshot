"use client";

import { useState, useRef, useEffect } from "react";
import type { Framework, Message } from "@/types";
import { FRAMEWORKS } from "@/types";
import { extractCode, buildPreview } from "@/lib/preview";

type Tab = "code" | "preview";

export default function Home() {
  const [framework, setFramework] = useState<Framework>("react");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("code");
  const [code, setCode] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, framework }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullText += parsed.text;
              setStreamingText(fullText);
            }
          } catch {}
        }
      }

      const extracted = extractCode(fullText);
      setCode(extracted);
      setMessages([...newMessages, { role: "assistant", content: fullText }]);
      setStreamingText("");
      if (extracted) setActiveTab("preview");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages([...newMessages, { role: "assistant", content: `Error: ${msg}` }]);
      setStreamingText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const previewHtml = code ? buildPreview(code, framework) : "";
  const fw = FRAMEWORKS.find((f) => f.id === framework)!;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 h-12 border-b shrink-0" style={{ borderColor: "#1e1e1e", background: "#0d0d0d" }}>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-sm" style={{ color: "#00e5ff" }}>codeshot</span>
          <span className="text-xs" style={{ color: "#444" }}>/</span>
          <div className="flex items-center gap-1">
            {FRAMEWORKS.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFramework(f.id); setMessages([]); setCode(""); setStreamingText(""); }}
                className="px-3 py-1 text-xs font-medium rounded transition-all"
                style={{
                  background: framework === f.id ? f.color + "18" : "transparent",
                  color: framework === f.id ? f.color : "#666",
                  border: `1px solid ${framework === f.id ? f.color + "44" : "transparent"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <a
          href="https://github.com/diegoalvarezf/codeshot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors"
          style={{ color: "#444" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
        >
          GitHub ↗
        </a>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="flex flex-col w-full md:w-[380px] shrink-0 border-r" style={{ borderColor: "#1e1e1e" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !streamingText && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                <div className="text-2xl font-mono font-bold" style={{ color: fw.color }}>&gt;_</div>
                <p className="text-sm" style={{ color: "#555" }}>
                  Describe what you want to build in <span style={{ color: fw.color }}>{fw.label}</span>{" "}and I&apos;ll generate the code.
                </p>
                <div className="flex flex-col gap-2 w-full mt-2">
                  {suggestions[framework].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                      className="text-left text-xs px-3 py-2 rounded transition-colors"
                      style={{ background: "#141414", color: "#666", border: "1px solid #1e1e1e" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = fw.color + "44"; e.currentTarget.style.color = "#aaa"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#666"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] text-sm leading-relaxed px-3 py-2 rounded-lg"
                  style={{
                    background: msg.role === "user" ? fw.color + "18" : "#141414",
                    color: msg.role === "user" ? fw.color : "#aaa",
                    border: `1px solid ${msg.role === "user" ? fw.color + "33" : "#1e1e1e"}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.role === "assistant" ? summarize(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] text-sm leading-relaxed px-3 py-2 rounded-lg"
                  style={{ background: "#141414", color: "#aaa", border: "1px solid #1e1e1e", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {summarize(streamingText)}
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle animate-pulse" style={{ background: fw.color }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t" style={{ borderColor: "#1e1e1e" }}>
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Describe your ${fw.label} component...`}
                rows={2}
                className="flex-1 resize-none text-sm px-3 py-2 rounded outline-none transition-colors"
                style={{
                  background: "#141414",
                  border: "1px solid #252525",
                  color: "#e5e5e5",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = fw.color + "66")}
                onBlur={(e) => (e.target.style.borderColor = "#252525")}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 rounded text-sm font-medium transition-all shrink-0"
                style={{
                  background: isLoading || !input.trim() ? "#1a1a1a" : fw.color + "22",
                  color: isLoading || !input.trim() ? "#444" : fw.color,
                  border: `1px solid ${isLoading || !input.trim() ? "#252525" : fw.color + "55"}`,
                  cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "···" : "→"}
              </button>
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: "#333" }}>Enter to send · Shift+Enter for newline</p>
          </form>
        </div>

        {/* Code + Preview Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 h-10 border-b shrink-0" style={{ borderColor: "#1e1e1e", background: "#0d0d0d" }}>
            {(["code", "preview"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1 text-xs font-medium rounded transition-colors capitalize"
                style={{
                  background: activeTab === tab ? "#1e1e1e" : "transparent",
                  color: activeTab === tab ? "#e5e5e5" : "#555",
                }}
              >
                {tab}
              </button>
            ))}
            {code && (
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="ml-auto text-xs transition-colors px-2 py-1 rounded"
                style={{ color: "#444" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
              >
                Copy code
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "code" ? (
              <div className="h-full overflow-auto p-4">
                {code ? (
                  <pre className="text-sm font-mono leading-relaxed" style={{ color: "#ccc" }}>
                    <code>{code}</code>
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm" style={{ color: "#333" }}>
                      {isLoading ? "Generating..." : "Code will appear here"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full">
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm" style={{ color: "#333" }}>Preview will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function summarize(text: string): string {
  const codeStart = text.indexOf("```");
  if (codeStart === -1) return text;
  const before = text.slice(0, codeStart).trim();
  return before || "Here's the generated code ↗";
}

const suggestions: Record<Framework, string[]> = {
  react: [
    "A dark-themed counter with increment and decrement buttons",
    "A todo list with add, complete and delete functionality",
    "A card component with hover animation and a call-to-action button",
  ],
  vue: [
    "A toggle switch component with smooth animation",
    "A searchable list that filters items as you type",
    "A modal dialog with open/close transitions",
  ],
  html: [
    "A landing page hero section with gradient background",
    "A pricing table with three tiers",
    "A responsive navbar with mobile hamburger menu",
  ],
};
