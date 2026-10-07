import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

export function CheckoutModal({ isOpen, onClose, companyName }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  
  // Estados do Checkout
  const [shippingType, setShippingType] = useState<'normal' | 'expresso' | 'transportadora'>('normal');
  const [paymentMethod, setPaymentMethod] = useState<'boleto' | 'pix' | 'faturado'>('faturado');
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Valores de frete simulados para B2B
  const shippingCosts = {
    normal: 45.00,
    expresso: 120.00,
    transportadora: 250.00, // Ideal para cargas pesadas/hardware
  };

  const shippingDays = {
    normal: '5 a 8 dias úteis',
    expresso: '2 a 3 dias úteis',
    transportadora: '7 a 12 dias úteis (Carga Pesada)',
  };

  const currentShippingCost = shippingCosts[shippingType];
  const grandTotal = totalPrice() + currentShippingCost;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
  };

  const handleCloseAll = () => {
    clearCart();
    setOrderSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span>📋</span> Checkout de Pedido Corporativo (B2B)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Empresa faturada: <span className="text-emerald-400 font-semibold">{companyName || 'Cliente B2B'}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {orderSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-2xl font-bold text-emerald-400">Pedido B2B Realizado com Sucesso!</h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              O seu pedido foi encaminhado para o departamento de faturamento e logística. Um e-mail de confirmação foi enviado para o responsável.
            </p>
            <div className="pt-4">
              <button
                onClick={handleCloseAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-lg cursor-pointer text-sm"
              >
                Concluir e Retornar à Loja
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinishOrder} className="space-y-6">
            
            {/* Resumo do Pedido */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Resumo dos Itens</h3>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-300 line-clamp-1">{item.name} (x{item.quantity})</span>
                    <span className="font-semibold text-emerald-400">
                      {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opções de Frete */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Modalidade de Frete e Logística</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${shippingType === 'normal' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Frete Padrão</span>
                    <input type="radio" name="shipping" checked={shippingType === 'normal'} onChange={() => setShippingType('normal')} className="accent-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-400">{shippingDays.normal}</span>
                  <span className="text-sm font-bold text-emerald-400 mt-2">R$ 45,00</span>
                </label>

                <label className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${shippingType === 'expresso' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Expresso Aéreo</span>
                    <input type="radio" name="shipping" checked={shippingType === 'expresso'} onChange={() => setShippingType('expresso')} className="accent-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-400">{shippingDays.expresso}</span>
                  <span className="text-sm font-bold text-emerald-400 mt-2">R$ 120,00</span>
                </label>

                <label className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${shippingType === 'transportadora' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Carga Pesada</span>
                    <input type="radio" name="shipping" checked={shippingType === 'transportadora'} onChange={() => setShippingType('transportadora')} className="accent-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-400">{shippingDays.transportadora}</span>
                  <span className="text-sm font-bold text-emerald-400 mt-2">R$ 250,00</span>
                </label>
              </div>
            </div>

            {/* Meio de Pagamento B2B */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Forma de Pagamento Corporativo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('faturado')}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${paymentMethod === 'faturado' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="block font-bold text-xs mb-1">Boleto Faturado 30 dias</span>
                  <span className="text-[10px] text-zinc-400">Sujeito à análise de crédito CNPJ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${paymentMethod === 'pix' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="block font-bold text-xs mb-1">PIX Corporativo</span>
                  <span className="text-[10px] text-zinc-400">Aprovação imediata do pedido</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${paymentMethod === 'boleto' ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="block font-bold text-xs mb-1">Boleto à Vista</span>
                  <span className="text-[10px] text-zinc-400">Vencimento em 2 dias úteis</span>
                </button>
              </div>
            </div>

            {/* Totais e Botão de Ação */}
            <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <div className="text-xs text-zinc-400">Frete: <span className="text-zinc-200">{currentShippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                <div className="text-base font-black text-emerald-400">
                  Total Geral: {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-3 px-5 rounded-lg transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-1/2 sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg cursor-pointer"
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