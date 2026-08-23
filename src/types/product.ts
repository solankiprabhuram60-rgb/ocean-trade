export interface ProductDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  author: string;
  imageUrl: string;
  fileUrl: string;
  fileName: string;
  tags: string[];
  isFree: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: ProductDTO[];
  count: number;
  query?: string;
}
