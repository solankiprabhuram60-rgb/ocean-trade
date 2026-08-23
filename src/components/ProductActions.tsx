"use client";

import type { ProductDTO } from "@/types/product";
import AddToCartButton from "./AddToCartButton";
import { Download } from "lucide-react";

interface ProductActionsProps {
  product: ProductDTO;
}

export default function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {product.isFree ? (
        <a href={product.fileUrl} download={product.fileName} className="btn-brand">
          <Download className="h-4 w-4" />
          Download Free
        </a>
      ) : (
        <AddToCartButton product={product} />
      )}
      {!product.isFree && (
        <a href={product.fileUrl} download={product.fileName} className="btn-glass">
          <Download className="h-4 w-4" />
          Download Preview
        </a>
      )}
    </div>
  );
}
