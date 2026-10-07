import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { CheckoutModal } from './CheckoutModal';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();
  const { user, openLoginModal } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenCheckout = () => {
    if (!user) {
      alert('Por favor, faça login com sua conta B2B para prosseguir com o faturamento do pedido.');
      onClose();
      openLoginModal(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        <div className={`w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 border-l ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
        }`}>
          
          {/* Cabeçalho da Gaveta */}
          <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
            <h2 className="text-lg font-bold">Carrinho de Compras B2B</h2>
            <button 
              onClick={onClose}
              className={`text-xl font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-zinc-400 mt-20">
                <p className="text-4xl mb-2">🛒</p>
                <p>O seu carrinho está vazio.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={`border p-3 rounded-xl flex gap-3 items-center ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
                }`}>
                  <img src={item.image} alt={item.name} className={`w-16 h-16 object-cover rounded-lg ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm line-clamp-1 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>{item.name}</h4>
                    <span className={`text-xs font-bold ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                      {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`text-xs px-2 py-0.5 rounded font-bold cursor-pointer border ${
                          isLight ? 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`text-xs px-2 py-0.5 rounded font-bold cursor-pointer border ${
                          isLight ? 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-xs text-red-500 hover:underline cursor-pointer font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé com Totais e Ações */}
          {items.length > 0 && (
            <div className={`p-4 border-t space-y-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/50 border-zinc-800'}`}>
              <div className="flex justify-between items-center text-sm">
                <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Subtotal do Pedido:</span>
                <span className={`text-lg font-black ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                  {totalPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearCart}
                  className={`w-1/3 text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer border ${
                    isLight ? 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Esvaziar
                </button>
                <button 
                  onClick={handleOpenCheckout}
                  className={`w-2/3 text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-md cursor-pointer ${
                    isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  Avançar para Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        companyName={user?.companyName}
      />
    </>
  );
}