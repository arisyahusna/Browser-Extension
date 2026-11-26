/**
 * AIFA Chatbot: simulated replies for the client mockup.
 *
 * No network calls and no AI model. Each question is scored against a topic list
 * (phrases count more than single words) and the best match answers. Page-aware topics
 * read what the extension already knows: the detected article/post, verification history
 * and fact-check inquiries. Anything unmatched gets an honest fallback that explains how
 * to check it, rather than an invented answer.
 */
import { AifaContextType } from '../types/aifa';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** In-chat button, stored as a kind (not a callback) so the history stays serialisable. */
  action?: 'verify';
  /** Topic that produced this reply, so "tell me more" can continue it. */
  topic?: string;
  /** Follow-up questions offered as chips under the latest reply. */
  suggestions?: string[];
}

export type ChatContext = Pick<
  AifaContextType,
  'detectedArticle' | 'detectedSocialPost' | 'verificationHistory' | 'submittedRequests' | 'isExtensionEnabled'
>;

interface Reply {
  text: string;
  action?: ChatMessage['action'];
  suggestions?: string[];
}

interface Topic {
  id: string;
  /**
   * Lowercase words or phrases, matched as whole words (plurals and -ed/-ing allowed).
   * A trailing * makes it a prefix: "summar*" catches "summarise" and "summary".
   */
  keywords: string[];
  answer: (ctx: ChatContext) => Reply;
  /** Extra detail for "tell me more". */
  more?: string;
}

let messageSeq = 0;
export const makeMessage = (role: ChatMessage['role'], text: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  id: `msg-${Date.now()}-${messageSeq++}`,
  role,
  text,
  ...extra,
});

/* ------------------------------------------------------------------ */
/* Page context                                                        */
/* ------------------------------------------------------------------ */

const currentContent = (ctx: ChatContext) => {
  if (ctx.detectedSocialPost) {
    const caption = ctx.detectedSocialPost.caption;
    return {
      id: ctx.detectedSocialPost.id,
      kind: 'post' as const,
      title: `"${caption.slice(0, 80)}${caption.length > 80 ? '…' : ''}"`,
      summary: caption,
    };
  }
  if (ctx.detectedArticle) {
    return {
      id: ctx.detectedArticle.id,
      kind: 'article' as const,
      title: ctx.detectedArticle.title,
      summary: ctx.detectedArticle.summary,
    };
  }
  return null;
};

const recordFor = (ctx: ChatContext) => {
  const content = currentContent(ctx);
  return content ? ctx.verificationHistory.find((h) => h.contentId === content.id) : undefined;
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const NO_PAGE =
  "I don't see a news article or social post on this page. Open one and ask again, or ask me anything about spotting misinformation.";

export const greetingFor = (ctx: ChatContext): ChatMessage => {
  const content = currentContent(ctx);
  return makeMessage(
    'assistant',
    content
      ? `Hi! I'm AIFA, your fact-checking assistant. I can see the ${content.kind} you're on: ${content.title}\n\nAsk me about it, or about anything else: scams, deepfakes, viral forwards, how to check a claim, or how to use the extension.`
      : "Hi! I'm AIFA, your fact-checking assistant. Ask me anything: how to spot fake news, scams, deepfakes, viral forwards, your fact-check inquiries, or how to use the extension.",
    {
      topic: 'greeting',
      suggestions: content
        ? ['Summarise this page', 'Is this reliable?', 'How do I spot a scam?']
        : ['How do I spot fake news?', 'What is a deepfake?', 'Status of my inquiries'],
    }
  );
};

/* ------------------------------------------------------------------ */
/* Topics                                                              */
/* ------------------------------------------------------------------ */

const TOPICS: Topic[] = [
  /* ---- Page-aware ---- */
  {
    id: 'page-summary',
    keywords: ['summar*', 'ringkas', 'tldr', 'tl;dr', 'gist', 'what is this about', 'what is this article', 'what is this post', 'about this'],
    answer: (ctx) => {
      const content = currentContent(ctx);
      if (!content) return { text: NO_PAGE };
      return {
        text: `Here's the gist of this ${content.kind}:\n\n${content.summary}`,
        suggestions: ['Is this reliable?', 'What claims does it make?'],
      };
    },
  },
  {
    id: 'page-reliability',
    // "Is it true that…" is left to the general claim fallback; these phrases point at the page.
    keywords: ['reliable', 'is this true', 'is this real', 'is this fake', 'accurate', 'trust this', 'credible', 'verdict', 'boleh percaya', 'legit', 'verify this', 'check this'],
    answer: (ctx) => {
      const content = currentContent(ctx);
      if (!content) {
        return {
          text: "There's no article or post on this page for me to check. Open one and I'll tell you whether it's been verified.\n\nFor something you saw elsewhere, ask me \"how do I check a claim?\"",
          suggestions: ['How do I check a claim?'],
        };
      }
      const record = recordFor(ctx);
      if (record) {
        return {
          text: `You verified this ${content.kind} on ${record.verifiedAt}. Overall result: **${record.overallLabel}** across ${plural(record.claimsCount, 'claim')}.\n\n${record.summary}`,
          action: 'verify',
          suggestions: ['What claims does it make?', 'What do the verdicts mean?'],
        };
      }
      return {
        text: `This ${content.kind} hasn't been verified yet, so I can't give a verdict. Run a check and I'll rate each claim and show the evidence.`,
        action: 'verify',
        suggestions: ['What do the verdicts mean?'],
      };
    },
  },
  {
    id: 'page-claims',
    keywords: ['claims', 'what claims', 'how many claims', 'which claims', 'dakwaan', 'statements'],
    answer: (ctx) => {
      const content = currentContent(ctx);
      if (!content) return { text: NO_PAGE };
      const record = recordFor(ctx);
      const claims = record?.result?.claims ?? [];
      if (!record || claims.length === 0) {
        return {
          text: `I haven't analysed the claims in this ${content.kind} yet. Run a verification and I'll list each one with its verdict.`,
          action: 'verify',
        };
      }
      const lines = claims.map((c) => `• **${c.verdictLabel}**: ${c.statement}`).join('\n');
      return {
        text: `This ${content.kind} makes ${plural(claims.length, 'claim')}:\n\n${lines}\n\nOpen the verification panel to see the evidence for each.`,
        suggestions: ['What do the verdicts mean?', 'How do I request a fact-check?'],
      };
    },
  },
  {
    id: 'inquiries',
    keywords: ['my inquir*', 'my request', 'status', 'pending', 'track', 'reference number', 'submitted', 'semakan saya', 'permohonan'],
    answer: (ctx) => {
      const reqs = ctx.submittedRequests;
      if (reqs.length === 0) {
        return {
          text: "You haven't requested any fact-checks yet. When a claim comes back Unverified, use \"Request fact-check\" in the verification panel to send it to Sebenarnya.my.",
          suggestions: ['How do I request a fact-check?'],
        };
      }
      const completed = reqs.filter((r) => r.status === 'Completed').length;
      const review = reqs.filter((r) => r.status === 'Under Review').length;
      const latest = reqs[0];
      return {
        text: `You have ${plural(reqs.length, 'fact-check inquiry', 'fact-check inquiries')}: ${completed} completed, ${review} under review, ${reqs.length - completed - review} waiting to be picked up.\n\nLatest: ${latest.referenceNumber} is ${latest.status.toLowerCase()} (updated ${latest.lastUpdated}).`,
        suggestions: ['How long does a review take?'],
      };
    },
  },
  {
    id: 'history',
    keywords: ['my history', 'how many have i', 'my verifications', 'what have i checked', 'past checks', 'sejarah'],
    answer: (ctx) => {
      const h = ctx.verificationHistory;
      if (h.length === 0) return { text: "You haven't verified anything yet. Open an article or post and press Verify." };
      const flagged = h.filter((r) => r.overallAssessment === 'false' || r.overallAssessment === 'misleading').length;
      return {
        text: `You've verified ${plural(h.length, 'item')} so far. ${flagged} came back false or misleading. The most recent was "${h[0].headline}" (${h[0].overallLabel}).\n\nThe dashboard's Analytics page breaks this down by verdict and source.`,
      };
    },
  },

  /* ---- Using AIFA ---- */
  {
    id: 'how-aifa-works',
    keywords: ['how does aifa', 'how do you work', 'how does this work', 'how it works', 'what does aifa do', 'how does verification'],
    answer: (ctx) => ({
      text: `When you open a news article or social post, AIFA detects it and offers a check. It pulls out the individual claims, rates each one (Supported, Misleading, False or Unverified) and shows the evidence.\n\nIf a claim can't be settled, you can send it to Sebenarnya.my's reviewers and follow it here.${ctx.isExtensionEnabled ? '' : '\n\nThe extension is switched off right now. Use the switch at the top of the popup to turn it on.'}`,
      suggestions: ['What do the verdicts mean?', 'How do I request a fact-check?'],
    }),
    more: 'In this demonstration the analysis is simulated with prepared results, so you can see the full flow without a live model.',
  },
  {
    id: 'verdicts',
    keywords: ['verdict mean', 'verdicts mean', 'what does supported', 'what does misleading', 'what does unverified', 'what does mixed', 'labels', 'ratings', 'misleading mean', 'unverified mean'],
    answer: () => ({
      text: '• **Supported**: reliable evidence backs the claim.\n• **Misleading**: partly true, but missing context or framed to mislead.\n• **False**: evidence contradicts the claim.\n• **Unverified**: not enough reliable evidence either way yet.\n• **Mixed** (whole article): its claims got different verdicts.',
      suggestions: ['How do I request a fact-check?'],
    }),
  },
  {
    id: 'request-howto',
    keywords: ['how do i request', 'request a fact', 'request fact', 'submit a claim', 'send to sebenarnya', 'ask sebenarnya', 'mohon semakan'],
    answer: () => ({
      text: 'Open the verification panel, expand an Unverified claim and press "Request fact-check". Add any notes (where you saw it, who shared it) and submit.\n\nYou\'ll get a reference number, and you can follow its status in the popup and on the dashboard. You\'ll be notified when reviewers publish a verdict.',
      suggestions: ['How long does a review take?', 'Status of my inquiries'],
    }),
  },
  {
    id: 'review-time',
    keywords: ['how long', 'review take', 'when will', 'berapa lama'],
    answer: () => ({
      text: "It depends on the claim. Simple ones are often answered within a few days; claims that need an official agency to respond can take longer. In this demo you can move an inquiry along from the dashboard to see each stage.",
    }),
  },
  {
    id: 'extension-toggle',
    keywords: ['turn off', 'turn on', 'switch off', 'switch on', 'disable', 'enable', 'pause', 'matikan', 'hidupkan'],
    answer: (ctx) => ({
      text: `Use the ON/OFF switch at the top of the popup. While it's off, AIFA won't highlight articles or offer checks, but your history and inquiries stay saved.\n\nIt's currently **${ctx.isExtensionEnabled ? 'on' : 'off'}**.`,
    }),
  },
  {
    id: 'settings',
    keywords: ['setting', 'notification', 'email alert', 'preferences', 'tetapan', 'notifikasi'],
    answer: () => ({
      text: 'Open Settings from the popup footer to choose browser or email notifications. The dashboard\'s Settings page also has your account details and the same preferences.',
    }),
  },
  {
    id: 'dashboard',
    keywords: ['dashboard', 'analytics', 'history page', 'papan pemuka'],
    answer: () => ({
      text: 'The Sebenarnya.my dashboard collects everything in one place: Overview, Analytics (activity, verdicts, sources), History, your Fact-Check Inquiries and Notifications. Open it from the "View All" links in the popup.',
    }),
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'my data', 'personal data', 'is it safe', 'store my', 'track me', 'privasi', 'data peribadi'],
    answer: () => ({
      text: "In this demonstration everything stays in your browser's local storage: nothing is sent to a server. In a live version, only the content you choose to verify would be analysed, and inquiries you submit would be shared with Sebenarnya.my reviewers.",
    }),
  },

  /* ---- Media literacy ---- */
  {
    id: 'spot-fake-news',
    keywords: ['spot fake', 'fake news', 'identify fake', 'tell if', 'misinfo*', 'berita palsu', 'fake news tips', 'how to know if', 'red flags'],
    answer: () => ({
      text: 'A few quick checks before you share:\n\n• **Source**: is it a known outlet, and does the URL look right?\n• **Original**: screenshots and forwards often drop context.\n• **Date**: old stories get recirculated as new.\n• **Urgency**: "Share before it\'s deleted!" is a red flag.\n• **Search**: look the claim up on Sebenarnya.my first.',
      suggestions: ['What is a deepfake?', 'How do I check a claim?', 'Tell me more'],
    }),
    more: 'Also watch your own reaction. Posts built to make you angry or afraid spread fastest, so a strong emotional jolt is a good moment to slow down and check before forwarding.',
  },
  {
    id: 'check-claim',
    keywords: ['check a claim', 'verify a claim', 'how do i verify', 'how to verify', 'fact check something', 'how do i check', 'cara semak'],
    answer: () => ({
      text: "1. **Search Sebenarnya.my** for the claim; many viral ones are already answered.\n2. **Find the original source**: an official statement, document or the first report.\n3. **Compare 2–3 reputable outlets**. If none report it, be cautious.\n4. **Check images** with a reverse image search.\n5. Still unsure? **Request a fact-check** and Sebenarnya.my's reviewers will look into it.",
      suggestions: ['How do I reverse image search?', 'How do I request a fact-check?'],
    }),
  },
  {
    id: 'misinfo-types',
    keywords: ['misinformation', 'disinformation', 'malinformation', 'difference between', 'what is propaganda'],
    answer: () => ({
      text: '• **Misinformation**: false, but shared without intent to harm (someone believed it).\n• **Disinformation**: false and spread deliberately to deceive.\n• **Malinformation**: true information used to cause harm, such as leaked private details.\n\nAll three can do damage, which is why checking before sharing matters.',
    }),
  },
  {
    id: 'forwards',
    keywords: ['whatsapp', 'telegram', 'forward', 'chain message', 'viral message', 'group chat', 'mesej tular', 'tular'],
    answer: () => ({
      text: 'Viral forwards are the most common way false claims spread. Before passing one on:\n\n• "Forwarded many times" means it\'s far from its source.\n• Look for a named, checkable source, not "a friend who works at…".\n• Search a key phrase from it on Sebenarnya.my.\n• If unsure, don\'t forward. Ask the sender where it came from.',
      suggestions: ['How do I spot a scam?'],
    }),
  },
  {
    id: 'scams',
    keywords: ['scam', 'scam tips', 'avoid scam', 'phishing', 'macau scam', 'fraud', 'penipuan', 'tipu', 'otp', 'tac code', 'suspicious link', 'investment scheme', 'love scam', 'parcel scam'],
    answer: () => ({
      text: "Common signs of a scam:\n\n• Pressure to act fast or keep it secret.\n• Requests for your OTP/TAC, banking login or a transfer.\n• Callers claiming to be police, a court or your bank.\n• Returns that sound too good to be true.\n\nNever share an OTP. If you've lost money, call the **National Scam Response Centre at 997** right away, then contact your bank.",
      suggestions: ['How do I report fake news?'],
    }),
    more: "Banks and government agencies won't ask you to move money to a \"safe account\" or install an app from a link. When in doubt, hang up and call the organisation on the number from its official website.",
  },
  {
    id: 'deepfake',
    keywords: ['deepfake', 'deep fake', 'ai image', 'ai generated', 'ai-generated', 'fake video', 'fake photo', 'voice clone', 'edited photo', 'photoshop', 'manipulated'],
    answer: () => ({
      text: "A deepfake is audio, video or an image generated or altered by AI to show someone saying or doing something they didn't.\n\nWatch for: mismatched lip-sync, odd hands or teeth, warped backgrounds, unnatural blinking, flat or robotic voices. Above all, check whether a reputable outlet or the person's official account carries the same clip.",
      suggestions: ['How do I reverse image search?'],
    }),
  },
  {
    id: 'reverse-image',
    keywords: ['reverse image', 'image search', 'check a photo', 'check an image', 'where did this photo', 'old photo', 'gambar'],
    answer: () => ({
      text: "Use Google Lens (right-click an image in Chrome → \"Search image with Google\") or TinEye. They show where else the picture has appeared and when. If it first appeared years ago or in another country, it's being reused out of context.",
    }),
  },
  {
    id: 'satire-clickbait',
    keywords: ['satire', 'parody', 'clickbait', 'headline', 'joke site'],
    answer: () => ({
      text: "Satire sites publish made-up stories on purpose, and they often get shared as real. Check the site's About page. Clickbait headlines exaggerate to get clicks, so read past the headline: the article often says something much milder.",
    }),
  },
  {
    id: 'source-credibility',
    keywords: ['credible source', 'trustworthy source', 'reliable source', 'which sources', 'good sources', 'website trust', 'sumber'],
    answer: () => ({
      text: "Signs of a credible source: a named author, clear contact and correction details, links to original documents, and other reputable outlets reporting the same thing. Be wary of look-alike domains (extra letters, odd endings) and sites with no About page.",
    }),
  },
  {
    id: 'health',
    keywords: ['health', 'vaccine', 'cure', 'covid', 'cancer', 'medicine', 'remedy', 'kesihatan', 'ubat', 'vaksin'],
    answer: () => ({
      text: "Health rumours spread fast because they play on fear. For anything medical, check the **Ministry of Health (KKM)** or the **World Health Organization**, and ask a doctor or pharmacist before trying a \"cure\" you saw online. A miracle cure shared by forward is almost always false.",
    }),
  },
  {
    id: 'elections',
    keywords: ['election', 'vote', 'voting', 'politic*', 'pilihan raya', 'undi', 'spr'],
    answer: () => ({
      text: 'Election rumours often appear close to polling day. For dates, voting locations and rules, rely only on the **Election Commission (SPR)**. Be extra careful with screenshots of "leaked" results or statements; check the party\'s or candidate\'s official channels.',
    }),
  },
  {
    id: 'report',
    keywords: ['report fake', 'report a', 'how to report', 'how do i report', 'where to report', 'lapor*', 'mcmc', 'complain', 'aduan'],
    answer: () => ({
      text: 'You can send a viral claim to Sebenarnya.my for checking (use "Request fact-check" in AIFA). For harmful online content, file a complaint with the **Malaysian Communications and Multimedia Commission (MCMC)**. For scams involving money, call **997**.',
    }),
  },
  {
    id: 'law',
    keywords: ['law', 'illegal', 'section 233', 'akta', 'penalty', 'jail', 'offence', 'arrested', 'undang*'],
    answer: () => ({
      text: "Spreading false content online can be an offence in Malaysia, for example under the Communications and Multimedia Act 1998. The safest habit: don't share what you haven't checked.\n\nThis is general information, not legal advice.",
    }),
  },
  {
    id: 'sebenarnya',
    keywords: ['sebenarnya', 'what is sebenarnya', 'who runs'],
    answer: () => ({
      text: "Sebenarnya.my is Malaysia's portal for checking viral claims and news. AIFA connects to it so you can verify content as you browse and send claims to its reviewers.",
    }),
  },
  {
    id: 'critical-thinking',
    keywords: ['bias', 'confirmation bias', 'echo chamber', 'critical thinking', 'why do people believe', 'why do people share'],
    answer: () => ({
      text: "We all find it easier to believe things that match what we already think (confirmation bias), and feeds keep showing us more of the same. A useful habit: before sharing, ask \"would I believe this if it said the opposite?\" and look for one source that disagrees.",
    }),
  },
  {
    id: 'ai-general',
    keywords: ['ai', 'what is ai', 'artificial intelligence', 'chatgpt', 'llm', 'machine learning', 'are you ai', 'are you a robot', 'are you real'],
    answer: () => ({
      text: "AI systems learn patterns from large amounts of data to do tasks like recognising text or images. AIFA would use AI to find claims in an article and compare them with evidence.\n\nIn this demonstration my replies are pre-written rather than generated, so I'm best on fact-checking topics.",
    }),
  },

  /* ---- Small talk & live info ---- */
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'hai', 'helo', 'assalamualaikum', 'good morning', 'good afternoon', 'good evening', 'selamat pagi', 'selamat petang'],
    answer: () => ({ text: 'Hello! What would you like to check today?' }),
  },
  {
    id: 'how-are-you',
    keywords: ['how are you', 'apa khabar', "how's it going"],
    answer: () => ({ text: "I'm doing well, thanks for asking! Ready to help you check anything that looks suspicious." }),
  },
  {
    id: 'identity',
    keywords: ['who are you', 'your name', 'what are you', 'siapa kamu', 'siapa awak', 'who made you', 'who built you', 'who created you'],
    answer: () => ({
      text: "I'm AIFA, the fact-checking assistant in the Sebenarnya.my browser extension. This version is a client demonstration prototype.",
    }),
  },
  {
    id: 'capabilities',
    keywords: ['what can you do', 'what can i ask', 'help me', 'help', 'boleh buat apa', 'features'],
    answer: () => ({
      text: "I can:\n\n• Summarise and check the article or post you're on.\n• Explain verdicts and how AIFA works.\n• Give tips on fake news, scams, deepfakes and viral forwards.\n• Tell you the status of your fact-check inquiries.\n• Answer simple sums and tell you the date or time.",
      suggestions: ['How do I spot fake news?', 'Status of my inquiries'],
    }),
  },
  {
    id: 'joke',
    keywords: ['joke', 'funny', 'lawak', 'make me laugh'],
    answer: () => ({
      text: "Why did the rumour go to school? To get a little more fact-ual. 😄\n\nThe serious bit: plenty of people share links without reading past the headline, so open the article first.",
    }),
  },
  {
    id: 'weather',
    keywords: ['weather', 'rain', 'cuaca', 'hujan', 'temperature', 'flood', 'banjir'],
    answer: () => ({
      text: "I can't see live weather in this demo. For forecasts and warnings, check **MetMalaysia**; for flood updates, the official **Public InfoBanjir** site. Be careful with forwarded flood videos, which are often from past years.",
    }),
  },
  {
    id: 'news-today',
    keywords: ['latest news', "today's news", 'news today', 'berita terkini', 'what happened today', 'headlines'],
    answer: () => ({
      text: "I can't browse live news in this demo. Open a news site in this browser and I'll help you check any article you find there.",
    }),
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'terima kasih', 'tq', 'appreciate'],
    answer: () => ({ text: "You're welcome! Check before you share." }),
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'jumpa lagi', 'selamat tinggal'],
    answer: () => ({ text: 'Goodbye! Come back any time something looks off.' }),
  },
];

/* ------------------------------------------------------------------ */
/* Special handlers                                                    */
/* ------------------------------------------------------------------ */

/** Tiny arithmetic parser (+ - * / parentheses). Never uses eval. */
const calculate = (expr: string): number | null => {
  const tokens = expr.match(/\d+(?:\.\d+)?|[+\-*/()]/g);
  if (!tokens || tokens.join('') !== expr.replace(/\s+/g, '')) return null;
  let i = 0;
  const parseFactor = (): number => {
    const t = tokens[i++];
    if (t === '-') return -parseFactor();
    if (t === '(') {
      const v = parseExpr();
      if (tokens[i++] !== ')') throw new Error('paren');
      return v;
    }
    const n = Number(t);
    if (Number.isNaN(n)) throw new Error('nan');
    return n;
  };
  const parseTerm = (): number => {
    let v = parseFactor();
    while (tokens[i] === '*' || tokens[i] === '/') {
      const op = tokens[i++];
      const r = parseFactor();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  };
  const parseExpr = (): number => {
    let v = parseTerm();
    while (tokens[i] === '+' || tokens[i] === '-') {
      const op = tokens[i++];
      const r = parseTerm();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  try {
    const v = parseExpr();
    return i === tokens.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};

const mathReply = (q: string): Reply | null => {
  const expr = q
    .replace(/^(what is|what's|calculate|kira|berapa)\s*/i, '')
    .replace(/[?=]/g, '')
    .replace(/[x×]/g, '*')
    .replace(/÷/g, '/')
    .trim();
  if (!/\d/.test(expr) || !/[+\-*/]/.test(expr) || /[a-z]/i.test(expr)) return null;
  const v = calculate(expr);
  if (v === null) return null;
  const shown = Number.isInteger(v) ? v.toLocaleString('en-MY') : Number(v.toFixed(6)).toLocaleString('en-MY');
  return { text: `${expr.replace(/\*/g, '×')} = **${shown}**` };
};

const timeReply = (q: string): Reply | null => {
  const now = new Date();
  if (/(what time|time now|current time|the time|pukul berapa|jam berapa)/.test(q)) {
    return { text: `It's ${now.toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' })} on your device.` };
  }
  if (/(what day|today's date|what date|date today|tarikh|hari apa)/.test(q)) {
    return {
      text: `Today is ${now.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`,
    };
  }
  return null;
};

const MORE_PATTERN = /^(tell me more|more|more please|explain more|elaborate|go on|and\??|lagi|terangkan lagi|why\??)$/;

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

const normalise = (s: string) =>
  ` ${s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'@;+\-*/ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const patternCache = new Map<string, RegExp>();
const keywordPattern = (kw: string) => {
  let re = patternCache.get(kw);
  if (!re) {
    re = kw.endsWith('*')
      ? new RegExp(` ${escapeRegExp(kw.slice(0, -1))}`)
      : new RegExp(` ${escapeRegExp(kw)}(?:s|es|d|ed|ing|'s)? `);
    patternCache.set(kw, re);
  }
  return re;
};

/** Phrases weigh more than single words, so "fake news" beats a bare "fake". */
const scoreTopic = (q: string, topic: Topic) =>
  topic.keywords.reduce((score, kw) => {
    if (!keywordPattern(kw).test(q)) return score;
    const words = kw.split(' ').length;
    return score + words * words + (kw.length >= 6 ? 0.5 : 0);
  }, 0);

const looksLikeClaim = (q: string) =>
  /^ (is it true|is it real|did |does |is |are |was |were |will |benarkah|betul ke|adakah|ke )/.test(q) ||
  q.includes(' true that ') ||
  q.includes(' heard that ') ||
  q.includes(' saw that ');

export const generateReply = (input: string, ctx: ChatContext, history: ChatMessage[]): ChatMessage => {
  const raw = input.trim();
  const q = normalise(raw);

  // "Tell me more" continues the previous topic.
  if (MORE_PATTERN.test(raw.toLowerCase())) {
    const lastTopicId = [...history].reverse().find((m) => m.role === 'assistant' && m.topic)?.topic;
    const topic = TOPICS.find((t) => t.id === lastTopicId);
    if (topic?.more) return makeMessage('assistant', topic.more, { topic: topic.id });
    return makeMessage('assistant', "That's the main point on that one. Ask me something related and I'll dig in.", {
      suggestions: ['How do I check a claim?', 'How do I spot a scam?'],
    });
  }

  const special = mathReply(raw) ?? timeReply(q);
  if (special) return makeMessage('assistant', special.text, { topic: 'utility' });

  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const s = scoreTopic(q, topic);
    if (s > bestScore) {
      best = topic;
      bestScore = s;
    }
  }

  if (best) {
    const r = best.answer(ctx);
    return makeMessage('assistant', r.text, { topic: best.id, action: r.action, suggestions: r.suggestions });
  }

  // Unmatched: be honest, and turn it into something useful.
  if (looksLikeClaim(q)) {
    return makeMessage(
      'assistant',
      "I can't confirm that one in this demo: I don't have live access to news or official records. Here's how to check it yourself:\n\n1. Search the claim on **Sebenarnya.my**.\n2. Look for an official statement or the original source.\n3. See whether 2–3 reputable outlets report the same thing.\n\nIf it's going viral and you still can't tell, request a fact-check so Sebenarnya.my's reviewers can look into it.",
      { topic: 'fallback-claim', suggestions: ['How do I request a fact-check?', 'How do I spot fake news?'] }
    );
  }
  return makeMessage(
    'assistant',
    "I don't have a reliable answer to that in this demo; I'm built mainly for fact-checking and staying safe online. Try asking me about fake news, scams, deepfakes, viral forwards, a claim you've seen, or the page you're on.",
    { topic: 'fallback', suggestions: ['What can you do?', 'How do I check a claim?'] }
  );
};
