interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  favoritesCount: number;
  user: { companyName: string } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenQuickOrder: () => void; // 1. Adicionado aqui nas propriedades
}

export function Header({
  searchTerm,
  onSearchChange,
  cartCount,
  onOpenCart,
  favoritesCount,
  user,
  onOpenLogin,
  onLogout,
  onOpenFavorites,
  onOpenProfile,
  theme,
  onToggleTheme,
  onOpenQuickOrder, // 2. Adicionado aqui nos parâmetros desestruturados
}: HeaderProps) {
  const isLight = theme === 'light';

  return (
    <header className={`max-w-7xl mx-auto mb-4 border-b pb-6 transition-colors duration-300 ${isLight ? 'border-zinc-200' : 'border-zinc-800/80'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logotipo */}
        <div>
          <h1 className={`text-2xl font-black flex items-center gap-2 transition-colors ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
            <span>📦</span> B2B Corp Store
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Suprimentos e Equipamentos Corporativos</p>
        </div>

        {/* Pesquisa */}
        <div className="w-full md:w-96">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome ou código..."
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm transition-colors focus:outline-none ${
                isLight 
                  ? 'bg-zinc-100 border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          
          {/* Botão de Pedido Rápido (SKU) */}
          <button 
            onClick={onOpenQuickOrder}
            className={`text-xs font-bold px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' : 'bg-zinc-900 border-zinc-800 text-emerald-400 hover:bg-zinc-800'
            }`}
            title="Compra Rápida por SKU"
          >
            <span>⚡</span> <span className="hidden sm:inline">Pedido SKU</span>
          </button>

          {/* Botão de Tema Claro / Escuro */}
          <button 
            onClick={onToggleTheme}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
              isLight 
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
            title={isLight ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
          >
            <span className="text-base">{isLight ? '🌙' : '☀️'}</span>
          </button>

          <button 
            onClick={onOpenFavorites}
            className={`relative p-2.5 rounded-lg border transition-colors cursor-pointer ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
            title="Meus Favoritos"
          >
            <span className="text-lg">❤️</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {favoritesCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenCart}
            className={`text-sm border px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <span>🛒 Carrinho:</span>
            <span className={`font-bold ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>{cartCount} itens</span>
          </button>

          {/* Autenticação / Perfil */}
          {user ? (
            <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg ${isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-900 border-zinc-800'}`}>
              <button 
                onClick={onOpenProfile}
                className="text-left hover:opacity-80 transition-opacity cursor-pointer"
                title="Editar dados da empresa"
              >
                <span className={`text-[10px] block font-semibold uppercase ${isLight ? 'text-zinc-600' : 'text-emerald-400'}`}>Empresa Conectada</span>
                <span className={`text-xs font-bold line-clamp-1 ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>{user.companyName} ⚙️</span>
              </button>
              <button 
                onClick={onLogout}
                className={`text-xs hover:text-red-500 ml-2 font-semibold cursor-pointer pl-2 border-l ${isLight ? 'text-zinc-500 border-zinc-300' : 'text-zinc-400 border-zinc-800'}`}
                title="Sair da conta"
              >
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer border shadow-md ${
                isLight 
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-900 hover:bg-zinc-800' 
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-900/30'
              }`}
            >
              Entrar / B2B
            </button>
          )}

        </div>

      </div>
    </header>
  );
}