import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, BotMessageSquare, RotateCcw, ScanSearch, SendHorizontal } from 'lucide-react';
import { Button, Chip, Field, Icon, IconButton, Input } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ChatMessage, generateReply, greetingFor, makeMessage } from '../../data/aifaChatKnowledge';

export type { ChatMessage };

/** Renders **bold** spans inside plain text; everything else is text, never HTML. */
const renderText = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
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

export const AIFAChatbotView: React.FC<AIFAChatbotViewProps> = ({ messages, setMessages, onBack, onClosePopup }) => {
  const aifa = useAifa();
  const { detectedArticle, detectedSocialPost, triggerVerification } = aifa;
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const inputId = useId();
  // The design-system Input does not forward refs, so the composer is focused by id.
  const focusInput = () => document.getElementById(inputId)?.focus();

  // Seed the greeting the first time the chat opens.
  useEffect(() => {
    if (messages.length === 0) setMessages([greetingFor(aifa)]);
    focusInput();
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
    focusInput();
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
    <div className="aifa-chat-frame flex flex-col select-text">
      {/* Header */}
      <div className="px-16 pb-12 flex items-center gap-inline border-b border-border">
        <IconButton icon={ArrowLeft} label="Back to main popup" size="icon-sm" onClick={onBack} />
        {/* AIFA avatar: the one place the design system uses the brand spark colour */}
        <span
          className="size-avatar-sm shrink-0 rounded-full bg-brand-spark text-foreground-inverse flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon icon={BotMessageSquare} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-label text-foreground">AIFA Chatbot</h3>
          <p className="text-caption text-muted-foreground truncate">Ask me anything</p>
        </div>
        <IconButton
          icon={RotateCcw}
          label="Start a new chat"
          title="Start a new chat"
          variant="quiet"
          size="icon-sm"
          onClick={restart}
        />
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with AIFA"
        className="flex-1 min-h-0 overflow-y-auto p-12 flex flex-col gap-text"
      >
        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-card rounded-br-tail bg-primary text-primary-foreground px-12 py-8 text-body-sm whitespace-pre-line break-words">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start">
              <div className="max-w-[90%] rounded-card rounded-bl-tail bg-card px-12 py-8 text-body-sm text-foreground flex flex-col gap-text items-start">
                <p className="whitespace-pre-line break-words">{renderText(m.text)}</p>
                {m.action === 'verify' && canVerify && (
                  <Button size="sm" icon={ScanSearch} onClick={runVerification}>
                    Verify {detectedSocialPost ? 'this post' : 'full article'}
                  </Button>
                )}
              </div>
            </div>
          )
        )}

        {isTyping && (
          <div className="flex justify-start" aria-label="AIFA is typing">
            <div className="rounded-card rounded-bl-tail bg-card px-16 py-12 flex items-center gap-4">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-dot rounded-full bg-muted-foreground animate-bounce motion-reduce:animate-none"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-6">
            {suggestions.map((s) => (
              <Chip key={s} size="sm" onClick={() => send(s)}>
                {s}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Composer: Enter sends (form submit) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="p-8 border-t border-border flex flex-col gap-6"
      >
        <div className="flex items-center gap-inline">
          <Field label="Message AIFA" hideLabel className="flex-1">
            <Input
              id={inputId}
              pill
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask AIFA anything…"
              maxLength={500}
              autoComplete="off"
            />
          </Field>
          <IconButton
            type="submit"
            icon={SendHorizontal}
            label="Send message"
            variant="filled"
            disabled={!draft.trim() || isTyping}
          />
        </div>
        <p className="text-center text-caption text-muted-foreground">
          Simulated assistant for demonstration. Verify important claims with Sebenarnya.my.
        </p>
      </form>
    </div>
  );
};
