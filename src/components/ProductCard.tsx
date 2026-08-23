"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Download, Heart, Star } from "lucide-react";

import AddToCartButton from "./AddToCartButton";
import type { ProductDTO } from "@/types/product";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductDTO;
  index?: number;
}) {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          border
          border-white/[0.07]
          bg-[#0a1522]
          transition-all
          duration-300
          hover:border-teal-400/30
          hover:shadow-[0_0_35px_rgba(45,212,191,0.08)]
        "
      >
        {/* Mouse-following teal glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
          style={{
            background: `
              radial-gradient(
                450px circle at ${mouse.x}% ${mouse.y}%,
                rgba(45, 212, 191, 0.16),
                transparent 55%
              )
            `,
          }}
        />

        
        <div
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            z-[2]
            h-px
            opacity-0
            transition-opacity
            duration-200
            group-hover:opacity-100
          "
          style={{
            top: `${mouse.y}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(45,212,191,0.9), transparent)",
            boxShadow:
              "0 0 18px 5px rgba(45,212,191,0.35)",
          }}
        />

        {/* Image */}
        <div className="relative z-[3] aspect-[4/3] overflow-hidden">
          <Link
            href={`/models/${product.slug}`}
            className="absolute inset-0 z-10"
            aria-label={product.title}
          />

          {/* Horizontal teal light */}
<div
  className="
    pointer-events-none
    absolute
    left-[-15%]
    right-[-15%]
    z-[2]
    h-[5px]
    opacity-0
    transition-opacity
    duration-200
    group-hover:opacity-100
  "
  style={{
    top: `${mouse.y}%`,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.85) 10%, rgba(45,212,191,1) 50%, rgba(45,212,191,0.15) 90%, transparent 100%)",
    boxShadow:
      "0 0 12px 3px rgba(45,212,191,0.65), 0 0 35px 8px rgba(45,212,191,0.35)",
  }}
/>

          {/* Image overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#0a1522]
              via-transparent
              to-transparent
              opacity-70
            "
          />

          {/* Premium badge */}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.isPremium && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-md
                  border
                  border-yellow-400/20
                  bg-black/40
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-yellow-300
                  backdrop-blur-md
                "
              >
                <Crown size={11} />
                PREMIUM
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div
            className="
              absolute
              right-3
              top-3
              z-20
              flex
              gap-1.5
            "
          >
            <button
              type="button"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                border
                border-white/10
                bg-black/40
                text-white/70
                backdrop-blur-md
                transition-all
                hover:border-teal-400/40
                hover:bg-teal-400/10
                hover:text-teal-300
              "
            >
              <Heart size={14} />
            </button>

            <button
              type="button"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                border
                border-white/10
                bg-black/40
                text-white/70
                backdrop-blur-md
                transition-all
                hover:border-teal-400/40
                hover:bg-teal-400/10
                hover:text-teal-300
              "
            >
              <Download size={14} />
            </button>
          </div>

          {/* Bottom stats */}
          <div
            className="
              absolute
              bottom-3
              left-3
              right-3
              z-20
              flex
              items-center
              justify-between
              text-[10px]
              text-white/60
            "
          >
            <div className="flex items-center gap-1">
              <Star
                size={12}
                className="fill-yellow-400 text-yellow-400"
              />
              <span>4.9</span>
            </div>

            <div className="flex items-center gap-1">
              <Download size={12} />
              <span>Downloads</span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-[3] p-4">
          <Link
            href={`/models/${product.slug}`}
            className="
              line-clamp-1
              text-sm
              font-bold
              text-white
              transition-colors
              hover:text-teal-300
            "
          >
            {product.title}
          </Link>

          <div className="mt-1 text-xs text-white/35">
            by {product.author}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Star
                size={13}
                className="fill-yellow-400 text-yellow-400"
              />
              <span>4.9</span>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}