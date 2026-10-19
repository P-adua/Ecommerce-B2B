import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useOrderStore, type Order } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyProfileModal({ isOpen, onClose }: CompanyProfileModalProps) {
  const { user, login } = useAuthStore();
  const { theme } = useThemeStore();
  const { orders } = useOrderStore();
  const { addToCart } = useCartStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders'); // Padrão abrir em pedidos se houver
  const [billingEmail, setBillingEmail] = useState(user?.billingEmail || 'financeiro@empresa.com');
  const [phone, setPhone] = useState(user?.phone || '(11) 98888-7777');
  const [address, setAddress] = useState(user?.address || 'Av. Industrial, 1000 - Galpão 4, São Paulo - SP');
  const [documentStatus, setDocumentStatus] = useState<'Pendente' | 'Enviado' | 'Verificado'>(user?.documentStatus || 'Pendente');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      ...user,
      billingEmail,
      phone,
      address,
      documentStatus,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUploadDocs = () => {
    setDocumentStatus('Enviado');
    alert('Documentos de CNPJ enviados com sucesso para análise do departamento de crédito!');
  };

  // Função para reordenar todos os itens do pedido antigo para o carrinho
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    alert(`Sucesso! Os itens do pedido ${order.id} foram adicionados ao seu carrinho.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho */}
        <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🏢</span> Painel da Conta Corporativa
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{user.companyName} • CNPJ: {user.cnpj}</p>
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

        {/* Navegação por Abas */}
        <div className={`flex gap-4 border-b my-4 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'orders'
                ? (isLight ? 'border-zinc-900 text-zinc-900' : 'border-emerald-400 text-emerald-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📦 Histórico de Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? (isLight ? 'border-zinc-900 text-zinc-900' : 'border-emerald-400 text-emerald-400')
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚙️ Dados Cadastrais & Crédito
          </button>
        </div>

        {/* Conteúdo da Aba 1: Histórico de Pedidos */}
        {activeTab === 'orders' && (
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p className="text-3xl mb-2">🛍️</p>
                <p className="text-sm font-semibold">Nenhum pedido realizado ainda.</p>
                <p className="text-xs text-zinc-500 mt-1">Seus pedidos faturados e cotações aparecerão aqui.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-zinc-800/40">
                    <div>
                      <span className={`font-bold text-sm ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>{order.id}</span>
                      <span className="text-xs text-zinc-400 ml-3">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                        isLight ? 'bg-zinc-200 text-zinc-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Resumo de itens comprados */}
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-zinc-400 line-clamp-1">• {item.name} (x{item.quantity})</span>
                        <span className="font-semibold text-zinc-300">
                          {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total e Ação de Reorder */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 mt-1">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Total do Pedido</span>
                      <span className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                        {order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReorder(order)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer border shadow-sm ${
                        isLight 
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                      }`}
                    >
                      🔄 Comprar Novamente
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Conteúdo da Aba 2: Dados Cadastrais */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-5">
            {isSaved && (
              <div className={`mb-4 border text-xs px-4 py-2.5 rounded-lg text-center font-semibold ${
                isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
              }`}>
                ✓ Alterações salvas com sucesso!
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>E-mail de Cobrança / Financeiro</label>
                  <input 
                    type="email" 
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    required
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>Telefone Corporativo</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>Endereço de Logística</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Crédito e Documentos</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Validação de CNPJ para faturamento a 30 dias.</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  documentStatus === 'Verificado' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {documentStatus}
                </span>
              </div>

              {documentStatus === 'Pendente' && (
                <button
                  type="button"
                  onClick={handleUploadDocs}
                  className="text-xs font-semibold px-4 py-2 rounded-lg border bg-zinc-800 text-zinc-200 cursor-pointer"
                >
                  📁 Enviar Documentação do CNPJ
                </button>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                className={`text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'bg-zinc-900 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}