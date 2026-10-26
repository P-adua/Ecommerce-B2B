# 📦 B2B Enterprise E-Commerce Platform

Plataforma de comércio eletrônico B2B de alta performance desenvolvida com tecnologias modernas, focada em automação de compras corporativas, regras de negócio complexas de atacado e ferramentas profissionais de gestão logística.

---

## 🚀 Tecnologias Utilizadas

* **React 18+** / **TypeScript**
* **Vite** (com Oxc / SWC)
* **Tailwind CSS** (com suporte dinâmico a *Dark Mode* e *Fashion Light Mode*)
* **Zustand** (Gerenciamento de estado global modular e persistente)
* **jspdf** / **html2canvas** (Geração de cotações corporativas oficiais em PDF)

---

## 🛠️ Principais Recursos e Módulos Implementados

### 1. 📈 Regras de Preços & Descontos por Atacado (Wholesale Pricing)
* Descontos progressivos por volume aplicados automaticamente ao carrinho:
  * 5+ unidades = **5% de desconto**
  * 10+ unidades = **10% de desconto**
  * 20+ unidades = **15% de desconto**

### 2. 🚚 Inteligência Logística & Split Shipping
* **Recomendação Inteligente de Frete**: Análise automática de cargo e categorias para sugerir o modal logístico ideal (*Truck/Rodoviário*, *Plane/Aéreo*, *Ship/Marítimo* ou *Standard*).
* **Desconto Escalonado de Frete por SKU**: Reduções de custo logístico com base no mix de SKUs elegíveis no pedido (1 SKU = 15%, 2 SKUs = 30%, 3+ SKUs = 50% de desconto no frete).
* **Split Shipping**: Capacidade de divisão e gestão de remessas e entregas parciais por item/lote.

### 3. ⚡ Compra Rápida por SKU (Bulk & Quick Order)
* Modal dedicado para inserção em lote via códigos SKU (ex: `SKU-RED-001`, `SKU-CAB-002`) com verificação instantânea de estoque e adição em massa ao carrinho.

### 4. ⚖️ Comparador Técnico Lado a Lado (Product Comparator)
* Comparativo detalhado de até 3 produtos simultâneos.
* Tabela unificada confrontando preços, categorias, portas/interfaces, velocidades, alimentação/potência e garantias corporativas.
* Botão flutuador dinâmico no cabeçalho com indicador de itens selecionados.

### 5. 📄 Ferramentas Corporativas & Cotação Oficial
* **Geração de Cotação em PDF**: Emissão instantânea do documento oficial da cotação B2B com dados da empresa, carimbo de validade e detalhamento de impostos/descontos.
* **Histórico de Pedidos com Reorder**: Acompanhamento de status de faturamento e funcionalidade de "Comprar Novamente" com um único clique.
* **Gestão de Perfil Corporativo**: Edição de dados da empresa cliente (CNPJ, Razão Social, Alçada de Compras).

---

## 🎨 Temas & Experiência Visual
* **Dark Mode Minimalista**: Foco em ambientes de TI e alta sofisticação (`#121214` com acentos em Emerald e Amber).
* **Fashion Light Mode**: Layout limpo, contrastado e corporativo para mesas de compras tradicionais.

---

## ⚙️ Como Executar o Projeto

1. Clone o repositório e instale as dependências:
   ```bash
   npm install