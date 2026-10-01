"use client";

import { upload } from "@vercel/blob/client";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  LogOut,
  Trash2,
  Loader2,
  CheckCircle,
  Lock,
  Package,
  Home,
} from "lucide-react";
import type { ProductDTO } from "@/types/product";
import AdminHomeManager from "@/components/AdminHomeManager";

const CATEGORIES = [
  "Exterior",
  "Interior",
  "Architectural",
  "Character",
  "Jewelry",
  "Car",
  "Furniture",
  "Military",
  "Animal",
  "Plant",
  "Food",
  "Vehicle",
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [tab, setTab] = useState<"products" | "homepage">("products");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Character",
    author: "Ocean Trade",
    tags: "",
    price: "0",
    isFree: false,
    isPremium: false,
  });

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setAuthenticated(data.authenticated);

      if (data.authenticated) {
        loadProducts();
      }
    } catch {
      setAuthenticated(false);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");

      if (!res.ok) return;

      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setLoginError("Invalid password");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      loadProducts();
    } catch {
      setLoginError("Login failed. Please try again.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
      });
    } finally {
      setAuthenticated(false);
      setProducts([]);
    }
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();

    if (!imageFile || !modelFile) {
      setError("Please select both product image and 3D model.");
      return;
    }

    // Keep the browser-side checks consistent with the Blob route.
    const maxImageSize = 10 * 1024 * 1024;
    const maxModelSize = 100 * 1024 * 1024;

    if (imageFile.size === 0 || modelFile.size === 0) {
      setError("Selected file is empty. Please choose another file.");
      return;
    }

    if (imageFile.size > maxImageSize) {
      setError("Product image must be 10 MB or smaller.");
      return;
    }

    if (modelFile.size > maxModelSize) {
      setError("3D model must be 100 MB or smaller.");
      return;
    }

    const allowedModelExtensions = [
      ".fbx",
      ".obj",
      ".stl",
      ".blend",
      ".zip",
      ".glb",
      ".gltf",
      ".jcd",
    ];

    const modelName = modelFile.name.toLowerCase();
    const modelExtension = allowedModelExtensions.find((ext) =>
      modelName.endsWith(ext)
    );

    if (!modelExtension) {
      setError(
        "Unsupported 3D model format. Use .fbx, .obj, .stl, .blend, .zip, .glb, .gltf, or .jcd."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const safeImageName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const safeModelName = modelFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setSuccess("Uploading product image...");

      const imageBlob = await upload(
        `img/${uploadId}-${safeImageName}`,
        imageFile,
        {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
        }
      );

      setSuccess("Product image uploaded. Uploading 3D model...");

      const modelBlob = await upload(
        `model/${uploadId}-${safeModelName}`,
        modelFile,
        {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
        }
      );

      setSuccess("Files uploaded. Saving product...");

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          imageUrl: imageBlob.url,
          fileUrl: modelBlob.url,
          fileName: modelFile.name,
        }),
      });

      const text = await res.text();

      let data: {
        error?: string;
        product?: ProductDTO;
      };

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          error: text || "Failed to save product",
        };
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to create product (${res.status})`);
      }

      setSuccess(
        `"${data.product?.title || form.title}" uploaded successfully!`
      );

      setForm({
        title: "",
        description: "",
        category: "Character",
        author: "Ocean Trade",
        tags: "",
        price: "0",
        isFree: false,
        isPremium: false,
      });

      setImageFile(null);
      setModelFile(null);

      const imageInput = document.getElementById(
        "product-image"
      ) as HTMLInputElement | null;

      const modelInput = document.getElementById(
        "model-file"
      ) as HTMLInputElement | null;

      if (imageInput) imageInput.value = "";
      if (modelInput) modelInput.value = "";

      await loadProducts();
    } catch (err) {
      console.error("Admin upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please check your Vercel Blob configuration and try again."
      );
      setSuccess("");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await loadProducts();
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data?.error || "Failed to delete product");
    } catch {
      setError("Failed to delete product");
    }
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleLogin}
          className="glass-card w-full max-w-md p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20">
              <Lock className="h-6 w-6 text-brand" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Admin Login
              </h1>

              <p className="text-sm text-white/50">
                Upload and manage products
              </p>
            </div>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="glass-input mb-4"
            required
          />

          {loginError && (
            <p className="mb-4 text-sm text-red-400">
              {loginError}
            </p>
          )}

          <button type="submit" className="btn-brand w-full">
            Sign In
          </button>

          <p className="mt-4 text-center text-xs text-white/30">
            Default password: admin123
          </p>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-4 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-white/50">
            Upload 3D model files for users to browse
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn-glass text-sm"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "products"
              ? "bg-brand text-white"
              : "glass text-white/60"
          }`}
        >
          <Package className="h-4 w-4" />
          Products
        </button>

        <button
          onClick={() => setTab("homepage")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "homepage"
              ? "bg-brand text-white"
              : "glass text-white/60"
          }`}
        >
          <Home className="h-4 w-4" />
          Homepage
        </button>
      </div>

      {tab === "homepage" ? (
        <AdminHomeManager />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleUpload}
            className="glass-card space-y-4 p-6"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <Upload className="h-5 w-5 text-brand" />
              Upload Product
            </div>

            <input
              type="text"
              placeholder="Product title *"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="glass-input"
              required
            />

            <textarea
              placeholder="Description *"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="glass-input min-h-[100px] resize-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="glass-input"
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-gray-900"
                  >
                    {category}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Author"
                value={form.author}
                onChange={(e) =>
                  setForm({
                    ...form,
                    author: e.target.value,
                  })
                }
                className="glass-input"
              />
            </div>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value,
                })
              }
              className="glass-input"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="glass-input"
                min="0"
                step="0.01"
                disabled={form.isFree}
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFree: e.target.checked,
                        price: e.target.checked
                          ? "0"
                          : form.price,
                      })
                    }
                  />
                  Free
                </label>

                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.isPremium}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isPremium: e.target.checked,
                      })
                    }
                  />
                  Premium
                </label>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="product-image"
                  className="mb-2 block text-sm text-white/60"
                >
                  Product Image *
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                  className="w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:font-semibold file:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="model-file"
                  className="mb-1 block text-sm text-white/60"
                >
                  3D Model File *
                </label>

                <p className="mb-2 text-xs text-white/40">
                  (.fbx, .obj, .stl, .blend, .zip, .glb, .gltf, .jcd)
                </p>

                <input
                  id="model-file"
                  type="file"
                  accept=".fbx,.obj,.stl,.blend,.zip,.glb,.gltf,.jcd"
                  onChange={(e) =>
                    setModelFile(e.target.files?.[0] || null)
                  }
                  className="w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:font-semibold file:text-white"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-green-400"
                >
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </motion.p>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Product
                </>
              )}
            </button>
          </motion.form>

          <div>
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Package className="h-5 w-5 text-brand" />
              Uploaded Products ({products.length})
            </div>

            <div className="hide-scrollbar max-h-[700px] space-y-3 overflow-y-auto">
              {products.length === 0 ? (
                <div className="glass-card p-8 text-center text-white/40">
                  No products uploaded yet
                </div>
              ) : (
                products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card flex items-center gap-4 p-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-white">
                        {product.title}
                      </h3>

                      <p className="text-xs text-white/40">
                        {product.category} ·{" "}
                        {product.isFree
                          ? "Free"
                          : `₹${product.price}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="shrink-0 rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                      aria-label={`Delete ${product.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}