import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, BotMessageSquare, RotateCcw, ScanSearch, SendHorizontal } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { ChatMessage, generateReply, greetingFor, makeMessage } from '../../data/aifaChatKnowledge';

export type { ChatMessage };

/** Renders **bold** spans inside plain text; everything else is text, never HTML. */
const renderText = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

interface AIFAChatbotViewProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onBack: () => void;
  /** Close the popup before opening the verification panel. */
  onClosePopup: () => void;
}

const roundIconButton =
  'w-8 h-8 shrink-0 rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] flex items-center justify-center hover:bg-[#E2E4EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40';

export const AIFAChatbotView: React.FC<AIFAChatbotViewProps> = ({ messages, setMessages, onBack, onClosePopup }) => {
  const aifa = useAifa();
  const { detectedArticle, detectedSocialPost, triggerVerification } = aifa;
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const inputId = useId();

  // Seed the greeting the first time the chat opens.
  useEffect(() => {
    if (messages.length === 0) setMessages([greetingFor(aifa)]);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    const userMessage = makeMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsTyping(true);
    const reply = generateReply(trimmed, aifa, [...messages, userMessage]);
    timerRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      timerRef.current = null;
    }, 700 + Math.min(trimmed.length * 12, 600));
  };

  const restart = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsTyping(false);
    setDraft('');
    setMessages([greetingFor(aifa)]);
    inputRef.current?.focus();
  };

  const runVerification = () => {
    onClosePopup();
    triggerVerification(detectedSocialPost ?? undefined);
  };

  const canVerify = !!(detectedArticle || detectedSocialPost);
  // Follow-up chips belong to the latest reply only.
  const lastMessage = messages[messages.length - 1];
  const suggestions =
    !isTyping && lastMessage?.role === 'assistant' ? lastMessage.suggestions ?? [] : [];

  return (
    <div className="flex flex-col h-[min(60vh,480px)] select-text">
      {/* Header */}
      <div className="px-4 pb-3 flex items-center gap-2.5 border-b border-[#E0DED9]">
        <button type="button" onClick={onBack} aria-label="Back to main popup" className={roundIconButton}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="w-8 h-8 shrink-0 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center" aria-hidden="true">
          <BotMessageSquare className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <h3 className="text-sm font-semibold text-[#2A2A2A]">AIFA Chatbot</h3>
          <p className="text-[11px] text-[#6F6D69] truncate">Ask me anything</p>
        </div>
        <button
          type="button"
          onClick={restart}
          aria-label="Start a new chat"
          title="Start a new chat"
          className="w-8 h-8 shrink-0 rounded-full text-[#6F6D69] flex items-center justify-center hover:bg-[#E2E4EA] hover:text-[#2A2A2A] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with AIFA"
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2.5"
      >
        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-[#2A2A2A] text-white px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line break-words">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start">
              <div className="max-w-[90%] rounded-[18px] rounded-bl-md bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-[#2A2A2A]">
                <p className="whitespace-pre-line break-words">{renderText(m.text)}</p>
                {m.action === 'verify' && canVerify && (
                  <button
                    type="button"
                    onClick={runVerification}
                    className="mt-2.5 h-8 px-3.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ScanSearch className="w-3.5 h-3.5" />
                    Verify {detectedSocialPost ? 'this post' : 'full article'}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {isTyping && (
          <div className="flex justify-start" aria-label="AIFA is typing">
            <div className="rounded-[18px] rounded-bl-md bg-white px-4 py-3 flex items-center gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-1.5 h-1.5 rounded-full bg-[#A3A19B] animate-bounce motion-reduce:animate-none"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="h-8 px-3 rounded-full border border-[#2A2A2A]/15 bg-[#EEEFF3] text-xs font-semibold text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="p-2.5 border-t border-[#E0DED9]"
      >
        <div className="flex items-end gap-2 rounded-[22px] bg-white border border-[#E0DED9] pl-4 pr-1.5 py-1.5 focus-within:border-[#5774BC] focus-within:ring-2 focus-within:ring-[#5774BC]/20 transition-colors">
          <label htmlFor={inputId} className="sr-only">
            Message AIFA
          </label>
          <textarea
            ref={inputRef}
            id={inputId}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(draft);
              }
            }}
            placeholder="Ask AIFA anything…"
            maxLength={500}
            className="flex-1 min-w-0 resize-none bg-transparent py-1.5 text-[13px] leading-5 text-[#2A2A2A] outline-none placeholder:text-[#A3A19B] max-h-24"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isTyping}
            aria-label="Send message"
            className="w-8 h-8 shrink-0 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer disabled:bg-[#D6D4CF] disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#6F6D69]">
          Simulated assistant for demonstration. Verify important claims with Sebenarnya.my.
        </p>
      </form>
    </div>
  );
};
