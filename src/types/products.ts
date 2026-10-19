export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  image: string;
  description: string;
  minimumOrder?: number; // Diferencial B2B: pedido mínimo por atacado
  sku?: string; // Código de referência do produto
}