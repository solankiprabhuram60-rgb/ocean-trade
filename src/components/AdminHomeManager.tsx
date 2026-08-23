"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Tag, Layout } from "lucide-react";

interface HomeTag {
  id: string;
  label: string;
  query: string;
  type: "trending" | "quick";
  sortOrder: number;
  enabled: boolean;
}

interface HomeSection {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  limit: number;
  sortBy: string;
  enabled: boolean;
}

export default function AdminHomeManager() {
  const [tags, setTags] = useState<HomeTag[]>([]);
  const [section, setSection] = useState<HomeSection | null>(null);
  const [message, setMessage] = useState("");
  const [newTag, setNewTag] = useState<{ label: string; query: string; type: "trending" | "quick" }>({
    label: "",
    query: "",
    type: "trending",
  });

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    const res = await fetch("/api/admin/home");
    if (res.ok) {
      const data = await res.json();
      setTags(data.tags);
      setSection(data.section);
    }
  }

  async function postHome(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage("Saved!");
      loadHome();
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function saveSection() {
    if (!section) return;
    await postHome({
      action: "updateSection",
      title: section.title,
      subtitle: section.subtitle,
      limit: section.limit,
      sortBy: section.sortBy,
      enabled: section.enabled,
    });
  }

  async function addTag() {
    if (!newTag.label.trim()) return;
    await postHome({
      action: "createTag",
      label: newTag.label,
      query: newTag.query || newTag.label.toLowerCase(),
      type: newTag.type,
    });
    setNewTag({ label: "", query: "", type: "trending" });
  }

  async function updateTag(tag: HomeTag) {
    await postHome({ action: "updateTag", ...tag });
  }

  async function deleteTag(id: string) {
    if (!confirm("Delete this tag?")) return;
    await postHome({ action: "deleteTag", id });
  }

  const trending = tags.filter((t) => t.type === "trending");
  const quick = tags.filter((t) => t.type === "quick");

  return (
    <div className="space-y-8">
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-400"
        >
          {message}
        </motion.p>
      )}

      {/* Latest Uploads Section */}
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Layout className="h-5 w-5 text-brand" />
          Latest Uploads Section
        </div>
        {section && (
          <div className="space-y-4">
            <input
              className="glass-input"
              value={section.title}
              onChange={(e) => setSection({ ...section, title: e.target.value })}
              placeholder="Section title"
            />
            <textarea
              className="glass-input min-h-[80px]"
              value={section.subtitle}
              onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
              placeholder="Section subtitle"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-white/50">Products to show</label>
                <input
                  type="number"
                  className="glass-input"
                  min={1}
                  max={24}
                  value={section.limit}
                  onChange={(e) =>
                    setSection({ ...section, limit: parseInt(e.target.value, 10) || 8 })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Sort by</label>
                <select
                  className="glass-input"
                  value={section.sortBy}
                  onChange={(e) => setSection({ ...section, sortBy: e.target.value })}
                >
                  <option value="newest" className="bg-gray-900">Newest</option>
                  <option value="top-selling" className="bg-gray-900">Top Selling</option>
                  <option value="trending" className="bg-gray-900">Trending</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={section.enabled}
                onChange={(e) => setSection({ ...section, enabled: e.target.checked })}
              />
              Show section on homepage
            </label>
            <button onClick={saveSection} className="btn-brand">
              <Save className="h-4 w-4" />
              Save Section
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Tag className="h-5 w-5 text-brand" />
          Homepage Tags
        </div>
        <p className="mb-4 text-sm text-white/40">
          Trending tags use search query. Quick tags use{" "}
          <code className="text-brand">__sort:newest</code>,{" "}
          <code className="text-brand">__sort:top-selling</code>, or{" "}
          <code className="text-brand">__sort:trending</code> as query.
        </p>

        {[trending, quick].map((group, gi) => (
          <div key={gi} className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase text-white/50">
              {gi === 0 ? "Trending Tags" : "Quick Tags"}
            </h3>
            <div className="space-y-2">
              {group.map((tag) => (
                <div key={tag.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-white/5 p-3">
                  <input
                    className="glass-input flex-1 min-w-[120px] py-2 text-sm"
                    value={tag.label}
                    onChange={(e) =>
                      setTags((prev) =>
                        prev.map((t) => (t.id === tag.id ? { ...t, label: e.target.value } : t))
                      )
                    }
                  />
                  <input
                    className="glass-input flex-1 min-w-[120px] py-2 text-sm"
                    value={tag.query}
                    placeholder="Search query or __sort:..."
                    onChange={(e) =>
                      setTags((prev) =>
                        prev.map((t) => (t.id === tag.id ? { ...t, query: e.target.value } : t))
                      )
                    }
                  />
                  <label className="flex items-center gap-1 text-xs text-white/50">
                    <input
                      type="checkbox"
                      checked={tag.enabled}
                      onChange={(e) =>
                        setTags((prev) =>
                          prev.map((t) =>
                            t.id === tag.id ? { ...t, enabled: e.target.checked } : t
                          )
                        )
                      }
                    />
                    On
                  </label>
                  <button
                    onClick={() => updateTag(tags.find((t) => t.id === tag.id)!)}
                    className="rounded-lg bg-brand/20 px-3 py-1.5 text-xs text-brand hover:bg-brand/30"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <input
            className="glass-input flex-1 min-w-[140px] py-2 text-sm"
            placeholder="New tag label"
            value={newTag.label}
            onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
          />
          <input
            className="glass-input flex-1 min-w-[140px] py-2 text-sm"
            placeholder="Query (optional)"
            value={newTag.query}
            onChange={(e) => setNewTag({ ...newTag, query: e.target.value })}
          />
          <select
            className="glass-input py-2 text-sm"
            value={newTag.type}
            onChange={(e) =>
              setNewTag({ ...newTag, type: e.target.value as "trending" | "quick" })
            }
          >
            <option value="trending" className="bg-gray-900">Trending</option>
            <option value="quick" className="bg-gray-900">Quick</option>
          </select>
          <button onClick={addTag} className="btn-brand py-2 text-sm">
            <Plus className="h-4 w-4" />
            Add Tag
          </button>
        </div>
      </div>
    </div>
  );
}
