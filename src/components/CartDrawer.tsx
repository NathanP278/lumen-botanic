"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalCount,
    clearCart,
  } = useCart();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const freeShippingThreshold = 65;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08130E] border-l border-botanic-forest/80 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-botanic-forest/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-botanic-gold" />
              <h2 className="font-serif text-lg text-botanic-cream font-medium">
                Your Botanical Ritual ({totalCount})
              </h2>
            </div>
            <button
              id="cart-drawer-close"
              onClick={closeCart}
              aria-label="Close cart drawer"
              className="p-2 text-botanic-sand hover:text-botanic-gold rounded-full hover:bg-botanic-forest/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress Bar */}
          <div className="px-6 py-3.5 bg-botanic-forest/30 border-b border-botanic-forest/40">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-botanic-sage">
                {totalPrice >= freeShippingThreshold ? (
                  <span className="text-botanic-gold font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Free Cold-Chain Shipping Unlocked
                  </span>
                ) : (
                  <span>
                    Add ${(freeShippingThreshold - totalPrice).toFixed(2)} more for Free Cold-Chain Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-botanic-gold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-botanic-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-botanic-gold transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-botanic-forest/40 flex items-center justify-center text-botanic-sage">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <p className="font-serif text-lg text-botanic-cream">Your cold-press basket is empty</p>
                <p className="text-xs text-botanic-sage max-w-xs">
                  Discover our raw botanical elixirs or build a bespoke 6-pack box.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-6 py-2.5 rounded-full bg-botanic-gold text-botanic-dark text-xs uppercase font-bold tracking-widest hover:bg-botanic-goldLight transition-colors"
                >
                  Explore Elixirs
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-botanic-forest/30 border border-botanic-forest/60"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-botanic-dark">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-serif text-botanic-cream truncate">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-botanic-sage hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.isPack && item.packItems && (
                        <div className="text-[10px] text-botanic-sage mt-1 line-clamp-2">
                          {item.packItems.join(" • ")}
                        </div>
                      )}
                      <p className="text-xs font-semibold text-botanic-gold mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-botanic-forest/40">
                      <div className="flex items-center border border-botanic-forest rounded-lg overflow-hidden bg-botanic-dark/60">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1 hover:bg-botanic-forest/50 text-botanic-sand"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono text-botanic-cream">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1 hover:bg-botanic-forest/50 text-botanic-sand"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-serif text-botanic-cream font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-botanic-forest/80 bg-botanic-emerald/40 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-botanic-sage">
                  <span>Subtotal</span>
                  <span className="text-botanic-cream font-mono">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-botanic-sage">
                  <span>Thermal Cold-Chain Pack</span>
                  <span className="text-botanic-gold font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-serif text-botanic-cream pt-2 border-t border-botanic-forest/50 font-bold">
                  <span>Estimated Total</span>
                  <span className="text-botanic-gold font-mono text-base">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert("Order Placed Successfully! Your cold-chain botanicals are scheduled for harvest.");
                  clearCart();
                  closeCart();
                }}
                className="w-full py-4 rounded-full bg-botanic-gold hover:bg-botanic-goldLight text-botanic-dark text-xs uppercase font-bold tracking-[0.2em] shadow-xl hover:shadow-botanic-gold/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Checkout Ritual</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-botanic-sage tracking-wider">
                100% Raw • 36°F Cold Chain Sealed • Zero Carbon Delivery
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
