import { useThemeStore } from '../store/useThemeStore';
import type { Product } from '../types/products';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart,
}: FavoritesDrawerProps) {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className={`w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 border-l ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho da Gaveta */}
        <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>❤</span> Meus Produtos Favoritos
          </h2>
          <button 
            onClick={onClose}
            className={`text-xl font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Lista de Itens Favoritos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center text-zinc-400 mt-20">
              <p className="text-4xl mb-2">🤍</p>
              <p>A sua lista de favoritos está vazia.</p>
            </div>
          ) : (
            favorites.map((product) => (
              <div key={product.id} className={`border p-3 rounded-xl flex gap-3 items-center ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800/80'
              }`}>
                <img src={product.image} alt={product.name} className={`w-16 h-16 object-cover rounded-lg ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm line-clamp-1 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>{product.name}</h4>
                  <span className={`text-xs font-bold block mt-0.5 ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>

                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer flex-1 text-center ${
                        isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      Adicionar ao Carrinho
                    </button>
                    <button 
                      onClick={() => onRemoveFavorite(product.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border ${
                        isLight ? 'bg-white border-zinc-300 text-red-600 hover:bg-zinc-100' : 'bg-zinc-800 border-transparent text-red-400 hover:bg-zinc-700'
                      }`}
                      title="Remover dos favoritos"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className={`p-4 border-t text-center ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-600' : 'bg-zinc-950/50 border-zinc-800 text-zinc-400'}`}>
          <p className="text-xs">
            Total de itens favoritados: <span className={`font-bold ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>{favorites.length}</span>
          </p>
        </div>

      </div>
    </div>
  );
}