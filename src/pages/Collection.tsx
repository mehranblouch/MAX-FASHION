import { useState, useEffect } from "react";
import { Search, Filter, X, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Collection({ addToCart }: { addToCart: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const CATEGORIES = ["All", "Wedding", "Summer", "Winter", "2 Pieces", "3 Pieces", "Casual"];
  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1594750825015-2743c65dfeb1?q=80&w=600&auto=format&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const src = target.src;
    
    if (src.includes("instagram.com") || src.includes("facebook.com")) {
      console.warn("External social media image blocked by provider:", src);
    }
    
    target.src = PLACEHOLDER_IMAGE;
  };

  useEffect(() => {
    getDocs(collection(db, "products"))
      .then((snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Product));
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.color.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-bold mb-4 tracking-tighter">Full Collection</h1>
          <p className="text-gray-400 max-w-2xl">
            Explore our complete range of premium fashion pieces. From outerwear to essentials, find your perfect style.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 rounded-sm focus:border-yellow-500 outline-none transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              className="w-full sm:w-48 bg-white/5 border border-white/10 pl-12 pr-4 py-3 rounded-sm focus:border-yellow-500 outline-none transition-all text-sm appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-gray-400">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all">
              <div 
                className="aspect-[3/4] overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image.trim()}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
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
      )}

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
                <div className="grid grid-cols-1 gap-2 p-2 h-full bg-zinc-800">
                  <img 
                    src={selectedProduct.image.trim()} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  {selectedProduct.secondaryImage && (
                    <img 
                      src={selectedProduct.secondaryImage.trim()} 
                      alt={`${selectedProduct.name} - view 2`} 
                      className="w-full h-full object-cover rounded-sm"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                  )}
                  {selectedProduct.isOnSale && (
                    <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-sm uppercase tracking-[0.2em] shadow-2xl animate-pulse">
                      {selectedProduct.discountPercentage}% OFF
                    </div>
                  )}
                  {!selectedProduct.isOnSale && selectedProduct.isNew && (
                    <div className="absolute top-6 left-6 bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded-sm uppercase tracking-[0.2em] shadow-2xl">
                      NEW ARRIVAL
                    </div>
                  )}
                  {(selectedProduct.image.includes("instagram.com") || selectedProduct.image.includes("facebook.com")) && (
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-sm border border-white/10">
                      <p className="text-[10px] text-yellow-500 font-bold uppercase mb-2">Social Media Link</p>
                      <p className="text-xs text-gray-300 mb-3 line-clamp-2">This image may be protected by Instagram/Facebook security settings.</p>
                      <a 
                        href={selectedProduct.image} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold underline hover:text-yellow-500"
                      >
                        VIEW ORIGINAL POST
                      </a>
                    </div>
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
