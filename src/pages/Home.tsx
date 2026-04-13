import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X, ShoppingCart } from "lucide-react";
import { Product, Settings } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Home({ addToCart, settings }: { addToCart: (p: Product) => void, settings: Settings }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getDocs(collection(db, "products"))
      .then((snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));
        setProducts(data);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-yellow-500 font-bold tracking-[0.3em] mb-4 text-sm sm:text-base">NEW SEASON 2026</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter leading-none">
            Elevate Your <span className="text-yellow-500">Style</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the latest trends in premium fashion. Meticulously crafted for the modern individual who demands elegance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              SHOP COLLECTION <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:bg-white/10 transition-all rounded-sm font-bold flex items-center justify-center"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 font-bold tracking-widest mb-2 text-xs">EXCLUSIVE</p>
          <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Handpicked pieces for the discerning individual — crafted with precision, designed for the modern wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all">
              <div 
                className="aspect-[3/4] overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {product.isOnSale && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-sm uppercase tracking-widest shadow-xl animate-pulse">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                {!product.isOnSale && product.isNew && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1.5 rounded-sm uppercase tracking-widest shadow-xl">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-sm sm:text-lg mb-1 truncate">{product.name}</h3>
                <div className="mb-2">
                  {product.isOnSale ? (
                    <div className="flex items-center gap-2">
                      <p className="text-yellow-500 font-black text-base sm:text-xl">
                        Rs. {(product.price * (1 - (product.discountPercentage || 0) / 100)).toLocaleString()}
                      </p>
                      <p className="text-gray-500 line-through text-[10px] sm:text-xs">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-yellow-500 font-bold text-base sm:text-xl">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 mb-4 uppercase tracking-tighter sm:tracking-widest">
                  <span>{product.pieces} PIECES</span>
                  <span className="text-right">COLORS: {product.color}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 sm:py-3 bg-white/10 hover:bg-yellow-500 hover:text-black transition-all text-[10px] sm:text-sm font-bold rounded-sm"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/collection" className="inline-flex items-center gap-2 text-yellow-500 font-bold hover:underline">
            VIEW ALL COLLECTION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/10 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[3/4] md:aspect-auto">
                <div className="grid grid-cols-1 gap-2 p-2">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                  {selectedProduct.secondaryImage && (
                    <img 
                      src={selectedProduct.secondaryImage} 
                      alt={`${selectedProduct.name} - view 2`} 
                      className="w-full h-full object-cover rounded-sm"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>
              <div className="p-8 sm:p-12">
                <p className="text-yellow-500 font-bold text-xs tracking-widest mb-2 uppercase">{selectedProduct.category}</p>
                <h2 className="text-4xl font-bold mb-4 tracking-tighter">{selectedProduct.name}</h2>
                <div className="mb-8">
                  {selectedProduct.isOnSale ? (
                    <div className="flex items-center gap-4">
                      <p className="text-4xl font-black text-yellow-500">
                        Rs. {(selectedProduct.price * (1 - (selectedProduct.discountPercentage || 0) / 100)).toLocaleString()}
                      </p>
                      <p className="text-xl text-gray-500 line-through">
                        Rs. {selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold text-yellow-500">Rs. {selectedProduct.price.toLocaleString()}</p>
                  )}
                </div>
                
                <div className="space-y-6 mb-12">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-gray-400 leading-relaxed">
                      {selectedProduct.description || "No description available for this product."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pieces</h4>
                      <p className="font-bold">{selectedProduct.pieces} Pieces Set</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Available Colors</h4>
                      <p className="font-bold">{selectedProduct.color}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
