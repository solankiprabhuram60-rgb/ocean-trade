"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ExternalLink, Loader2, MessageCircle, Search, Sparkles, X } from "lucide-react";

type Recommendation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  price: number;
  isFree: boolean;
  isPremium: boolean;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  recommendations?: Recommendation[];
  searchQuery?: string;
};

const starters = [
  "I need a low-poly vehicle for a game",
  "Show me free animal models",
  "Find premium architecture assets",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I’m OceanTrade AI. Tell me what kind of 3D asset you need and I’ll search the marketplace and recommend matching models.",
    },
  ]);

  async function ask(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply,
          recommendations: data.recommendations,
          searchQuery: data.searchQuery,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "I couldn’t complete that search right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30"
        aria-label="Open OceanTrade AI"
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="fixed bottom-24 right-5 z-[60] flex h-[min(680px,calc(100vh-120px))] w-[min(430px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#08131f]/98 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand"><Sparkles className="h-5 w-5" /></div>
                <div><div className="text-sm font-extrabold text-white">OceanTrade AI</div><div className="text-[10px] text-white/35">AI search · recommendations · assistant</div></div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={message.role === "user" ? "ml-8" : "mr-4"}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-brand text-white" : "border border-white/[0.07] bg-white/[0.035] text-white/75"}`}>
                    {message.text}
                  </div>
                  {message.recommendations?.length ? (
                    <div className="mt-2 space-y-2">
                      {message.recommendations.map((product) => (
                        <Link key={product.id} href={`/models/${product.slug}`} className="block rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-brand/30 hover:bg-brand/[0.05]">
                          <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold text-white">{product.title}</div><div className="mt-1 text-[10px] text-white/35">{product.category} · by {product.author}</div></div><ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/30" /></div>
                          <div className="mt-2 text-[11px] font-bold text-brand">{product.isFree ? "Free" : `$${product.price.toFixed(2)}`}</div>
                        </Link>
                      ))}
                      {message.searchQuery && <Link href={`/models?q=${encodeURIComponent(message.searchQuery)}`} className="flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2.5 text-xs font-bold text-brand hover:bg-brand/15"><Search className="h-3.5 w-3.5" /> Open marketplace search</Link>}
                    </div>
                  ) : null}
                </div>
              ))}
              {loading && <div className="mr-4 flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-xs text-white/45"><Loader2 className="h-4 w-4 animate-spin text-brand" /> Searching OceanTrade...</div>}
              {messages.length === 1 && <div className="space-y-2 pt-2">{starters.map((starter) => <button key={starter} onClick={() => void ask(starter)} className="block w-full rounded-xl border border-white/[0.07] px-3 py-2 text-left text-xs text-white/55 hover:border-brand/25 hover:text-white">{starter}</button>)}</div>}
            </div>

            <form onSubmit={submit} className="border-t border-white/[0.07] p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 focus-within:border-brand/40">
                <MessageCircle className="h-4 w-4 shrink-0 text-white/30" />
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for a 3D model..." className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/30" />
                <button disabled={!input.trim() || loading} className="rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Ask</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
