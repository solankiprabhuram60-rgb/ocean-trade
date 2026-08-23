"use client";

import { useCart } from "@/context/CartContext";
import type { ProductDTO } from "@/types/product";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";

interface AddToCartButtonProps {
  product: ProductDTO;
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  if (product.isFree) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => addItem(product)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 ${className}`}
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4 text-brand" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </>
      )}
    </motion.button>
  );
}
