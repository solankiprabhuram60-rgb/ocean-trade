import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, Crown, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import ProductGrid from "@/components/ProductGrid";
import ProductActions from "@/components/ProductActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Model Not Found" };
  return {
    title: `${product.title} — Ocean Trade`,
    description: product.description,
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const serialized = serializeProduct(product);

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-site px-4 lg:px-8">
        <Link
          href="/models"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to models
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="glass-card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={serialized.imageUrl}
                alt={serialized.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex flex-wrap gap-2">
              {serialized.isPremium && (
                <span className="flex items-center gap-1 rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              )}
              {serialized.isFree && (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                  Free
                </span>
              )}
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                {serialized.category}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">{serialized.title}</h1>
            <p className="mt-2 text-white/50">by {serialized.author}</p>

            <div className="mt-6">
              {serialized.isFree ? (
                <span className="text-4xl font-bold text-green-400">Free</span>
              ) : (
                <span className="text-4xl font-bold text-white">
                  ${serialized.price.toFixed(2)}
                </span>
              )}
            </div>

            <ProductActions product={serialized} />

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-brand/10 p-4 text-sm text-brand-200">
              <Shield className="h-4 w-4 shrink-0" />
              Royalty-free license included.
            </div>

            <div className="mt-6">
              <h2 className="font-semibold text-white">Description</h2>
              <p className="mt-3 leading-relaxed text-white/60">{serialized.description}</p>
              {serialized.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {serialized.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/models?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/50 transition hover:bg-brand/20 hover:text-brand"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-white">More Models</h2>
          <ProductGrid category={serialized.category} limit={4} showEmpty={false} />
        </section>
      </div>
    </div>
  );
}
