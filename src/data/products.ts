import type { Product } from '../types/products';

export const products: Product[] = [
  {
    id: '1',
    sku: 'SKU-RED-001',
    name: 'Switch Gerenciável 24 Portas Gigabit L2+',
    description: 'Switch corporativo de alta performance para infraestrutura de rede avançada.',
    price: 1450.00,
    category: 'Redes',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    warranty: '3 Anos On-site',
    specs: { interface: '24x Portas RJ45 GbE + 4x SFP+', power: 'Bivolt Automático', speed: '104 Gbps', type: 'Gerenciável L2+' }
  },
  {
    id: '2',
    sku: 'SKU-CAB-002',
    name: 'Bobina de Cabo UTP Cat6 Caixa 305m',
    description: 'Cabo de rede 100% cobre homologado para instalações estruturadas.',
    price: 780.50,
    category: 'Cabeamento',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    warranty: '1 Ano Fabricante',
    specs: { interface: '100% Cobre Nu', power: 'N/A', speed: 'Até 1 Gbps / 250MHz', type: 'UTP Caixa 305m' }
  },
  {
    id: '3',
    sku: 'SKU-AUT-003',
    name: 'Kit Leitor de Código de Barras Laser 2D USB',
    description: 'Leitor ergonômico ideal para frentes de caixa e controle de estoque logístico.',
    price: 320.00,
    category: 'Automação',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    warranty: '2 Anos',
    specs: { interface: 'USB / Bluetooth', power: 'Alimentado por Porta', speed: '300 leituras/seg', type: 'Laser 2D Imager' }
  },
  {
    id: '4',
    sku: 'SKU-ENE-004',
    name: 'Nobreak Interativo 1500VA Senoidal',
    description: 'Proteção avançada contra quedas de energia para servidores e equipamentos críticos.',
    price: 1890.00,
    category: 'Energia',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600',
    warranty: '2 Anos Balcão',
    specs: { interface: '6 Tomadas NBR 14136', power: '1500VA / 1050W', speed: 'Senoidal Pura', type: 'Interativo' }
  },
  {
    id: '5',
    sku: 'SKU-RED-005',
    name: 'Access Point Wi-Fi 6 Corporativo Dual-Band',
    description: 'Cobertura de alta densidade para escritórios e galpões industriais.',
    price: 920.00,
    category: 'Redes',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    warranty: '3 Anos',
    specs: { interface: 'Porta PoE+ 2.5GbE', power: 'PoE+ 802.3at', speed: 'Até 3000 Mbps', type: 'Wi-Fi 6 (802.11ax)' }
  },
  {
    id: '7',
    sku: 'SKU-HW-007',
    name: 'Servidor Torre Xeon E-2334 16GB RAM 2TB',
    description: 'Servidor corporativo para banco de dados e virtualização empresarial.',
    price: 8900.00,
    category: 'Hardware',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    warranty: '3 Anos On-site ProSupport',
    specs: { interface: 'Quad-Core Xeon / 16GB', power: 'Fonte Redundante 450W', speed: 'PCIe 4.0', type: 'Servidor Torre' }
  }
];