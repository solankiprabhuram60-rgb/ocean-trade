export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  author: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  tags: string[];
  isPremium?: boolean;
  isFree?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
  type: "model" | "print";
}

export const trendingTags = [
  { label: "Coral reef", href: "/models?q=coral+reef" },
  { label: "Submarine", href: "/models?q=submarine" },
  { label: "Whale shark", href: "/models?q=whale+shark" },
  { label: "Underwater city", href: "/models?q=underwater+city" },
  { label: "Pirate ship", href: "/models?q=pirate+ship" },
];

export const quickTags = [
  { label: "Newest", href: "/models?sort=newest" },
  { label: "Top Selling", href: "/models?sort=top-selling" },
  { label: "Trending", href: "/models?sort=trending" },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Exterior",
    slug: "exterior",
    count: 243000,
    image: "/marketplace/architecture.svg",
  },
  {
    id: "2",
    name: "Interior",
    slug: "interior",
    count: 677000,
    image: "/marketplace/interior.svg",
  },
  {
    id: "3",
    name: "Architectural",
    slug: "architectural",
    count: 371000,
    image: "/marketplace/architecture.svg",
  },
  {
    id: "4",
    name: "Character",
    slug: "character",
    count: 327000,
    image: "/marketplace/character.svg",
  },
  {
    id: "5",
    name: "Car",
    slug: "car",
    count: 151000,
    image: "/marketplace/vehicle.svg",
  },
  {
    id: "6",
    name: "Furniture",
    slug: "furniture",
    count: 541000,
    image: "/marketplace/furniture.svg",
  },
  {
    id: "7",
    name: "Military",
    slug: "military",
    count: 167000,
    image: "/marketplace/nature.svg",
  },
  {
    id: "8",
    name: "Animal",
    slug: "animal",
    count: 222000,
    image: "/marketplace/nature.svg",
  },
  {
    id: "9",
    name: "Plant",
    slug: "plant",
    count: 205000,
    image: "/marketplace/nature.svg",
  },
  {
    id: "10",
    name: "Food",
    slug: "food",
    count: 566000,
    image: "/marketplace/printing.svg",
  },
];

export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${Math.round(count / 1000)}K`;
  return count.toString();
}

export const featuredProducts: Product[] = [
  {
    id: "1",
    title: "Deep Sea Explorer Submarine",
    slug: "deep-sea-explorer-submarine",
    price: 49.99,
    author: "AquaDesigns",
    rating: 4.9,
    reviews: 234,
    image: "/marketplace/submarine.svg",
    category: "Vehicle",
    tags: ["submarine", "underwater", "sci-fi"],
    isPremium: true,
  },
  {
    id: "2",
    title: "Coral Reef Environment Pack",
    slug: "coral-reef-environment-pack",
    price: 79.99,
    originalPrice: 99.99,
    author: "OceanStudio",
    rating: 4.8,
    reviews: 189,
    image: "/marketplace/submarine.svg",
    category: "Exterior",
    tags: ["environment", "nature", "underwater"],
    isPremium: true,
  },
  {
    id: "3",
    title: "Mermaid Character Rigged",
    slug: "mermaid-character-rigged",
    price: 34.99,
    author: "WaveArt",
    rating: 4.7,
    reviews: 156,
    image: "/marketplace/mermaid.svg",
    category: "Character",
    tags: ["character", "rigged", "fantasy"],
  },
  {
    id: "4",
    title: "Luxury Yacht Interior",
    slug: "luxury-yacht-interior",
    price: 59.99,
    author: "NavArch",
    rating: 4.9,
    reviews: 98,
    image: "/marketplace/yacht.svg",
    category: "Interior",
    tags: ["interior", "yacht", "luxury"],
    isPremium: true,
  },
  {
    id: "5",
    title: "Whale Shark Low Poly",
    slug: "whale-shark-low-poly",
    price: 0,
    author: "FreeModels",
    rating: 4.5,
    reviews: 412,
    image: "/marketplace/submarine.svg",
    category: "Animal",
    tags: ["animal", "low-poly", "game-ready"],
    isFree: true,
  },
  {
    id: "6",
    title: "Pirate Ship Complete",
    slug: "pirate-ship-complete",
    price: 89.99,
    author: "SeaLegends",
    rating: 4.8,
    reviews: 267,
    image: "/marketplace/submarine.svg",
    category: "Vehicle",
    tags: ["ship", "pirate", "game-ready"],
    isPremium: true,
  },
  {
    id: "7",
    title: "Underwater City Blocks",
    slug: "underwater-city-blocks",
    price: 44.99,
    author: "AquaDesigns",
    rating: 4.6,
    reviews: 143,
    image: "/marketplace/city.svg",
    category: "Architectural",
    tags: ["city", "sci-fi", "modular"],
  },
  {
    id: "8",
    title: "Ocean Floor Terrain Kit",
    slug: "ocean-floor-terrain-kit",
    price: 29.99,
    author: "TerrainPro",
    rating: 4.7,
    reviews: 201,
    image: "/marketplace/terrain.svg",
    category: "Exterior",
    tags: ["terrain", "environment", "kit"],
  },
];

export const collections: Collection[] = [
  {
    id: "1",
    title: "Rigged 3D Characters for Games",
    description:
      "A curated collection of rigged 3D character models designed for use in games. These assets support different art styles and genres, and come fully rigged so developers can skip the setup and go straight to animation.",
    image: "/marketplace/character.svg",
    productCount: 48,
    slug: "rigged-characters-games",
    type: "model",
  },
  {
    id: "2",
    title: "Animal Models for Games",
    description:
      "A curated collection of animal 3D models designed for game environments. These assets range from realistic to stylized and are suitable for populating worlds with wildlife or companions.",
    image: "/marketplace/character.svg",
    productCount: 36,
    slug: "animal-models-games",
    type: "model",
  },
  {
    id: "3",
    title: "Futuristic City Models",
    description:
      "A curated selection of futuristic city 3D models suitable for games, simulations, and cinematic environments. These assets focus on scale and cohesive sci-fi design.",
    image: "/marketplace/city.svg",
    productCount: 24,
    slug: "futuristic-city-models",
    type: "model",
  },
  {
    id: "4",
    title: "RC & Model Car Parts",
    description:
      "3D printable RC and model car parts — wheels, body shells, chassis components, and custom upgrades.",
    image: "/marketplace/vehicle.svg",
    productCount: 52,
    slug: "printable-car-parts",
    type: "print",
  },
  {
    id: "5",
    title: "Tabletop RPG Miniatures",
    description:
      "3D printable tabletop RPG miniatures — heroes, monsters, and terrain for D&D, Pathfinder, and more.",
    image: "/marketplace/character.svg",
    productCount: 64,
    slug: "tabletop-rpg-miniatures",
    type: "print",
  },
  {
    id: "6",
    title: "Minimalist Jewelry",
    description:
      "3D printable minimalist jewelry — rings, earrings, pendants, and bracelets with clean, modern designs.",
    image: "/marketplace/jewelry.svg",
    productCount: 28,
    slug: "minimalist-jewelry",
    type: "print",
  },
];

export const heroImage =
  "/marketplace/scifi.svg";
