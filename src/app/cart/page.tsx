"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="glass-card max-w-md p-10 text-center">
          <h1 className="text-2xl font-bold text-white">
            Your cart is empty
          </h1>

          <p className="mt-2 text-white/50">
            Add a model before checking out.
          </p>

          <Link
            href="/models"
            className="btn-brand mt-6 inline-flex"
          >
            Browse Models
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-4 py-10 lg:px-8">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold text-white">
        Checkout
      </h1>

      <p className="mt-2 text-white/50">
        Complete your demo order
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Customer Details */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white">
            Customer Details
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-white/60">
                Address
              </label>

              <input
                type="text"
                placeholder="Your address"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                City
              </label>
<Link href="/checkout" className="btn-brand mt-6 flex w-full justify-center">
  Proceed to Checkout
</Link>
                placeholder="City"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Postal Code
              </label>

              <input
                type="text"
                placeholder="Postal code"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-brand/20 bg-brand/5 p-4">
            <p className="text-sm text-white/60">
              This is a demo checkout. No real payment will be charged.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card h-fit p-6">
          <h2 className="text-xl font-semibold text-white">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-white/40">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-brand">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex justify-between text-white/60">
              <span>Items</span>
              <span>{count}</span>
            </div>

            <div className="mt-3 flex justify-between text-xl font-bold text-white">
              <span>Total</span>

              <span className="text-brand">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-brand mt-6 flex w-full items-center justify-center gap-2"
            onClick={() => {
              alert("Order placed successfully! This is a demo checkout.");
            }}
          >
            <CheckCircle className="h-5 w-5" />
            Place Demo Order
          </button>

          <p className="mt-3 text-center text-xs text-white/30">
            Demo only — payment integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
