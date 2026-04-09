import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { Product } from "../types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Checkout({ cart, removeFromCart }: { cart: Product[], removeFromCart: (id: string) => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    city: "",
    street: "",
    houseNumber: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // For simplicity, we'll just send the first product ID for now, 
      // or we could loop through the cart and send multiple orders.
      // The backend currently expects one order per product.
      for (const product of cart) {
        await addDoc(collection(db, "orders"), {
          ...formData,
          productId: product.id,
          productName: product.name,
          status_dispatched: 0,
          status_delivered: 0,
          status_payment_received: 0,
          createdAt: serverTimestamp(),
        });
      }
      setIsSuccess(true);
      // Clear cart would be handled by parent, but for this demo we'll just show success
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-20 h-20 text-yellow-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">Order Placed Successfully!</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Thank you for shopping with MAXFASHION. Your order has been received and is being processed.
        </p>
        <Link to="/" className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl font-bold mb-12 tracking-tighter">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Cart Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" /> YOUR BAG ({cart.length})
          </h2>
          {cart.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-12 text-center rounded-lg">
              <p className="text-gray-400 mb-6">Your bag is empty.</p>
              <Link to="/collection" className="text-yellow-500 font-bold hover:underline">
                BROWSE COLLECTION
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 bg-white/5 border border-white/10 p-4 rounded-lg group">
                  <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-sm" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-xs uppercase mb-2">{item.color}</p>
                    <p className="text-yellow-500 font-bold">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-xl font-bold">
                  <span>TOTAL</span>
                  <span className="text-yellow-500">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-8">SHIPPING DETAILS</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
              <input
                required
                type="text"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gmail Address</label>
              <input
                required
                type="email"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                placeholder="john@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
                <input
                  required
                  type="text"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Street</label>
                <input
                  required
                  type="text"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                  placeholder="Main Street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">House #</label>
                <input
                  required
                  type="text"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-yellow-500 outline-none transition-all"
                  placeholder="123"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                />
              </div>
            </div>
            <button
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 bg-yellow-500 text-black font-bold rounded-sm hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
