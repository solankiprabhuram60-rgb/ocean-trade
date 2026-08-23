"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Upload, Zap } from "lucide-react";
import SearchBar from "./SearchBar";

const chips = ["Game Ready", "Architecture", "Characters", "Vehicles", "3D Printing"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#07121f]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[100px]" />

      <div className="relative mx-auto grid max-w-site items-center gap-12 px-4 py-16 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:py-[76px]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-brand"><Sparkles className="h-3.5 w-3.5" /> Professional 3D assets</div>
          <h1 className="mt-6 max-w-[720px] text-4xl font-extrabold leading-[1.02] tracking-[-.045em] text-white sm:text-5xl lg:text-[62px]">Find the right <span className="text-brand">3D model</span> for your next project.</h1>
          <p className="mt-5 max-w-[640px] text-base leading-7 text-white/48 sm:text-lg">Explore game-ready assets, architecture, characters, vehicles and 3D-printable designs from the OceanTrade community.</p>
          <div className="mt-8 max-w-[720px]"><Suspense fallback={<div className="h-14 rounded-xl bg-white/5" />}><SearchBar size="lg" placeholder="Search 3D models, categories, tags..." /></Suspense></div>
          <div className="mt-5 flex flex-wrap gap-2">{chips.map((chip) => <Link key={chip} href={`/models?q=${encodeURIComponent(chip)}`} className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-white/50 hover:border-brand/30 hover:text-brand">{chip}</Link>)}</div>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/models" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(25,191,165,.2)] hover:bg-brand-500">Explore models <ArrowRight className="h-4 w-4" /></Link><Link href="/admin" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white/80 hover:bg-white/[0.07]"><Upload className="h-4 w-4" /> Sell your models</Link></div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/35"><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-brand" /> Verified creators</span><span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-brand" /> Instant downloads</span><span className="inline-flex items-center gap-1.5">Free & premium assets</span></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .96, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .65, delay: .08 }} className="relative mx-auto w-full max-w-[560px]">
          <div className="rounded-2xl border border-white/10 bg-[#0a1726] p-3 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-3 pb-3"><div className="text-[10px] font-bold tracking-[.18em] text-white/30">OCEANTRADE / FEATURED</div><div className="flex items-center gap-1.5 text-[10px] font-bold text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> LIVE</div></div>
            <div className="relative mt-3 aspect-[1.35/1] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_45%,rgba(25,191,165,.16),transparent_36%),linear-gradient(135deg,#0c2232,#07131f)]">
              <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20 [transform-style:preserve-3d]" />
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-[22deg] rounded-[50%] border border-brand/30" />
              <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] rounded-[50%] border border-brand/20" />
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border-[9px] border-brand/80 shadow-[0_0_50px_rgba(25,191,165,.25)]"><div className="h-8 w-8 bg-brand/15" /></div>
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#102233]/90 px-3 py-2 backdrop-blur"><div className="text-[9px] font-bold tracking-[.16em] text-brand">EDITOR'S PICK</div><div className="mt-1 text-sm font-semibold text-white">Next-gen 3D marketplace</div></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">{[["01","Verified creators"],["02","Instant downloads"],["03","Flexible licenses"]].map(([n,t]) => <div key={n} className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3"><div className="text-[9px] font-bold text-white/25">{n}</div><div className="mt-1 text-[10px] font-semibold text-white/55">{t}</div></div>)}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
