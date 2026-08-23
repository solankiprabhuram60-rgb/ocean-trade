"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingCart, Upload, UserRound, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { useCart } from "@/context/CartContext";

const browse = [
  ["All 3D Models", "/models"],
  ["Characters", "/models?category=character"],
  ["Vehicles", "/models?category=vehicle"],
  ["Architecture", "/models?category=architectural"],
  ["3D Printing", "/models?category=3d-print"],
];

function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative rounded-lg p-2 text-white/65 transition hover:bg-white/5 hover:text-white" aria-label="Cart">
      <ShoppingCart className="h-[18px] w-[18px]" />
      {count > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{count}</span>}
    </Link>
  );
}

function HeaderSearch() {
  return <Suspense fallback={<div className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.035]" />}><SearchBar size="sm" className="w-full" showOnlyMine={false} /></Suspense>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  return (
    <motion.header initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#07111d]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-site items-center gap-5 px-4 lg:px-8">
        <Link href="/" className="group shrink-0 leading-none">
          <div className="text-[22px] font-extrabold tracking-[-0.06em]"><span className="text-brand">ocean</span><span className="text-white">trade</span></div>
          <div className="mt-1 text-[8px] font-bold tracking-[0.25em] text-white/30">3D MARKETPLACE</div>
        </Link>

        <div className="hidden min-w-0 flex-1 md:block md:max-w-[620px]"><HeaderSearch /></div>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <div className="relative">
            <button onClick={() => setBrowseOpen(!browseOpen)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white">
              Browse <ChevronDown className={`h-3.5 w-3.5 transition ${browseOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>{browseOpen && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 top-11 w-52 rounded-xl border border-white/10 bg-[#0b1725] p-2 shadow-2xl">
              {browse.map(([label, href]) => <Link key={href} href={href} onClick={() => setBrowseOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">{label}</Link>)}
            </motion.div>}</AnimatePresence>
          </div>
          <Link href="/collections" className="rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white">Collections</Link>
          <Link href="/admin" className="rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white">Sell</Link>
          <CartButton />
          <Link href="/admin" className="ml-1 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75 hover:border-brand/40 hover:text-white"><UserRound className="h-3.5 w-3.5" /> Account</Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:hidden"><CartButton /><button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-white/70 hover:bg-white/5">{open ? <X /> : <Menu />}</button></div>
      </div>

      <div className="hidden border-t border-white/[0.05] lg:block">
        <div className="mx-auto flex h-10 max-w-site items-center gap-7 px-4 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Explore</span>
          {[['Newest','/models?sort=newest'],['Top Selling','/models?sort=top-selling'],['Trending','/models?sort=trending'],['Free Models','/models?q=free'],['3D Print','/models?category=3d-print']].map(([label,href]) => <Link key={href} href={href} className="text-xs font-semibold text-white/55 hover:text-brand">{label}</Link>)}
          <span className="ml-auto text-[10px] text-white/25">Original marketplace experience · built on OceanTrade</span>
        </div>
      </div>

      <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/[0.06] bg-[#07111d] px-4 pb-5 lg:hidden"><div className="pt-4"><HeaderSearch /></div><div className="mt-4 grid grid-cols-2 gap-1">{browse.map(([label,href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white/65 hover:bg-white/5">{label}</Link>)}</div><Link href="/admin" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white"><Upload className="h-4 w-4" /> Sell your models</Link></motion.div>}</AnimatePresence>
    </motion.header>
  );
}
