import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Download, Sparkles, TrendingUp, Upload } from "lucide-react";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedSection from "@/components/FeaturedSection";
import ProductGrid from "@/components/ProductGrid";
import MouseGumbol from "@/components/MouseGumbol";
const tabs = [
  ["Trending", "trending", TrendingUp],
  ["Newest", "newest", Sparkles],
  ["Top Selling", "top-selling", Boxes],
] as const;

export default function Home() {
  return (
    <><MouseGumbol />
      <Hero />
      <Categories />

      <section className="border-b border-white/[0.06] py-12">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand">Marketplace feed</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Discover models people are downloading</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/40">Browse fresh uploads, community favorites and professional assets from OceanTrade creators.</p>
            </div>
            <Link href="/models" className="inline-flex items-center gap-2 text-xs font-bold text-brand">Browse all models <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {tabs.map(([label, sort, Icon], i) => <Link key={sort} href={`/models?sort=${sort}`} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${i === 0 ? "border-brand/30 bg-brand/10 text-brand" : "border-white/10 bg-white/[0.025] text-white/55 hover:text-white"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>)}
            <Link href="/models?free=true" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-bold text-white/55 hover:text-white">Free models</Link>
          </div>
          <div className="mt-7"><ProductGrid limit={8} sort="trending" /></div>
        </div>
      </section>

      <FeaturedSection />

      <section className="border-y border-white/[0.06] bg-[#08131f] py-14">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand">Made for professionals</p><h2 className="mt-2 text-2xl font-bold text-white">A marketplace built around the details</h2></div>
            <p className="max-w-xl text-sm leading-6 text-white/40">Compare formats, pricing, creator reputation and licensing before you download the asset you need.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [BadgeCheck, "Verified creators", "Buy from established artists and studios."],
              [Download, "Instant downloads", "Get your files immediately after purchase."],
              [Boxes, "Many formats", "Keep your workflow flexible across DCC tools."],
              [Sparkles, "Curated discovery", "Find polished assets without endless scrolling."],
            ].map(([Icon, title, body]) => <div key={title as string} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><Icon className="h-5 w-5 text-brand" /><h3 className="mt-4 text-sm font-bold text-white">{title as string}</h3><p className="mt-2 text-xs leading-5 text-white/40">{body as string}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-site px-4 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/12 via-white/[0.025] to-transparent p-7 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-brand"><Upload className="h-3.5 w-3.5" /> Creator program</div><h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white">Your models deserve a storefront.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">Upload your best assets, build a recognizable profile and put your work in front of a focused 3D audience.</p></div>
              <Link href="/admin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(20,184,166,.2)]">Start selling <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0a1421] py-12">
        <div className="mx-auto grid max-w-site grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4 lg:px-8">
          {[["2M+", "3D assets"], ["120K+", "Creators"], ["190+", "File formats"], ["24/7", "Marketplace access"]].map(([value, label]) => <div key={label}><div className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</div><div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/40">{label}</div></div>)}
        </div>
      </section>
    </>
  );
}
