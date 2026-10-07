import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyProfileModal({ isOpen, onClose }: CompanyProfileModalProps) {
  const { user, login } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho */}
        <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🏢</span> Painel da Conta Corporativa
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Gerencie dados cadastrais, fiscais e documentos do CNPJ</p>
          </div>
          <button 
            onClick={onClose}
            className={`text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            ✕
          </button>
        </div>

        {isSaved && (
          <div className={`mb-4 border text-xs px-4 py-2.5 rounded-lg text-center font-semibold ${
            isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
          }`}>
            ✓ Alterações salvas com sucesso!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Dados Fixos de Identificação */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
          }`}>
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">Razão Social</span>
              <span className={`text-sm font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>{user.companyName}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">CNPJ Cadastrado</span>
              <span className={`text-sm font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>{user.cnpj}</span>
            </div>
          </div>

          {/* Configurações de Cobrança e Contato */}
          <div className="space-y-4">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Notificações e Faturamento</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>E-mail de Cobrança / Financeiro</label>
                <input 
                  type="email" 
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
                  }`}
                />
                <span className="text-[10px] text-zinc-400 mt-0.5 block">Boletos e notas fiscais serão enviados para este endereço.</span>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>Telefone de Contato Corporativo</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>Endereço Completo de Faturamento / Logística</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                  isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Verificação de CNPJ por Documentos */}
          <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Verificação de CNPJ e Crédito B2B</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Envie o Contrato Social ou Cartão CNPJ para liberar limites de faturamento.</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                documentStatus === 'Verificado' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                documentStatus === 'Enviado' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                (isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-800 text-zinc-400')
              }`}>
                {documentStatus === 'Verificado' ? 'Verificado ✓' : documentStatus === 'Enviado' ? 'Em Análise ⏳' : 'Pendente ⚠️'}
              </span>
            </div>

            {documentStatus === 'Pendente' && (
              <button
                type="button"
                onClick={handleUploadDocs}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border ${
                  isLight ? 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100' : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                📁 Enviar Documentação do CNPJ (Simulação)
              </button>
            )}
          </div>

          {/* Botões do Rodapé */}
          <div className={`flex justify-end gap-3 pt-4 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer border ${
                isLight ? 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Fechar
            </button>
            <button
              type="submit"
              className={`text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md cursor-pointer ${
                isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              Salvar Alterações
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}