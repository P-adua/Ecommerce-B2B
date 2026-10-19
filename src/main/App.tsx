import { useState } from "react";
import { products } from "../data/products";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { CartDrawer } from "../componentes/CartDrawer";
import { FavoritesDrawer } from "../componentes/FavoritesDrawer";
import { Header } from "../componentes/header";
import { LoginModal } from "../componentes/LoginModal";
import { CompanyProfileModal } from "../componentes/CompanyProfileModal";
import { useThemeStore } from "../store/useThemeStore";
import { QuickOrderModal } from "../componentes/QuickOrderModal";

function App() {
  const { addToCart, totalItems } = useCartStore();
  const { user, openLoginModal, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const isLight = theme === "light";

  const handleLogout = () => {
    logout();
    setFavorites([]);
  };

  const toggleFavorite = (productId: string) => {
    if (!user) {
      alert(
        "Por favor, faça login com sua conta B2B para gerenciar favoritos.",
      );
      openLoginModal(true);
      return;
    }

    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleOpenFavoritesHeader = () => {
    if (!user) {
      alert(
        "Por favor, faça login com sua conta B2B para acessar seus favoritos.",
      );
      openLoginModal(true);
      return;
    }
    setIsFavoritesOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteProductsList = products.filter((p) => favorites.includes(p.id));

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-20 ${
        isLight
          ? "bg-[#f8f9fa] text-zinc-900 selection:bg-zinc-900 selection:text-white"
          : "bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black"
      }`}
    >
      {/* Cabeçalho Fixo com Suporte a Tema */}
      <div
        className={`sticky top-0 z-40 backdrop-blur-xl border-b px-6 py-4 transition-colors duration-300 ${
          isLight
            ? "bg-white/80 border-zinc-200"
            : "bg-[#09090b]/80 border-zinc-800/80"
        }`}
      >
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartCount={totalItems()}
          onOpenCart={() => setIsCartOpen(true)}
          favoritesCount={favorites.length}
          user={user}
          onOpenLogin={() => openLoginModal(true)}
          onLogout={handleLogout}
          onOpenFavorites={handleOpenFavoritesHeader}
          onOpenProfile={() => setIsProfileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenQuickOrder={() => setIsQuickOrderOpen(true)}
        />
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Filtros em Pílulas adaptados ao Tema */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
            >
              Filtrar por Categoria
            </h2>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className={`text-xs hover:underline cursor-pointer font-semibold ${isLight ? "text-zinc-900" : "text-emerald-400"}`}
              >
                Limpar filtros ({selectedCategories.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedCategories([])}
              className={`text-xs font-medium px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer border ${
                selectedCategories.length === 0
                  ? isLight
                    ? "bg-zinc-900 text-white font-bold border-zinc-950 shadow-md"
                    : "bg-emerald-500 text-zinc-950 font-bold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : isLight
                    ? "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              Todos os Produtos
            </button>

            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`text-xs font-medium px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? isLight
                        ? "bg-zinc-900 text-white font-bold border-zinc-950 shadow-md"
                        : "bg-emerald-500 text-zinc-950 font-bold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : isLight
                        ? "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {category} {isSelected && "✓"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vitrine de Produtos */}
        {/* Vitrine de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFavorited = favorites.includes(product.id);
            return (
              <div
                key={product.id}
                className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative group border ${
                  isLight
                    ? "bg-white border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300" // Visual claro (Foto 1)
                    : "bg-[#121214] border-zinc-800/80 shadow-2xl hover:border-zinc-700" // Visual escuro minimalista (Foto 2)
                }`}
              >
                {/* Botão de Favoritar */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
                    isFavorited
                      ? "bg-red-500/20 text-red-500 border border-red-500/40 shadow-lg"
                      : isLight
                        ? "bg-white/80 text-zinc-600 hover:text-zinc-900 border border-zinc-200 shadow-sm"
                        : "bg-black/60 text-zinc-300 hover:text-white border border-white/10 hover:scale-105"
                  }`}
                  title={
                    isFavorited ? "Remover dos favoritos" : "Favoritar produto"
                  }
                >
                  {isFavorited ? "❤️" : "🤍"}
                </button>

                <div>
                  <div
                    className={`relative overflow-hidden h-52 ${isLight ? "bg-zinc-100" : "bg-zinc-900"}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border ${
                          isLight
                            ? "bg-emerald-950/60 border-emerald-500/20 text-emerald-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {product.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        🔥 Até 15% OFF atacado
                      </span>
                    </div>

                    <h3
                      className={`font-semibold text-sm mt-3 leading-snug line-clamp-1 ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      {product.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-5 pt-0 border-t mt-4 flex items-center justify-between ${isLight ? "border-zinc-100" : "border-zinc-800/60"}`}
                >
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">
                      Preço unit.
                    </span>
                    <span
                      className={`text-base font-bold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
                    >
                      {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>

                  {/* Botão Comprar: Verde destacado no claro, escuro sofisticado no escuro */}
                  <button
                    onClick={() => addToCart(product)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isLight
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.2)]"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 shadow-sm"
                    }`}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32 text-zinc-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-base font-medium">
              Nenhum produto encontrado para a sua busca ou filtros.
            </p>
          </div>
        )}
      </main>

      {/* Modais e Gavetas Globais */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteProductsList}
        onRemoveFavorite={toggleFavorite}
        onAddToCart={addToCart}
      />

      <LoginModal />
      <CompanyProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
      />
    </div>
  );
}

export default App;
