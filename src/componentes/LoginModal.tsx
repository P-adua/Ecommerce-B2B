import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export function LoginModal() {
  const { isLoginModalOpen, openLoginModal, login } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [cnpj, setCnpj] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

  if (!isLoginModalOpen) return null;

  const handleFillTestData = () => {
    setCnpj('12.345.678/0001-90');
    setCompanyName('TechCorp Suprimentos Globais S.A.');
    setEmail('compras@techcorp.com.br');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj || !companyName) return;

    login({
      cnpj,
      companyName,
      email: email || 'contato@empresa.com',
      segment: 'Tecnologia e Infraestrutura'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho do Modal */}
        <div className={`flex items-center justify-between pb-4 border-b mb-4 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div>
            <h3 className="text-lg font-bold">Portal B2B - Identificação</h3>
            <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Insira os dados da sua empresa para prosseguir</p>
          </div>
          <button 
            onClick={() => openLoginModal(false)}
            className={`text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Atalho para preencher dados de teste */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleFillTestData}
            className={`w-full text-xs font-semibold py-2 px-3 rounded-lg border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' : 'bg-zinc-800 border-zinc-700 text-emerald-400 hover:bg-zinc-700'
            }`}
          >
            <span>⚡ Preencher com Empresa de Teste</span>
          </button>
        </div>

        {/* Formulário de Acesso */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>CNPJ da Empresa</label>
            <input 
              type="text" 
              placeholder="00.000.000/0001-00" 
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>Razão Social / Nome da Empresa</label>
            <input 
              type="text" 
              placeholder="Ex: TechCorp Soluções Ltda" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>E-mail Corporativo de Contato</label>
            <input 
              type="email" 
              placeholder="compras@techcorp.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500'
              }`}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className={`w-full font-semibold py-2.5 rounded-lg transition-colors shadow-md cursor-pointer text-sm ${
                isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              Acessar Conta Corporativa
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}