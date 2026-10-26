import { useCompareStore } from '../store/useCompareStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCartStore } from '../store/useCartStore';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart } = useCartStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  if (!isOpen || compareItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative border animate-in fade-in zoom-in-95 duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        
        {/* Cabeçalho */}
        <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>⚖️</span> Comparador Técnico de Produtos B2B
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Comparando {compareItems.length} de até 3 produtos selecionados
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              Limpar Tudo
            </button>
            <button 
              onClick={onClose}
              className={`text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-zinc-500 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabela de Comparação */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className={`p-3 text-xs uppercase tracking-wider w-36 border-b ${isLight ? 'border-zinc-200 text-zinc-500' : 'border-zinc-800 text-zinc-400'}`}>
                  Critério
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className={`p-3 border-b align-top ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-lg border border-zinc-800/40" />
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Remover da comparação"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{item.sku}</span>
                      <h3 className="text-xs font-bold line-clamp-2">{item.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-zinc-800/40">
              
              {/* Preço */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Preço Unitário</td>
                {compareItems.map((item) => (
                  <td key={item.id} className={`p-3 font-black text-sm ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                ))}
              </tr>

              {/* Categoria */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Categoria</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3 text-zinc-300">
                    {item.category}
                  </td>
                ))}
              </tr>

              {/* Tipo / Padrão */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Tipo / Padrão</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3 text-zinc-300">
                    {item.specs?.type || 'Standard'}
                  </td>
                ))}
              </tr>

              {/* Conexões / Portas */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Portas / Interface</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3 text-zinc-300 font-mono">
                    {item.specs?.interface || 'Padrão corporativo'}
                  </td>
                ))}
              </tr>

              {/* Desempenho / Velocidade */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Desempenho / Velocidade</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3 text-zinc-300">
                    {item.specs?.speed || 'Alta performance'}
                  </td>
                ))}
              </tr>

              {/* Alimentação / Energia */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Alimentação / Potência</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3 text-zinc-300">
                    {item.specs?.power || 'Bivolt'}
                  </td>
                ))}
              </tr>

              {/* Garantia */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Garantia Corporativa</td>
                {compareItems.map((item) => (
                  <td key={item.id} className={`p-3 font-bold ${isLight ? 'text-zinc-900' : 'text-emerald-400'}`}>
                    {item.warranty || '1 Ano'}
                  </td>
                ))}
              </tr>

              {/* Ação de Compra */}
              <tr>
                <td className={`p-3 font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Ação</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-3">
                    <button
                      onClick={() => {
                        addToCart(item, 1);
                        alert(`Item ${item.name} adicionado ao carrinho!`);
                      }}
                      className={`w-full text-xs font-bold py-2 px-3 rounded-lg transition-all cursor-pointer shadow-sm ${
                        isLight 
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      🛒 Adicionar
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}