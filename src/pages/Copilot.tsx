import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, ArrowDown, Lightbulb } from 'lucide-react';
import { ClassEntry, Assignment, AttendanceRecord, Note, Announcement, FeeEntry, Settings, ChatMessage } from '../types';
import { getAIResponse, createUserMessage, createAssistantMessage } from '../services/aiAssistant';
import { getData, setData, KEYS } from '../services/storage';
import toast from 'react-hot-toast';

interface CopilotProps {
  classes: ClassEntry[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  notes: Note[];
  announcements: Announcement[];
  fees: FeeEntry[];
  settings: Settings;
}

const SUGGESTED_PROMPTS = [
  "What do I have today?",
  "What should I prioritize today?",
  "Which assignment is due next?",
  "Which subject has low attendance?",
  "Show my upcoming exams",
  "What classes do I have tomorrow?",
  "What fees are pending?",
];

export default function Copilot({
  classes, assignments, attendance, notes, announcements, fees, settings
}: CopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getData<ChatMessage[]>(KEYS.CHAT_HISTORY);
    if (saved && saved.length > 0) return saved;

    return [
      createAssistantMessage(
        `Namaste ${settings.studentName.split(' ')[0]}! 👋 I'm your College Copilot.\n\nI have full context on your timetable, deadlines, attendance, and fee alerts. Ask me anything about your day, or tap one of the suggested questions below!`
      ),
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    setData(KEYS.CHAT_HISTORY, messages);
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg = createUserMessage(text);
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate natural AI thinking time
    setTimeout(() => {
      // Local demo response utilizing live stored application data
      const replyText = getAIResponse(text, {
        classes,
        assignments,
        attendance,
        notes,
        announcements,
        fees,
        settings,
      });

      const assistantMsg = createAssistantMessage(replyText);
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const initial = [
      createAssistantMessage(
        `Chat reset. How can I help you today, ${settings.studentName.split(' ')[0]}?`
      ),
    ];
    setMessages(initial);
    setData(KEYS.CHAT_HISTORY, initial);
    toast.success('Chat history cleared');
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-[#0d0d2b] rounded-[10px] flex items-center justify-center text-indigo-400">
              <Bot size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">College Copilot AI</h1>
              <span className="badge badge-normal !py-0.5 text-[0.6rem]">
                Context Active
              </span>
            </div>
            <p className="text-[0.65rem] text-slate-400">
              Personalized academic assistant powered by your live data
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="glass-button-ghost p-1.5 rounded-lg text-slate-500 hover:text-red-400"
          title="Clear Conversation"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 flex-shrink-0">
        <span className="text-[0.65rem] text-slate-500 flex items-center gap-1 px-1 flex-shrink-0">
          <Lightbulb size={11} className="text-amber-400" /> Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-white whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={15} />
              </div>
            )}

            <div
              className={`chat-bubble ${msg.role} ${
                msg.role === 'assistant'
                  ? '!bg-white/[0.04] !border !border-white/10 text-slate-200'
                  : 'text-white'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {msg.content}
              </div>
              <p
                className={`text-[0.6rem] mt-1 text-right ${
                  msg.role === 'user' ? 'text-indigo-200/70' : 'text-slate-500'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={15} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Bot size={15} />
            </div>
            <div className="typing-indicator glass-card !py-2 !px-3">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="chat-input-area flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Copilot (e.g. 'What classes do I have today?', 'Which subject has low attendance?')..."
          className="glass-input flex-1 !text-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="glass-button glass-button-primary !px-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
