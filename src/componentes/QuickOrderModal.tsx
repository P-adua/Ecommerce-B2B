import { useState } from 'react';
import { products } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useThemeStore } from '../store/useThemeStore';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkuRow {
  sku: string;
  quantity: number;
}

export function QuickOrderModal({ isOpen, onClose }: QuickOrderModalProps) {
  const { addToCart } = useCartStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  
  // Linhas manuais
  const [rows, setRows] = useState<SkuRow[]>([
    { sku: 'SKU-RED-001', quantity: 5 },
    { sku: 'SKU-ENE-004', quantity: 10 },
  ]);

  // Texto para colar em massa (CSV)
  const [bulkText, setBulkText] = useState('SKU-CAB-002, 20\nSKU-AUT-003, 5');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, { sku: '', quantity: 1 }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: 'sku' | 'quantity', value: string | number) => {
    const updated = [...rows];
    if (field === 'sku') updated[index].sku = value as string;
    if (field === 'quantity') updated[index].quantity = Math.max(1, Number(value));
    setRows(updated);
  };

  // Processa as adições ao carrinho
  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let itemsToAdd: { sku: string; quantity: number }[] = [];

    if (activeTab === 'manual') {
      itemsToAdd = rows.filter((r) => r.sku.trim() !== '');
    } else {
      // Processa o texto separado por vírgula ou quebra de linha
      const lines = bulkText.split('\n');
      lines.forEach((line) => {
        const parts = line.split(/[,;\t]/);
        if (parts.length >= 2) {
          const sku = parts[0].trim();
          const quantity = parseInt(parts[1].trim(), 10) || 1;
          if (sku) itemsToAdd.push({ sku, quantity });
        }
      });
    }

    if (itemsToAdd.length === 0) {
      setFeedback('⚠️ Nenhum SKU válido informado.');
      return;
    }

    let addedCount = 0;
    let notFoundCount = 0;

    itemsToAdd.forEach(({ sku, quantity }) => {
      const foundProduct = products.find(
        (p) => (p.sku && p.sku.toLowerCase() === sku.toLowerCase()) || p.id === sku
      );

      if (foundProduct) {
        addToCart(foundProduct, quantity);
        addedCount++;
      } else {
        notFoundCount++;
      }
    });

    setFeedback(
      `✓ ${addedCount} item(ns) adicionado(s) ao carrinho com sucesso! ${
        notFoundCount > 0 ? `(${notFoundCount} SKU(s) não encontrado(s))` : ''
      }`
    );

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho */}
        <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>⚡</span> Pedido Rápido por SKU (Bulk Order)
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Insira os códigos dos produtos para preencher seu carrinho em lote
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-zinc-500 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Abas */}
        <div className={`flex gap-4 border-b my-4 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'manual'
                ? (isLight ? 'border-zinc-900 text-zinc-900' : 'border-emerald-400 text-emerald-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📝 Preenchimento Manual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'bulk'
                ? (isLight ? 'border-zinc-900 text-zinc-900' : 'border-emerald-400 text-emerald-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📋 Colar em Lote (CSV / Lista)
          </button>
        </div>

        {feedback && (
          <div className={`mb-4 p-3 rounded-xl border text-xs font-semibold text-center ${
            isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
          }`}>
            {feedback}
          </div>
        )}

        <form onSubmit={handleProcessOrder} className="space-y-4">
          {activeTab === 'manual' ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                <span>Código SKU do Produto</span>
                <span className="w-24 text-center">Quantidade</span>
                <span className="w-8"></span>
              </div>

              {rows.map((row, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Ex: SKU-RED-001"
                    value={row.sku}
                    onChange={(e) => handleRowChange(index, 'sku', e.target.value)}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none uppercase ${
                      isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                    className={`w-24 border rounded-lg px-3 py-2 text-sm text-center focus:outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-400 text-sm font-bold p-2 cursor-pointer"
                    title="Remover linha"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddRow}
                className={`text-xs font-semibold py-2 px-3 rounded-lg border transition-colors cursor-pointer w-full text-center ${
                  isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                + Adicionar Outro SKU
              </button>
            </div>
          ) : (
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Cole sua lista no formato: <code>SKU, Quantidade</code> (uma por linha)
              </label>
              <textarea
                rows={6}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={'SKU-RED-001, 10\nSKU-CAB-002, 5\nSKU-ENE-004, 20'}
                className={`w-full border rounded-lg p-3 text-sm font-mono focus:outline-none ${
                  isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                }`}
              />
            </div>
          )}

          {/* Dica de SKUs disponíveis */}
          <div className={`p-3 rounded-xl border text-[11px] ${
            isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-600' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
          }`}>
            <span className="font-bold block mb-1">💡 SKUs disponíveis para teste rápido:</span>
            <span className="font-mono text-[10px]">
              SKU-RED-001 | SKU-CAB-002 | SKU-AUT-003 | SKU-ENE-004 | SKU-HW-007
            </span>
          </div>

          <div className={`flex justify-end gap-3 pt-4 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border ${
                isLight ? 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`text-xs font-bold px-6 py-2.5 rounded-lg transition-all shadow-md cursor-pointer ${
                isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              🚀 Processar e Adicionar ao Carrinho
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}