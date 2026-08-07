import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Send, Globe, ChevronDown } from 'lucide-react';
import { getApplications, type Application } from '../admin/utils/storage';
import { generateChatResponse } from '../services/geminiService';

// ── Types ──────────────────────────────────────────────────────────────────
type ChatRole = 'user' | 'bot';
type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
  detectedLang?: string;
};

type SupportedLang = 'eng' | 'zul' | 'xho' | 'sot';

const LANG_LABELS: Record<SupportedLang, string> = {
  eng: 'English',
  zul: 'isiZulu',
  xho: 'isiXhosa',
  sot: 'Sesotho',
};

const QUICK_QUESTIONS = [
  'How do I apply for admission?',
  'What documents do I need?',
  'What grades do you offer?',
  'What are the school hours?',
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function formatDate(iso: string | undefined) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

// ── Status lookup ────────────────────────────────────────────────────────────
type StatusQuery =
  | { kind: 'studentNumber'; studentNumber: string }
  | { kind: 'nameAndDob'; firstName: string; lastName: string; dob: string };

function parseStatusQuery(input: string): StatusQuery | null {
  const text = normalize(input);
  const snMatch = text.match(/(student number|student no|student|status)\s*[:#]?\s*([a-z0-9-]{6,})/i);
  if (snMatch?.[2]) return { kind: 'studentNumber', studentNumber: snMatch[2].toUpperCase() };
  const dobMatch = text.match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
  if (dobMatch) {
    const dob = dobMatch[0];
    const namePart = text.replace(dob, ' ').replace(/\b(dob|date of birth)\b/g, ' ');
    const tokens = namePart.split(/\s+/).filter(Boolean);
    const statusIdx = tokens.findIndex((t) => t === 'status');
    const startIdx = statusIdx >= 0 ? statusIdx + 1 : 0;
    const firstName = tokens[startIdx];
    const lastName = tokens[startIdx + 1];
    if (firstName && lastName) return { kind: 'nameAndDob', firstName, lastName, dob };
  }
  return null;
}

function findApplication(apps: Application[], q: StatusQuery) {
  if (q.kind === 'studentNumber') {
    return apps.find((a) => normalize(a.studentNumber) === normalize(q.studentNumber));
  }
  return apps.find(
    (a) =>
      normalize(a.firstName) === normalize(q.firstName) &&
      normalize(a.lastName) === normalize(q.lastName) &&
      normalize(a.dob) === normalize(q.dob)
  );
}

// ── Main ChatbotWidget ───────────────────────────────────────────────────────
export function ChatbotWidget(props: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(props.defaultOpen));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLang>('eng');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'bot',
      createdAt: Date.now(),
      text: "👋 Hello! Let me help you with anything about Jojo Senior Secondary School! Whether it's admissions, fees, results, activities or anything else — just ask and I'll be happy to assist.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showLangMenu) setShowLangMenu(false);
        else setOpen(false);
      }
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, showLangMenu]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    }
    if (showLangMenu) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showLangMenu]);

  const apps = useMemo(() => {
    try {
      return getApplications();
    } catch {
      return [];
    }
  }, [open]);

  const showQuickQuestions = messages.length <= 1 && !isTyping;

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: uid(), role: 'user', text, createdAt: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Local application status lookup
      const statusQ = parseStatusQuery(text);
      if (statusQ) {
        const app = findApplication(apps, statusQ);
        const replyText = app
          ? `I found the application for ${app.firstName} ${app.lastName} (Student number: ${app.studentNumber}). Status: ${app.status}.${
              app.submittedDate ? ` Submitted: ${formatDate(app.submittedDate)}.` : ''
            }`
          : 'I could not find a matching application. Please double-check the student number or learner name and date of birth.';
        setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: replyText, createdAt: Date.now() }]);
        setIsTyping(false);
        return;
      }

      // 2. Ask Gemini in the currently selected language
      const reply = await generateChatResponse(text, LANG_LABELS[currentLang]);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'bot',
          text: reply,
          createdAt: Date.now(),
          detectedLang: currentLang !== 'eng' ? LANG_LABELS[currentLang] : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'bot',
          text: 'Something went wrong. Please contact the school at 039 940 4284 or 072 349 3647.',
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes mh-chat-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mh-chat-window { animation: mh-chat-in 0.2s cubic-bezier(0.34, 1.1, 0.64, 1) both; }
      `}</style>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="mh-chat-window fixed z-50
            bottom-[4.5rem] right-3
            sm:bottom-24 sm:right-6
            w-[calc(100vw-1.5rem)] max-w-[375px]
            h-[min(70vh,560px)]
            bg-white rounded-2xl shadow-2xl border border-gray-200
            flex flex-col overflow-hidden"
          role="dialog"
          aria-label="School help desk chatbot"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F5C518] text-[#CC0000] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#CC0000] flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                <img src="/jojo_logo.png" alt="Jojo SSS" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm leading-tight truncate">Jojo Assistant</div>
                <div className="flex items-center gap-1 text-[11px] text-[#CC0000]/70 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block animate-pulse" />
                  Online · AI-powered
                  {currentLang !== 'eng' && <span className="ml-1">· {LANG_LABELS[currentLang]}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Language dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold"
                  aria-label="Change language"
                >
                  <Globe size={11} />
                  <span>{LANG_LABELS[currentLang].split(' ')[0]}</span>
                  <ChevronDown size={10} className={`transition-transform duration-150 ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 min-w-[130px]">
                    {(Object.entries(LANG_LABELS) as [SupportedLang, string][]).map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrentLang(code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                          currentLang === code
                            ? 'bg-[#CC0000] text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close chatbot"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50 scroll-smooth">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-1.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {m.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-white border border-[#CC0000] flex items-center justify-center shrink-0 mb-0.5 overflow-hidden p-0.5">
                    <img src="/jojo_logo.png" alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#CC0000] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                  {m.detectedLang && (
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Globe size={9} /> {m.detectedLang}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CC0000] flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                  <img src="/jojo_logo.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Quick questions — first load only */}
            {showQuickQuestions && (
              <div className="pt-1">
                <p className="text-[11px] text-gray-400 text-center mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#CC0000]/25 text-[#CC0000] hover:bg-[#990000] hover:text-white transition-colors font-medium shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000]/40 transition-all bg-gray-50 placeholder:text-gray-400"
                placeholder="Ask me anything about the school…"
                aria-label="Chat input"
                disabled={isTyping}
              />
              <button
                onClick={() => send()}
                disabled={isTyping || !input.trim()}
                className="bg-[#CC0000] hover:bg-[#990000]/90 text-white px-3 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              AI-powered · English · isiXhosa · isiZulu · Sesotho
            </p>
          </div>
        </div>
      )}

      {/* ── Toggle FAB ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-4 right-3 sm:bottom-6 sm:right-6
          w-14 h-14 rounded-full shadow-xl
          bg-[#CC0000] hover:bg-[#990000]/90
          text-white flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        <div className="relative flex items-center justify-center">
          {open ? (
            <X size={22} />
          ) : (
            <>
              <img
                src="/jojo_logo.png"
                alt="Open Jojo Assistant"
                className="w-9 h-9 object-contain rounded-full bg-white p-0.5 border-2 border-white"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </>
          )}
        </div>
      </button>
    </>
  );
}
