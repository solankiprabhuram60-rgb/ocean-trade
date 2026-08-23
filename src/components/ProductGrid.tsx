"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, PackageOpen, ScanEye } from "lucide-react";
import { featuredProducts } from "@/lib/data";
import ProductCard from "./ProductCard";
import { VISUAL_RESULTS_KEY } from "./SearchBar";
import type { ProductDTO } from "@/types/product";

interface ProductGridProps {
  query?: string;
  category?: string;
  sort?: string;
  limit?: number;
  showEmpty?: boolean;
}

function ProductGridContent({
  query: queryProp = "",
  category = "",
  sort: sortProp = "newest",
  limit,
  showEmpty = true,
}: ProductGridProps) {
  const searchParams = useSearchParams();

  const query = queryProp || searchParams.get("q") || "";
  const sort = sortProp || searchParams.get("sort") || "newest";
  const authorParam = searchParams.get("author") || "";
  const mode = searchParams.get("mode");

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [visualMessage, setVisualMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      if (mode === "visual") {
        try {
          const raw = sessionStorage.getItem(VISUAL_RESULTS_KEY);

          if (raw) {
            const data = JSON.parse(raw);
            const items: ProductDTO[] = data.products || [];

            setProducts(limit ? items.slice(0, limit) : items);
            setCount(data.count || 0);
            setVisualMessage(data.message || "");
            setLoading(false);

            return;
          }
        } catch {
          // Fall through to API request.
        }
      }

      const params = new URLSearchParams();

      if (query) params.set("q", query);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      if (authorParam) params.set("author", authorParam);
      if (limit) params.set("limit", String(limit));

      try {
        const res = await fetch(`/api/products?${params.toString()}`);

        const contentType = res.headers.get("content-type") || "";

        if (
          !res.ok ||
          !contentType.includes("application/json")
        ) {
          throw new Error("Catalog API unavailable");
        }

        const data = await res.json();

        setProducts(data.products || []);
        setCount(data.count || 0);
      } catch {
        // Fallback demo products
        const demo: ProductDTO[] = featuredProducts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: "Curated OceanTrade preview asset",
          price: p.price,
          category: p.category,
          author: p.author,
          imageUrl: p.image,
          fileUrl: "#",
          fileName: "preview.glb",
          tags: p.tags,
          isFree: Boolean(p.isFree),
          isPremium: Boolean(p.isPremium),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setProducts(limit ? demo.slice(0, limit) : demo);
        setCount(demo.length);
      } finally {
        setVisualMessage("");
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query, category, sort, limit, mode, authorParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (products.length === 0 && showEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card flex flex-col items-center justify-center py-16 text-center"
      >
        <PackageOpen className="mb-4 h-12 w-12 text-white/30" />

        <h3 className="text-lg font-semibold text-white">
          No products found
        </h3>

        <p className="mt-2 text-sm text-white/50">
          {mode === "visual"
            ? "No similar designs found. Try another image."
            : query
              ? `No results for "${query}". Try a different search.`
              : "No products uploaded yet."}
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {mode === "visual" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand">
          <ScanEye className="h-4 w-4" />

          {visualMessage ||
            `Showing ${count} similar design(s) based on your image`}
        </div>
      )}

      {query && mode !== "visual" && (
        <p className="mb-6 text-sm text-white/50">
          {count} result{count !== 1 ? "s" : ""} for &ldquo;
          {query}
          &rdquo;
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      }
    >
      <ProductGridContent {...props} />
    </Suspense>
  );
}