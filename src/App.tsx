import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Facebook, Instagram, MessageCircle as Whatsapp, Music, Search, Filter } from "lucide-react";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import { Product, Settings } from "./types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "store_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
    };
    fetchSettings();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Navbar cartCount={cart.length} />
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} settings={settings} />} />
          <Route path="/collection" element={<Collection addToCart={addToCart} />} />
          <Route path="/about" element={<About settings={settings} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkout" element={<Checkout cart={cart} removeFromCart={removeFromCart} />} />
        </Routes>
        <Footer settings={settings} />
      </div>
    </Router>
  );
}

function Navbar({ cartCount }: { cartCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter">
              <span className="text-white">MAX</span>
              <span className="text-yellow-500">FASHION</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-yellow-500 transition-colors">HOME</Link>
              <Link to="/collection" className="hover:text-yellow-500 transition-colors">COLLECTION</Link>
              <Link to="/about" className="hover:text-yellow-500 transition-colors">ABOUT</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/collection" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </Link>
            <Link to="/collection" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Filter className="w-6 h-6" />
            </Link>
            <Link to="/checkout" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/10">HOME</Link>
          <Link to="/collection" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/10">COLLECTION</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/10">ABOUT</Link>
        </div>
      )}
    </nav>
  );
}

function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">
            <span className="text-white">MAX</span>
            <span className="text-yellow-500">FASHION</span>
          </h3>
          <p className="text-gray-400 text-sm">
            Discover the latest trends in premium fashion. Meticulously crafted for the modern individual who demands elegance.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">QUICK LINKS</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/collection" className="hover:text-white">Collection</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">FOLLOW US</h4>
          <div className="flex space-x-4">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                <Music className="w-5 h-5" />
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                <Whatsapp className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
        &copy; 2026 MAXFASHION. All rights reserved.
      </div>
    </footer>
  );
}
