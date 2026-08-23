"use client";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [tab, setTab] = useState<"products" | "homepage">("products");

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    setAuthenticated(data.authenticated);
    if (data.authenticated) loadProducts();
  }

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadProducts();
    } else {
      setLoginError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setProducts([]);
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, String(val));
    });
    if (imageFile) formData.append("image", imageFile);
    if (modelFile) formData.append("modelFile", modelFile);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(`"${data.product.title}" uploaded successfully!`);
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
      loadProducts();
    } else {
      setError(data.error || "Upload failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProducts();
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
              <h1 className="text-xl font-bold text-white">Admin Login</h1>
              <p className="text-sm text-white/50">Upload and manage products</p>
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
            <p className="mb-4 text-sm text-red-400">{loginError}</p>
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
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-white/50">Upload 3D model files for users to browse</p>
        </div>
        <button onClick={handleLogout} className="btn-glass text-sm">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === "products" ? "bg-brand text-white" : "glass text-white/60 hover:text-white"
          }`}
        >
          <Package className="h-4 w-4" />
          Products
        </button>
        <button
          onClick={() => setTab("homepage")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === "homepage" ? "bg-brand text-white" : "glass text-white/60 hover:text-white"
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
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="glass-input"
            required
          />

          <textarea
            placeholder="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="glass-input min-h-[100px] resize-none"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="glass-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="glass-input"
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="glass-input"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price ($)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                  className="rounded"
                />
                Free
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.isPremium}
                  onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                  className="rounded"
                />
                Premium
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm text-white/60">Product Image *</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                required
              /><label className="block">
  <span className="mb-1 block text-sm text-white/60">
    3D Model File
  </span>

  <span className="mb-1 block text-xs text-white/60">
    (.fbx, .obj, .stl, .blend, .zip, .glb, .gltf, .jcd)
  </span>
 </label>           
              <input
                type="file"
               accept=".fbx,.obj,.stl,.blend,.zip,.glb,.gltf,.jcd"
                onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                required
              />
            </label>
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

          <button type="submit" disabled={loading} className="btn-brand w-full">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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

          <div className="space-y-3 max-h-[700px] overflow-y-auto hide-scrollbar">
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
                    <h3 className="truncate font-semibold text-white">{product.title}</h3>
                    <p className="text-xs text-white/40">
                      {product.category} · {product.isFree ? "Free" : `$${product.price}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="shrink-0 rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
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
