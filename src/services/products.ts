import type { Product } from "../types/products";

const API_URL = import.meta.env.VITE_API_URL;

// Formato exato que a API devolve (reflete a tabela do banco)
type ApiProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  image: string;
  warranty: string;
  stock: number;
  specInterface: string;
  specPower: string;
  specSpeed: string;
  specType: string;
};

// Converte o formato da API no formato que o front já usa
function toProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    sku: p.sku,
    name: p.name,
    description: p.description,
    price: p.priceCents / 100,
    category: p.category,
    image: p.image,
    warranty: p.warranty,
    specs: {
      interface: p.specInterface,
      power: p.specPower,
      speed: p.specSpeed,
      type: p.specType,
    },
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error(`Erro ${res.status} ao carregar produtos`);
  const data: ApiProduct[] = await res.json();
  return data.map(toProduct);
}