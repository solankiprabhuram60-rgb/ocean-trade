"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";

function ModelsContent() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const sort = params.get("sort") || "newest";
  const category = params.get("category") || "";
  return <>
    <div className="flex flex-col gap-3 sm:flex-row"><SearchBar defaultValue={query} size="lg" placeholder="Search models, creators, categories or tags..." className="flex-1" /><button className="hidden items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/60 sm:flex"><SlidersHorizontal className="h-4 w-4" /> Filters</button></div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[210px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-28 rounded-xl border border-white/[0.07] bg-[#0a1522] p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.14em] text-white/50">Filters</span><Filter className="h-3.5 w-3.5 text-white/30" /></div><div className="mt-5 border-t border-white/[0.06] pt-4"><div className="text-xs font-bold text-white">Category</div><div className="mt-3 space-y-2">{["All models","Character","Vehicle","Architecture","Interior","3D Print"].map((item) => <label key={item} className="flex items-center gap-2 text-xs text-white/45"><input type="radio" defaultChecked={(item === "All models" && !category) || item.toLowerCase() === category} className="accent-[rgb(25,191,165)]" />{item}</label>)}</div></div><div className="mt-5 border-t border-white/[0.06] pt-4"><div className="text-xs font-bold text-white">Price</div><div className="mt-3 space-y-2">{["Free","Under $25","$25 – $50","$50+"] .map((item) => <label key={item} className="flex items-center gap-2 text-xs text-white/45"><input type="checkbox" className="accent-[rgb(25,191,165)]" />{item}</label>)}</div></div><div className="mt-5 border-t border-white/[0.06] pt-4"><div className="text-xs font-bold text-white">Formats</div><div className="mt-3 flex flex-wrap gap-1.5">{["GLB","FBX","OBJ","BLEND","STL"].map((item) => <span key={item} className="rounded-md border border-white/10 px-2 py-1 text-[9px] font-bold text-white/40">{item}</span>)}</div></div></div></aside>
      <div><div className="mb-5 flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">{query ? `Results for “${query}”` : category ? `${category} models` : "Browse 3D models"}</h1><p className="mt-1 text-xs text-white/35">Professional assets for games, visualization and 3D printing.</p></div><div className="relative"><select defaultValue={sort} className="appearance-none rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-3 pr-8 text-xs font-semibold text-white/60 outline-none"><option value="newest">Newest</option><option value="trending">Trending</option><option value="top-selling">Top selling</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3.5 w-3.5 text-white/30" /></div></div><ProductGrid query={query} category={category} sort={sort} /></div>
    </div>
  </>;
}

export default function ModelsPage() {
  return <div className="min-h-screen py-10"><div className="mx-auto max-w-site px-4 lg:px-8"><motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand">OceanTrade marketplace</p></motion.div><Suspense fallback={<div className="py-20 text-center text-white/40">Loading catalog…</div>}><ModelsContent /></Suspense></div></div>;
}
