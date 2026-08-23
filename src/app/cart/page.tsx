"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, total, count, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-md p-10 text-center"
        >
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
          <p className="mt-2 text-white/50">Browse models and add items to your cart.</p>
          <Link href="/models" className="btn-brand mt-6 inline-flex">
            Browse Models
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-4 py-10 lg:px-8">
      <Link
        href="/models"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue shopping
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="mt-1 text-white/50">{count} item{count !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300">
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex gap-4 p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/models/${item.product.slug}`}
                  className="font-semibold text-white hover:text-brand"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-white/40">{item.product.category}</p>
                <p className="mt-1 font-bold text-brand">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 rounded-lg border border-white/10">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 text-white/60 hover:text-white"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1.5 text-white/60 hover:text-white"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card h-fit p-6">
          <h2 className="text-lg font-semibold text-white">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal ({count} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-brand">${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn-brand mt-6 w-full">Proceed to Checkout</button>
          <p className="mt-3 text-center text-xs text-white/30">
            Demo checkout — payment integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
