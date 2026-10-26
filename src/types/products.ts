export interface Product {
  id: string;
  sku?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock?: number;
  // Atributos técnicos para o comparador
  warranty?: string;
  specs?: {
    interface?: string;
    power?: string;
    speed?: string;
    type?: string;
  };
}