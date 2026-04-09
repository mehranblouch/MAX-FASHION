import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Package, ShoppingCart, Settings as SettingsIcon, Image as ImageIcon, X } from "lucide-react";
import { Product, Order, Settings } from "../types";
import { collection, getDocs, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>({ facebook: "", instagram: "", tiktok: "", whatsapp: "" });
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    pieces: "",
    color: "",
    price: "",
    category: "Casual",
    description: "",
    image: "",
  });

  const CATEGORIES = ["Wedding", "Summer", "Winter", "2 Pieces", "3 Pieces", "Casual"];

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials for demo purposes
    if (loginData.username === "dilawar" && loginData.password === "dilawar4747") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const fetchData = async () => {
    const productsSnap = await getDocs(collection(db, "products"));
    const pData = productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Product));

    const ordersSnap = await getDocs(collection(db, "orders"));
    const oData = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Order)).sort((a,b) => {
        // basic sort fallback
        return (b.createdAt as any)?.seconds - (a.createdAt as any)?.seconds;
    });

    const settingsSnap = await getDoc(doc(db, "settings", "store_settings"));
    const sData = settingsSnap.exists() ? settingsSnap.data() as Settings : { facebook: "", instagram: "", tiktok: "", whatsapp: "" };

    setProducts(pData);
    setOrders(oData);
    setSettings(sData);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      pieces: Number(formData.pieces),
      color: formData.color,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image,
    };

    if (isEditing) {
      await updateDoc(doc(db, "products", isEditing.id), payload);
    } else {
      await addDoc(collection(db, "products"), payload);
    }

    setShowForm(false);
    setIsEditing(null);
    setFormData({ name: "", pieces: "", color: "", price: "", category: "Casual", description: "", image: "" });
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchData();
    }
  };

  const handleOrderStatusUpdate = async (id: string, field: string, value: boolean) => {
    await updateDoc(doc(db, "orders", id), {
      [field]: value ? 1 : 0
    });
    fetchData();
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "store_settings"), settings);
    alert("Settings updated successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-yellow-500 mb-2">ADMIN LOGIN</h2>
            <p className="text-gray-400 text-sm">Please enter your credentials to access the portal.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
              <input
                required
                type="text"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input
                required
                type="password"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
            <button className="w-full py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter">Admin Portal</h1>
          <p className="text-gray-400">Manage your store products, orders, and social links.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "products" ? "bg-yellow-500 text-black" : "hover:bg-white/5"}`}
          >
            PRODUCTS
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "orders" ? "bg-yellow-500 text-black" : "hover:bg-white/5"}`}
          >
            ORDERS
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "settings" ? "bg-yellow-500 text-black" : "hover:bg-white/5"}`}
          >
            SETTINGS
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-yellow-500" /> INVENTORY
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setIsEditing(null);
              }}
              className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> ADD PRODUCT
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-zinc-900 z-10 pb-4 border-b border-white/5">
                  <h3 className="text-2xl font-bold">{isEditing ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (Rs.)</label>
                      <input
                        required
                        type="number"
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pieces Available</label>
                      <input
                        required
                        type="number"
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                        value={formData.pieces}
                        onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                      <select
                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                    <textarea
                      className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all h-32 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter product details, material, care instructions, etc."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Image URL</label>
                    <input
                      required
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                  <button className="w-full py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all">
                    {isEditing ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col gap-4 group">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-sm" />
                <div className="flex-1">
                  <h4 className="font-bold truncate text-sm sm:text-base">{p.name}</h4>
                  <p className="text-yellow-500 text-xs sm:text-sm font-bold">Rs. {p.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-1">{p.pieces} pcs | {p.color}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setIsEditing(p);
                        setFormData({ 
                          name: p.name, 
                          pieces: String(p.pieces), 
                          color: p.color, 
                          price: String(p.price), 
                          category: p.category || "Casual",
                          description: p.description || "",
                          image: p.image || "" 
                        });
                        setShowForm(true);
                      }}
                      className="flex-1 p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-sm transition-all flex justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="flex-1 p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-sm transition-all flex justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-yellow-500" /> RECENT ORDERS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase">
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Product</th>
                  <th className="py-4 px-4">Address</th>
                  <th className="py-4 px-4 text-center">Dispatched</th>
                  <th className="py-4 px-4 text-center">Delivered</th>
                  <th className="py-4 px-4 text-center">Paid</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold">{o.fullName}</p>
                      <p className="text-xs text-gray-500">{o.email}</p>
                      <p className="text-xs text-gray-500">{o.phoneNumber}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-yellow-500">{o.productName || "Deleted Product"}</td>
                    <td className="py-4 px-4 text-gray-400">
                      {o.houseNumber}, {o.street}, {o.city}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={o.status_dispatched === 1}
                        onChange={(e) => handleOrderStatusUpdate(o.id, "status_dispatched", e.target.checked)}
                        className="w-5 h-5 accent-yellow-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={o.status_delivered === 1}
                        onChange={(e) => handleOrderStatusUpdate(o.id, "status_delivered", e.target.checked)}
                        className="w-5 h-5 accent-yellow-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={o.status_payment_received === 1}
                        onChange={(e) => handleOrderStatusUpdate(o.id, "status_payment_received", e.target.checked)}
                        className="w-5 h-5 accent-yellow-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-yellow-500" /> STORE SETTINGS
          </h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-lg">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Facebook URL</label>
              <input
                type="url"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Instagram URL</label>
              <input
                type="url"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">TikTok URL</label>
              <input
                type="url"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={settings.tiktok}
                onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp Number (e.g. 919876543210)</label>
              <input
                type="text"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
            </div>
            <button className="w-full py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all">
              SAVE SETTINGS
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
