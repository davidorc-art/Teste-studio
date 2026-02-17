import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Product } from '../types';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export const Bar: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);

  useEffect(() => {
    setProducts(store.getProducts());
  }, []);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = Math.max(1, item.quantity + delta);
        if (newQ > item.product.stock) return item; // Cap at stock
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const sale = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      items: cart.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.price })),
      total: total,
      paymentMethod: 'Pix' as any
    };

    store.addSale(sale);
    
    // Update stock
    cart.forEach(item => {
      const newStock = item.product.stock - item.quantity;
      store.updateProductStock(item.product.id, newStock);
    });

    setCart([]);
    setProducts(store.getProducts()); // Reload stock
    alert('Venda registrada com sucesso!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Product Grid */}
      <div className="lg:col-span-2 overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🍺</span> Bar Viking
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`p-4 rounded-xl border flex flex-col items-start transition-all ${
                product.stock === 0 
                  ? 'bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20'
              }`}
            >
              <div className="flex justify-between w-full mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${product.isAlcoholic ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                    {product.category}
                </span>
                <span className="text-xs text-zinc-500">{product.stock} un.</span>
              </div>
              <h3 className="text-white font-bold text-lg text-left">{product.name}</h3>
              <p className="text-purple-400 font-bold mt-2">R$ {product.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-full shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
                <ShoppingCart size={20} /> Comanda Atual
            </h3>
            <span className="text-sm text-zinc-500">{cart.length} itens</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
                <p className="text-center text-zinc-600 mt-10">Carrinho vazio.</p>
            ) : (
                cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg">
                        <div>
                            <p className="text-white text-sm font-medium">{item.product.name}</p>
                            <p className="text-purple-400 text-xs">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-zinc-400 hover:text-white"><Minus size={16} /></button>
                            <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-zinc-400 hover:text-white"><Plus size={16} /></button>
                            <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-500 ml-2"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 rounded-b-2xl">
            <div className="flex justify-between items-end mb-4">
                <p className="text-zinc-400">Total</p>
                <p className="text-3xl font-bold text-white">R$ {total.toFixed(2)}</p>
            </div>
            <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-colors text-lg"
            >
                Confirmar Venda
            </button>
        </div>
      </div>
    </div>
  );
};