import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/utils";
import { featuredProducts } from "@/lib/data";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

type CatalogItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  price: number;
  isFree: boolean;
  isPremium: boolean;
  tags: string[];
};

function fallbackCatalog(): CatalogItem[] {
  return featuredProducts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: `${p.title} for ${p.category.toLowerCase()} workflows.`,
    category: p.category,
    author: p.author,
    price: p.price,
    isFree: Boolean(p.isFree),
    isPremium: Boolean(p.isPremium),
    tags: p.tags,
  }));
}

async function getCatalog(): Promise<CatalogItem[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    return products.map((p) => {
      const serialized = serializeProduct(p);
      return {
        id: serialized.id,
        title: serialized.title,
        slug: serialized.slug,
        description: serialized.description,
        category: serialized.category,
        author: serialized.author,
        price: serialized.price,
        isFree: serialized.isFree,
        isPremium: serialized.isPremium,
        tags: serialized.tags,
      };
    });
  } catch (error) {
    console.warn("AI catalog fallback:", error);
    return fallbackCatalog();
  }
}

function lexicalRecommendations(input: string, catalog: CatalogItem[]) {
  const words = input.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return catalog
    .map((item) => {
      const haystack = [item.title, item.description, item.category, item.author, ...item.tags]
        .join(" ")
        .toLowerCase();
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);
}

async function callOpenAI(message: string, catalog: CatalogItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const catalogText = JSON.stringify(catalog);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        {
          role: "system",
          content:
            "You are OceanTrade AI, an assistant for a 3D model marketplace. Use only the supplied catalog when recommending products. Return concise helpful answers. If the user asks for models, choose up to 6 catalog ids and provide a natural-language reply. Output valid JSON only with keys: reply (string), productIds (array of strings), searchQuery (string).",
        },
        {
          role: "user",
          content: `User request: ${message}\n\nCatalog: ${catalogText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "oceantrade_ai_result",
          strict: true,
          schema: {
            type: "object",
            properties: {
              reply: { type: "string" },
              productIds: { type: "array", items: { type: "string" } },
              searchQuery: { type: "string" },
            },
            required: ["reply", "productIds", "searchQuery"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    console.error("OpenAI AI route error:", await response.text());
    return null;
  }

  const data = await response.json();
  const text = data.output_text;
  if (!text) return null;
  return JSON.parse(text) as { reply: string; productIds: string[]; searchQuery: string };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = String(body.message || "").trim();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const catalog = await getCatalog();
    const ai = await callOpenAI(message, catalog);
    const lexical = lexicalRecommendations(message, catalog);

    const result = ai || {
      reply:
        lexical.length > 0
          ? "I found a few models that look relevant. Add an OpenAI API key to enable deeper natural-language recommendations."
          : "I could not find a close match in the current catalog.",
      productIds: lexical.map((p) => p.id),
      searchQuery: message,
    };

    const selected = result.productIds
      .map((id) => catalog.find((p) => p.id === id))
      .filter(Boolean) as CatalogItem[];
    const recommendations = (selected.length ? selected : lexical).slice(0, 6);

    return NextResponse.json({
      reply: result.reply,
      searchQuery: result.searchQuery || message,
      recommendations,
      aiEnabled: Boolean(process.env.OPENAI_API_KEY),
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return NextResponse.json({ error: "AI assistant is temporarily unavailable" }, { status: 500 });
  }
}
