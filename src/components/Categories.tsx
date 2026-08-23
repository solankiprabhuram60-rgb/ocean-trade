"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, formatCount } from "@/lib/data";

export default function Categories() {
  return (
    <section className="border-b border-white/[0.06] bg-[#091521] py-12">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <div className="flex items-end justify-between gap-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand">Browse by category</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Explore 3D assets</h2><p className="mt-2 max-w-xl text-sm text-white/40">Start with a category, then filter by format, price and style.</p></div>
          <Link href="/models" className="hidden items-center gap-2 text-xs font-bold text-brand sm:inline-flex">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {categories.map((category) => <Link key={category.id} href={`/models?category=${encodeURIComponent(category.name.toLowerCase())}`} className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"><div className="relative aspect-[1.2/1] overflow-hidden"><Image src={category.image} alt={category.name} fill sizes="180px" className="object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /></div><div className="p-3"><div className="truncate text-xs font-bold text-white group-hover:text-brand">{category.name}</div><div className="mt-1 text-[10px] text-white/35">{formatCount(category.count)} assets</div></div></Link>)}
        </div>
      </div>
    </section>
  );
}
