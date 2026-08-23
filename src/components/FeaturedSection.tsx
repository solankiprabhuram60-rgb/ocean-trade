"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import ProductGrid from "./ProductGrid";

export default function FeaturedSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end">
          <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-brand"><Flame className="h-3.5 w-3.5" /> Trending marketplace</div><h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Popular 3D models</h2><p className="mt-2 text-sm text-white/40">Fresh uploads and community favorites, updated as your catalog grows.</p></div>
          <div className="flex gap-2"><Link href="/models?sort=trending" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/60 hover:text-white">Trending</Link><Link href="/models" className="inline-flex items-center gap-1 rounded-lg bg-white/[0.05] px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/[0.08]">View all <ArrowRight className="h-3 w-3" /></Link></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8"><ProductGrid limit={8} sort="newest" /></motion.div>
        <div className="mt-12 rounded-2xl border border-brand/15 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-brand"><Sparkles className="h-3.5 w-3.5" /> For creators</div><h3 className="mt-2 text-xl font-bold text-white">Turn your 3D work into a storefront.</h3><p className="mt-1 max-w-2xl text-sm text-white/40">Upload models, add clean previews and let buyers discover your work through OceanTrade search.</p></div><Link href="/admin" className="shrink-0 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-500">Start selling</Link></div></div>
      </div>
    </section>
  );
}
