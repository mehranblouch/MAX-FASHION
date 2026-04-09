import { Facebook, Instagram, MessageCircle as Whatsapp, Music } from "lucide-react";
import { Settings } from "../types";

export default function About({ settings }: { settings: Settings }) {
  return (
    <div className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-6xl font-bold mb-8 tracking-tighter">Our Story</h1>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            Founded in 2026, MAXFASHION was born out of a passion for premium craftsmanship and timeless elegance. We believe that fashion is more than just clothing; it's an expression of individuality and confidence.
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our mission is to provide meticulously crafted pieces that blend modern trends with classic sophistication. Every item in our collection is handpicked to ensure the highest quality for the discerning individual.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-yellow-500 font-bold text-3xl mb-2">10k+</h3>
              <p className="text-gray-500 text-sm uppercase tracking-widest">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-yellow-500 font-bold text-3xl mb-2">500+</h3>
              <p className="text-gray-500 text-sm uppercase tracking-widest">Premium Designs</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-6">Connect With Us</h3>
            <div className="flex gap-6">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                  <Music className="w-6 h-6" />
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all">
                  <Whatsapp className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
              alt="Our Workshop"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-yellow-500 text-black p-8 rounded-lg hidden lg:block">
            <p className="font-bold text-2xl italic">"Elegance is the only beauty that never fades."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
