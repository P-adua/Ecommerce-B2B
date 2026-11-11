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
* **Recomendação Inteligente de Frete**: Análise automática de c# B2B Enterprise E-Commerce Platform

Front-end de um e-commerce **B2B** de equipamentos de TI, com regras de preço de atacado, comparador técnico, pedido rápido por SKU e geração de cotação em PDF.

O catálogo de produtos é carregado de uma API própria: [Ecommerce-B2B-API](https://github.com/P-adua/Ecommerce-B2B-API) (Node + Express + Prisma + SQL Server).

## Stack

- React + TypeScript, com Vite
- Tailwind CSS (tema escuro e tema claro)
- TanStack React Query (dados vindos da API: cache, carregamento e erro)
- Zustand (estado da interface: carrinho, tema, comparador, sessão)
- jsPDF / html2canvas (cotação em PDF)

## Funcionalidades

- **Catálogo** vindo da API, com busca por texto e filtro por categoria
- **Preço de atacado:** desconto progressivo por volume no carrinho (5+ = 5%, 10+ = 10%, 20+ = 15%)
- **Frete:** recomendação de modal logístico e desconto escalonado por quantidade de SKUs
- **Pedido rápido:** adiciona vários itens ao carrinho por código SKU, manualmente ou colando uma lista
- **Comparador técnico** de produtos lado a lado
- **Cotação em PDF**, histórico de pedidos com "comprar novamente" e perfil da empresa

## Como executar

1. Suba a API seguindo o README do [Ecommerce-B2B-API](https://github.com/P-adua/Ecommerce-B2B-API).
2. Clone este repositório e instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo de variáveis de ambiente:
   ```bash
   copy .env.example .env
   ```
   (no Linux/Mac: `cp .env.example .env`). O padrão aponta para `http://localhost:3333`.
4. Inicie o front:
   ```bash
   npm run dev
   ```
   O endereço aparece no terminal.

## Decisões técnicas

- **React Query para dados do servidor, Zustand para estado da interface.** Os dois resolvem problemas diferentes: o primeiro cuida de cache, carregamento e erro de dados que vêm da API, o segundo guarda o que só existe no navegador.
- **Camada de serviço com mapper:** a API devolve o produto no formato do banco (preço em centavos, specs em campos separados) e o `services/products.ts` converte para o formato que os componentes usam. Se a API mudar, só esse arquivo muda.
- **Erros tratados na área do catálogo:** se a API cair, header, carrinho e modais continuam funcionando.

## Roadmap

- [ ] Login real com JWT (simulado])
- [ ] Pedidos salvos no banco
- [ ] Regras de desconto e frete calculadas no servidor
- [ ] Testes automatizados
- [ ] Deploy (front e API)argo e categorias para sugerir o modal logístico ideal (*Truck/Rodoviário*, *Plane/Aéreo*, *Ship/Marítimo* ou *Standard*).
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