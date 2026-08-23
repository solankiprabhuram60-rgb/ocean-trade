"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState, useEffect } from "react";
import { Search, ImageIcon, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";

const VISUAL_RESULTS_KEY = "ocean-visual-search-results";

interface SearchBarProps {
  placeholder?: string;
  size?: "sm" | "lg";
  defaultValue?: string;
  className?: string;
  showOnlyMine?: boolean;
}

export default function SearchBar({
  placeholder = "Search 3D models...",
  size = "sm",
  defaultValue = "",
  className = "",
  showOnlyMine = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultValue || searchParams.get("q") || "");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searching, setSearching] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || defaultValue);
  }, [searchParams, defaultValue]);

  function handleTextSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    const name = typeof window !== 'undefined' ? localStorage.getItem('ocean_uploader_name') : null;
    if (trimmed) {
      const authorParam = onlyMine && name ? `&author=${encodeURIComponent(name)}` : "";
      router.push(`/models?q=${encodeURIComponent(trimmed)}${authorParam}`);
    } else {
      const authorParam = onlyMine && name ? `?author=${encodeURIComponent(name)}` : "";
      router.push(`/models${authorParam}`);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setQuery("");
  }

  function clearImage() {
    setImageFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleVisualSearch() {
    if (!imageFile) {
      fileInputRef.current?.click();
      return;
    }

    setSearching(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/products", { method: "POST", body: formData });
      const data = await res.json();

      // If user requested only their uploads, filter client-side by stored uploader name
      if (onlyMine && typeof window !== 'undefined') {
        const name = localStorage.getItem('ocean_uploader_name');
        if (name) {
          data.products = (data.products || []).filter((p: any) => p.author === name);
          data.count = data.products.length;
        }
      }

      sessionStorage.setItem(VISUAL_RESULTS_KEY, JSON.stringify(data));
      router.push("/models?mode=visual");
    } catch {
      alert("Visual search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (imageFile) {
      await handleVisualSearch();
    } else {
      handleTextSubmit(e);
    }
  }

  const isLarge = size === "lg";

  return (
    <div className={className}>
      <motion.form
        onSubmit={handleSubmit}
        className={`relative flex items-center overflow-hidden ${isLarge ? "rounded-2xl" : "rounded-xl"} glass`}
        whileFocus={{ scale: 1.01 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`shrink-0 text-white/50 transition hover:text-brand ${
            isLarge ? "pl-4" : "pl-3"
          }`}
          title="Search by image — find similar designs"
        >
          <ImageIcon className={isLarge ? "h-5 w-5" : "h-4 w-4"} />
        </button>

        {preview ? (
          <div className="relative mx-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Search preview"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-brand/50"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ) : null}

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            imageFile
              ? "Click search to find similar designs..."
              : placeholder
          }
          disabled={!!imageFile}
          className={`min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40 disabled:opacity-60 ${
            isLarge ? "px-2 py-4 text-base" : "px-2 py-2.5 text-sm"
          }`}
        />

        <motion.button
          type="submit"
          disabled={searching}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex shrink-0 items-center justify-center bg-brand text-white transition hover:bg-brand-500 disabled:opacity-70 ${
            isLarge ? "px-8" : "px-4"
          }`}
          title={imageFile ? "Find similar designs" : "Search"}
        >
          {searching ? (
            <Loader2 className={`animate-spin ${isLarge ? "h-5 w-5" : "h-4 w-4"}`} />
          ) : (
            <Search className={isLarge ? "h-5 w-5" : "h-4 w-4"} />
          )}
        </motion.button>
      </motion.form>

      {showOnlyMine && <div className="mt-2 flex items-center gap-2">
        <label className="inline-flex items-center gap-2 text-xs text-white/60">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => {
              const next = e.target.checked;
              if (next && typeof window !== 'undefined') {
                const existing = localStorage.getItem('ocean_uploader_name');
                if (!existing) {
                  const name = window.prompt('Enter your uploader name (this filters uploads by author)');
                  if (name && name.trim()) {
                    localStorage.setItem('ocean_uploader_name', name.trim());
                    setOnlyMine(true);
                    return;
                  } else {
                    // abort enabling
                    setOnlyMine(false);
                    return;
                  }
                }
              }
              setOnlyMine(next);
            }}
          />
          Only show my uploads
        </label>
      </div>}

      {imageFile && (
        <p className="mt-2 text-center text-xs text-brand/80">
          Image selected — search will find similar uploaded designs
        </p>
      )}
    </div>
  );
}

export { VISUAL_RESULTS_KEY };
