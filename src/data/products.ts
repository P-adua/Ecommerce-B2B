import type { Product } from '../types/products';

export const products: Product[] = [
  {
    id: '1',
    name: 'Switch Gerenciável 24 Portas Gigabit PoE+',
    price: 1450.00,
    category: 'Redes',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80',
    description: 'Switch corporativo de alta performance para infraestrutura de rede avançada.',
    minimumOrder: 1
  },
  {
    id: '2',
    name: 'Bobina de Cabo UTP Cat6 Caixa 305m',
    price: 780.50,
    category: 'Cabeamento',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80',
    description: 'Cabo de rede 100% cobre homologado para instalações estruturadas.',
    minimumOrder: 2
  },
  {
    id: '3',
    name: 'Kit Leitor de Código de Barras Laser + Base',
    price: 320.00,
    category: 'Automação',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80',
    description: 'Leitor ergonômico ideal para frentes de caixa e controle de estoque logístico.',
    minimumOrder: 1
  },
  {
    id: '4',
    name: 'Nobreak Interativo 1500VA Senoidal',
    price: 1890.00,
    category: 'Energia',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
    description: 'Proteção avançada contra quedas de energia para servidores e equipamentos críticos.',
    minimumOrder: 1
  },
  {
    id: '5',
    name: 'Access Point Wi-Fi 6 Corporativo de Longo Alcance',
    price: 950.00,
    category: 'Redes',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    description: 'Alta densidade de conexões simultâneas para escritórios e galpões.',
    minimumOrder: 1
  },
  {
    id: '6',
    name: 'Câmera de Segurança IP Bullet Infravermelho 4K',
    price: 640.00,
    category: 'Segurança',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=500&q=80',
    description: 'Monitoramento externo em alta definição com visão noturna avançada.',
    minimumOrder: 2
  },
  {
    id: '7',
    name: 'Servidor Torre Xeon E-2334 16GB RAM 2TB HDD',
    price: 7490.00,
    category: 'Hardware',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=500&q=80',
    description: 'Potência e estabilidade para rodar sistemas ERP, banco de dados e arquivos locais.',
    minimumOrder: 1
  },
  {
    id: '8',
    name: 'Impressora Térmica de Etiquetas de Alta Vazão',
    price: 1250.00,
    category: 'Automação',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80',
    description: 'Ideal para expedição, centros de distribuição e rotulagem de produtos em larga escala.',
    minimumOrder: 1
  }
];