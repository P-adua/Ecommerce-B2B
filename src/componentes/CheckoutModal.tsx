import { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useThemeStore } from "../store/useThemeStore";
import { useOrderStore } from "../store/useOrderStore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

type ShippingType = "normal" | "expresso" | "transportadora" | "maritimo";

export function CheckoutModal({
  isOpen,
  onClose,
  companyName,
}: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const { theme } = useThemeStore();
  const { addOrder } = useOrderStore();

  const [isSplitShipping, setIsSplitShipping] = useState(false);
  const [unifiedShippingType, setUnifiedShippingType] =
    useState<ShippingType>("normal");
  const [itemShippingMap, setItemShippingMap] = useState<
    Record<string, ShippingType>
  >({});
  const [paymentMethod, setPaymentMethod] = useState<
    "boleto" | "pix" | "faturado"
  >("faturado");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Análise Inteligente da Carga
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const hasHeavyHardware = items.some(
    (item) =>
      item.category.toLowerCase().includes("hardware") ||
      item.category.toLowerCase().includes("energia") ||
      item.category.toLowerCase().includes("cabeamento"),
  );
  const hasCriticalTech = items.some(
    (item) =>
      item.category.toLowerCase().includes("redes") ||
      item.category.toLowerCase().includes("segurança"),
  );

  // Função para gerar e disparar a impressão em PDF da cotação
  const handlePrintQuote = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const quoteHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Orçamento B2B - Cotação Oficial</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #1e293b; }
          h1 { color: #047857; font-size: 22px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #0f172a; color: #fff; padding: 8px; text-align: left; font-size: 12px; }
          td { border-bottom: 1px solid #e2e8f0; padding: 8px; font-size: 12px; }
          .total { font-weight: bold; font-size: 16px; color: #047857; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>TechSupply B2B - Proposta Comercial / Cotação</h1>
        <p><strong>Cliente:</strong> ${companyName || "Empresa B2B"} | <strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        <table>
          <thead>
            <tr><th>Item</th><th>Qtd</th><th>Unitário</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${item.price.toFixed(2)}</td>
                <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="total">
          <p>Frete Calculado: R$ ${finalShippingCost.toFixed(2)}</p>
          <p>Total Geral: R$ ${grandTotal.toFixed(2)}</p>
        </div>
        <p style="font-size: 10px; color: #64748b; margin-top: 30px;">
          * Cotação válida por 15 dias. Pagamento via Boleto Faturado 30 dias mediante aprovação de crédito.
        </p>
      </body>
    </html>
  `;

    printWindow.document.write(quoteHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  let recommendation: {
    type: ShippingType;
    title: string;
    icon: string;
    reason: string;
  };

  if (totalQuantity >= 50) {
    recommendation = {
      type: "maritimo",
      title: "Frete Marítimo / Cabotagem (Navio)",
      icon: "🚢",
      reason:
        "Volume massivo detectado (50+ un). A modalidade marítima oferece a maior economia de frete por tonelada.",
    };
  } else if (hasHeavyHardware) {
    recommendation = {
      type: "transportadora",
      title: "Transportadora Rodoviária (Caminhão)",
      icon: "🚚",
      reason:
        "Carga pesada/voluminosa detectada. Transporte seguro em carreta/paletizado.",
    };
  } else if (hasCriticalTech) {
    recommendation = {
      type: "expresso",
      title: "Expresso Aéreo (Avião)",
      icon: "✈️",
      reason:
        "Equipamentos de redes/conectividade crítica. Recomendado para reposição rápida sem downtime.",
    };
  } else {
    recommendation = {
      type: "normal",
      title: "Frete Padrão (Rodoviário)",
      icon: "📦",
      reason: "Volume e peso padrão. Excelente custo-benefício.",
    };
  }

  // Inicializa mapa de frete dos itens e frete unificado ao abrir
  useEffect(() => {
    if (isOpen) {
      setUnifiedShippingType(recommendation.type);
      const initialMap: Record<string, ShippingType> = {};
      items.forEach((item) => {
        if (item.category.toLowerCase().includes("redes"))
          initialMap[item.id] = "expresso";
        else if (
          item.category.toLowerCase().includes("hardware") ||
          item.category.toLowerCase().includes("energia")
        )
          initialMap[item.id] = "transportadora";
        else initialMap[item.id] = "normal";
      });
      setItemShippingMap(initialMap);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = theme === "light";

  // Desconto no frete por combos de atacado (5+ unidades por SKU)
  const eligibleProductsCount = items.filter(
    (item) => item.quantity >= 5,
  ).length;
  let shippingDiscountPercent = 0;
  if (eligibleProductsCount === 1) shippingDiscountPercent = 15;
  if (eligibleProductsCount === 2) shippingDiscountPercent = 30;
  if (eligibleProductsCount >= 3) shippingDiscountPercent = 50;

  // Tabela de Custos Base de Frete B2B
  const baseShippingCosts: Record<ShippingType, number> = {
    normal: 45.0,
    expresso: 120.0,
    transportadora: 250.0,
    maritimo: 85.0,
  };

  const shippingNames: Record<ShippingType, string> = {
    normal: "📦 Padrão (5-8 dias)",
    expresso: "✈️ Avião Expresso (2-3 dias)",
    transportadora: "🚚 Caminhão / Carga Pesada (7-10 dias)",
    maritimo: "🚢 Navio / Cabotagem (12-20 dias)",
  };

  // Cálculo do Custo de Frete (Unificado vs Partilhado)
  let calculatedShippingCost = 0;

  if (isSplitShipping) {
    calculatedShippingCost = items.reduce((sum, item) => {
      const selectedType = itemShippingMap[item.id] || "normal";
      return sum + baseShippingCosts[selectedType];
    }, 0);
  } else {
    calculatedShippingCost = baseShippingCosts[unifiedShippingType];
  }

  const finalShippingCost =
    calculatedShippingCost * (1 - shippingDiscountPercent / 100);
  const grandTotal = totalPrice() + finalShippingCost;

  const handleItemShippingChange = (productId: string, type: ShippingType) => {
    setItemShippingMap((prev) => ({ ...prev, [productId]: type }));
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();

    addOrder({
      items,
      totalPrice: grandTotal,
      shippingCost: finalShippingCost,
      paymentMethod:
        paymentMethod === "faturado"
          ? "Boleto Faturado 30 dias"
          : paymentMethod === "pix"
            ? "PIX Corporativo"
            : "Boleto à Vista",
    });

    setOrderSuccess(true);
  };

  const handleCloseAll = () => {
    clearCart();
    setOrderSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
          isLight
            ? "bg-white border-zinc-200 text-zinc-900"
            : "bg-zinc-900 border-zinc-800 text-zinc-100"
        }`}
      >
        {/* Cabeçalho */}
        <div
          className={`flex items-center justify-between pb-4 border-b mb-6 ${isLight ? "border-zinc-200" : "border-zinc-800"}`}
        >
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>📋</span> Checkout & Logística B2B
            </h2>
            <p
              className={`text-xs mt-1 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
            >
              Empresa faturada:{" "}
              <span
                className={`font-semibold ${isLight ? "text-zinc-900" : "text-emerald-400"}`}
              >
                {companyName || "Cliente B2B"}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className={`text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? "text-zinc-500 hover:bg-zinc-100"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={handlePrintQuote}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          📄 Baixar Cotação em PDF
        </button>

        {orderSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🎉</div>
            <h3
              className={`text-2xl font-bold ${isLight ? "text-zinc-900" : "text-emerald-400"}`}
            >
              Pedido B2B Realizado com Sucesso!
            </h3>
            <p
              className={`text-sm max-w-md mx-auto ${isLight ? "text-zinc-600" : "text-zinc-300"}`}
            >
              O seu pedido foi encaminhado para a equipe de logística e
              faturamento corporativo.
            </p>
            <div className="pt-4">
              <button
                onClick={handleCloseAll}
                className={`font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md cursor-pointer text-sm ${
                  isLight
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                Concluir e Retornar à Loja
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinishOrder} className="space-y-6">
            {/* Recomendação de Frete */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${
                isLight
                  ? "bg-emerald-50/80 border-emerald-200 text-zinc-900"
                  : "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
              }`}
            >
              <span className="text-2xl">{recommendation.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-black px-2 py-0.5 rounded">
                    Recomendação do Sistema
                  </span>
                  <span className="text-xs font-bold">
                    {recommendation.title}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                >
                  {recommendation.reason}
                </p>
              </div>
            </div>

            {/* Alternância: Frete Único vs Frete Partilhado */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Estratégia de Logística e Envio
                </h3>

                {/* Toggle de Frete Partilhado */}
                <div className="flex items-center gap-2 bg-zinc-950/50 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsSplitShipping(false)}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      !isSplitShipping
                        ? isLight
                          ? "bg-zinc-900 text-white"
                          : "bg-emerald-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    📦 Carga Unificada
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSplitShipping(true)}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      isSplitShipping
                        ? isLight
                          ? "bg-zinc-900 text-white"
                          : "bg-emerald-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    🔀 Frete Partilhado
                  </button>
                </div>
              </div>

              {/* MODO 1: FRETE ÚNICO (TODOS EM UM SÓ) */}
              {!isSplitShipping ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(
                    [
                      "normal",
                      "expresso",
                      "transportadora",
                      "maritimo",
                    ] as ShippingType[]
                  ).map((type) => (
                    <label
                      key={type}
                      className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                        unifiedShippingType === type
                          ? isLight
                            ? "bg-zinc-100 border-zinc-900 text-zinc-900"
                            : "bg-emerald-950/30 border-emerald-500 text-white"
                          : isLight
                            ? "bg-white border-zinc-200 text-zinc-600"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">
                          {shippingNames[type].split(" ")[0]}{" "}
                          {type.toUpperCase()}
                        </span>
                        <input
                          type="radio"
                          name="unifiedShipping"
                          checked={unifiedShippingType === type}
                          onChange={() => setUnifiedShippingType(type)}
                          className="accent-emerald-500"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {shippingNames[type].split("(")[1]?.replace(")", "")}
                      </span>
                      <div className="mt-2">
                        <span
                          className={`text-xs font-bold ${isLight ? "text-zinc-900" : "text-emerald-400"}`}
                        >
                          {(
                            baseShippingCosts[type] *
                            (1 - shippingDiscountPercent / 100)
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                /* MODO 2: FRETE PARTILHADO (ENVIO DIVERSIFICADO POR ITEM) */
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isLight
                          ? "bg-zinc-50 border-zinc-200"
                          : "bg-zinc-950 border-zinc-800"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="text-xs font-semibold block line-clamp-1">
                          {item.name} (x{item.quantity})
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Categoria: {item.category}
                        </span>
                      </div>

                      <select
                        value={itemShippingMap[item.id] || "normal"}
                        onChange={(e) =>
                          handleItemShippingChange(
                            item.id,
                            e.target.value as ShippingType,
                          )
                        }
                        className={`text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer ${
                          isLight
                            ? "bg-white border-zinc-300 text-zinc-900"
                            : "bg-zinc-900 border-zinc-700 text-zinc-100"
                        }`}
                      >
                        <option value="normal">📦 Padrão (+ R$ 45,00)</option>
                        <option value="expresso">
                          ✈️ Avião Expresso (+ R$ 120,00)
                        </option>
                        <option value="transportadora">
                          🚚 Caminhão Carga Pesada (+ R$ 250,00)
                        </option>
                        <option value="maritimo">
                          🚢 Navio Cabotagem (+ R$ 85,00)
                        </option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meios de Pagamento */}
            <div>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
              >
                Forma de Pagamento Corporativo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("faturado")}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${
                    paymentMethod === "faturado"
                      ? isLight
                        ? "bg-zinc-100 border-zinc-900 text-zinc-900"
                        : "bg-emerald-950/20 border-emerald-500 text-white"
                      : isLight
                        ? "bg-white border-zinc-200 text-zinc-600"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="block font-bold text-xs mb-1">
                    Boleto Faturado 30 dias
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Análise de crédito CNPJ
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${
                    paymentMethod === "pix"
                      ? isLight
                        ? "bg-zinc-100 border-zinc-900 text-zinc-900"
                        : "bg-emerald-950/20 border-emerald-500 text-white"
                      : isLight
                        ? "bg-white border-zinc-200 text-zinc-600"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="block font-bold text-xs mb-1">
                    PIX Corporativo
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Aprovação imediata
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("boleto")}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${
                    paymentMethod === "boleto"
                      ? isLight
                        ? "bg-zinc-100 border-zinc-900 text-zinc-900"
                        : "bg-emerald-950/20 border-emerald-500 text-white"
                      : isLight
                        ? "bg-white border-zinc-200 text-zinc-600"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="block font-bold text-xs mb-1">
                    Boleto à Vista
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Vencimento em 2 dias
                  </span>
                </button>
              </div>
            </div>

            {/* Totais e Botões */}
            <div
              className={`border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "border-zinc-200" : "border-zinc-800"}`}
            >
              <div className="text-left w-full sm:w-auto">
                <div className="text-xs text-zinc-400">
                  Frete ({isSplitShipping ? "Partilhado" : "Carga Unificada"}):{" "}
                  <span
                    className={
                      isLight ? "text-zinc-800 font-semibold" : "text-zinc-200"
                    }
                  >
                    {finalShippingCost.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  {shippingDiscountPercent > 0 && (
                    <span className="text-emerald-400 font-bold ml-1.5">
                      (-{shippingDiscountPercent}% atacado)
                    </span>
                  )}
                </div>
                <div
                  className={`text-base font-black ${isLight ? "text-zinc-900" : "text-emerald-400"}`}
                >
                  Total Geral:{" "}
                  {grandTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-1/2 sm:w-auto text-xs font-semibold py-3 px-5 rounded-lg transition-colors cursor-pointer border ${
                    isLight
                      ? "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                      : "bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`w-1/2 sm:w-auto text-xs font-semibold py-3 px-6 rounded-lg transition-colors shadow-md cursor-pointer ${
                    isLight
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  Finalizar Pedido B2B
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
