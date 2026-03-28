// app/shopper/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  Star,
  Navigation,
  Mic,
  MicOff,
  Sun,
  Moon,
  ChevronDown,
  Send,
  Clock,
} from "lucide-react";
import { VENDORS, CATEGORIES } from "../data";
import { LANGUAGES, useT } from "../i18n";

// ── HAVERSINE ──
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── TIME AGO ──
function timeAgo(dateString) {
  if (!dateString) return "";
  const diff = Math.floor((Date.now() - new Date(dateString)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── CATEGORY ICONS (Lucide-safe, no emojis) ──
import {
  UtensilsCrossed,
  Shirt,
  ShoppingBasket,
  Cpu,
  Scissors,
  Gem,
  BookOpen,
  LayoutGrid,
} from "lucide-react";

const CATEGORY_ICONS = {
  All: LayoutGrid,
  "Food & Snacks": UtensilsCrossed,
  "Clothing & Fashion": Shirt,
  "Groceries & Kirana": ShoppingBasket,
  "Electronics & Repair": Cpu,
  "Services (Tailoring)": Scissors,
  "Jewellery & Makeup": Gem,
  Stationery: BookOpen,
};

// ── VENDOR MODAL ──
function VendorModal({ vendor, distance, dark, t, lang, onClose }) {
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([
    {
      author: "Aditya S.",
      text: "Best samosas in the area!",
      time: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      author: "Priya M.",
      text: "Very fresh, affordable pricing.",
      time: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const bg = dark ? "bg-[#111]" : "bg-white";
  const overlayBg = dark ? "bg-black/80" : "bg-black/50";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const borderCls = dark ? "border-[#222]" : "border-gray-200";
  const inputCls = dark
    ? "bg-[#1a1a1a] border-[#222] text-white placeholder-gray-600 focus:border-[#FC8019]/50"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#FC8019]/50";
  const reviewBg = dark
    ? "bg-[#1a1a1a] border-[#222]"
    : "bg-gray-50 border-gray-200";

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    setReviews((prev) => [
      {
        author: "You",
        text: reviewText.trim(),
        time: new Date().toISOString(),
      },
      ...prev,
    ]);
    setReviewText("");
  };

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center ${overlayBg} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-t-[2.5rem] ${bg} max-h-[90vh] overflow-y-auto scrollbar-hide pb-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div
            className={`w-10 h-1 rounded-full ${dark ? "bg-[#333]" : "bg-gray-300"}`}
          />
        </div>

        <div className="px-7 pt-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2
                className={`text-2xl font-black tracking-tight mb-1 ${textPrimary}`}
              >
                {vendor.name}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    vendor.isOpen
                      ? "text-green-400 bg-green-500/10 border-green-500/20"
                      : "text-red-400 bg-red-500/10 border-red-500/20"
                  }`}
                >
                  {vendor.isOpen ? t.openNow : t.closed}
                </span>
                {distance !== null && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${textSecondary}`}
                  >
                    <MapPin size={11} />{" "}
                    {distance < 1
                      ? `${Math.round(distance * 1000)}m`
                      : `${distance.toFixed(1)}km`}{" "}
                    {t.away}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${dark ? "hover:bg-[#222]" : "hover:bg-gray-100"}`}
            >
              <X size={20} className={textSecondary} />
            </button>
          </div>

          {/* Signature Item */}
          {vendor.signatureItem && (
            <div
              className={`border rounded-2xl px-5 py-4 mb-5 flex items-center justify-between ${reviewBg}`}
            >
              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mb-1 ${textSecondary}`}
                >
                  {t.signatureItem}
                </p>
                <p className={`text-base font-black ${textPrimary}`}>
                  {vendor.signatureItem}
                </p>
              </div>
              <span className="text-[#FC8019] font-black text-lg">
                ₹{vendor.signaturePrice}
              </span>
            </div>
          )}

          {/* Chalkboard */}
          {vendor.chalkboard && (
            <div className={`border rounded-2xl px-5 py-4 mb-5 ${reviewBg}`}>
              <p
                className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textSecondary}`}
              >
                Today's Update
              </p>
              <p className={`text-sm font-bold leading-relaxed ${textPrimary}`}>
                {vendor.chalkboard}
              </p>
              {vendor.chalkboardUpdatedAt && (
                <p className={`text-[10px] font-bold mt-2 ${textSecondary}`}>
                  <Clock size={9} className="inline mr-1" />
                  {timeAgo(vendor.chalkboardUpdatedAt)}
                </p>
              )}
            </div>
          )}

          {/* Direct Me */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FC8019] hover:bg-[#e06b12] text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 mb-7"
          >
            <Navigation size={16} /> {t.directMe}
          </a>

          {/* Reviews */}
          <div className={`border-t pt-6 ${borderCls}`}>
            <p
              className={`text-xs font-black uppercase tracking-widest mb-4 ${textSecondary}`}
            >
              {t.reviews}
            </p>
            <div className="flex flex-col gap-3 mb-5">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className={`border rounded-2xl px-4 py-3 ${reviewBg}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-black ${textPrimary}`}>
                      {r.author}
                    </span>
                    <span className={`text-[10px] font-bold ${textSecondary}`}>
                      {timeAgo(r.time)}
                    </span>
                  </div>
                  <p className={`text-sm font-bold ${textSecondary}`}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Write Review */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.writeReview}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitReview()}
                className={`w-full border rounded-2xl px-5 py-4 pr-14 text-sm font-bold outline-none transition-colors ${inputCls}`}
              />
              <button
                onClick={handleSubmitReview}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FC8019] hover:scale-110 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VENDOR CARD ──
function VendorCard({ vendor, distance, dark, t, onClick }) {
  const cardBg = dark
    ? "bg-[#111] border-[#222] hover:border-[#FC8019]/30"
    : "bg-white border-gray-200 hover:border-[#FC8019]/40";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const chalkBg = dark
    ? "bg-[#1a1a1a] border-[#1e1e1e]"
    : "bg-gray-50 border-gray-100";

  return (
    <div
      onClick={onClick}
      className={`border rounded-[2rem] p-6 cursor-pointer transition-all active:scale-[0.98] ${cardBg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-3">
          <h3
            className={`text-lg font-black tracking-tight mb-1 ${textPrimary}`}
          >
            {vendor.name}
          </h3>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              dark
                ? "text-gray-500 border-[#222]"
                : "text-gray-400 border-gray-200"
            }`}
          >
            {vendor.category}
          </span>
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shrink-0 ${
            vendor.isOpen
              ? "text-green-400 bg-green-500/10 border-green-500/20"
              : "text-red-400 bg-red-500/10 border-red-500/20"
          }`}
        >
          {vendor.isOpen ? t.openNow : t.closed}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        {distance !== null && (
          <span
            className={`text-xs font-bold flex items-center gap-1 ${textSecondary}`}
          >
            <MapPin size={11} />
            {distance < 1
              ? `${Math.round(distance * 1000)}m`
              : `${distance.toFixed(1)}km`}{" "}
            {t.away}
          </span>
        )}
        {vendor.signatureItem && (
          <span className="text-[#FC8019] font-black text-sm">
            {vendor.signatureItem} · ₹{vendor.signaturePrice}
          </span>
        )}
      </div>

      {vendor.chalkboard && (
        <div className={`border rounded-xl px-4 py-3 ${chalkBg}`}>
          <p className={`text-xs font-bold leading-relaxed ${textSecondary}`}>
            "{vendor.chalkboard}"
          </p>
          {vendor.chalkboardUpdatedAt && (
            <p
              className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${
                dark ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <Clock size={9} /> {timeAgo(vendor.chalkboardUpdatedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ──
export default function ShopperPage() {
  const router = useRouter();

  // Theme + lang from localStorage (set by landing page)
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedDark = localStorage.getItem("vfl_dark");
    const savedLang = localStorage.getItem("vfl_lang");
    if (savedDark !== null) setDark(savedDark === "true");
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      localStorage.setItem("vfl_dark", !d);
      return !d;
    });
  };
  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem("vfl_lang", code);
  };

  const t = useT(lang);

  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  // Filter vendors — remove "Electronics & Repair" store-type and electrician
  const filtered = VENDORS.filter((v) => {
    // Remove purely service-shop vendors that aren't street vendors
    if (v.category === "Electronics & Repair" && v.isShop) return false;
    if (v.category === "Services (Tailoring)" && v.isShop) return false;
    return true;
  })
    .filter((v) =>
      activeCategory === "All" ? true : v.category === activeCategory,
    )
    .filter((v) =>
      search.trim() === ""
        ? true
        : v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.category.toLowerCase().includes(search.toLowerCase()) ||
          (v.signatureItem || "").toLowerCase().includes(search.toLowerCase()),
    )
    .map((v) => ({
      ...v,
      distance:
        userLocation && v.lat && v.lng
          ? getDistanceFromLatLonInKm(
              userLocation.lat,
              userLocation.lng,
              v.lat,
              v.lng,
            )
          : null,
    }))
    .sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      if (a.distance !== null && b.distance !== null)
        return a.distance - b.distance;
      return 0;
    });

  // Voice search
  const handleVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(t.voiceOnlyChrome);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SR();
    recognition.lang =
      lang === "hi" ? "hi-IN" : lang === "or" ? "or-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onresult = (e) => setSearch(e.results[0][0].transcript);
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Colours
  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const headerBg = dark
    ? "bg-black/90 border-[#222]"
    : "bg-white/90 border-gray-200";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const inputCls = dark
    ? "bg-[#111] border-[#222] text-white placeholder-gray-600 focus:border-[#FC8019]/50"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#FC8019]/50";
  const chipBase = dark
    ? "border-[#222] text-gray-500 hover:border-[#FC8019]/30 hover:text-white"
    : "border-gray-200 text-gray-400 hover:border-[#FC8019]/30 hover:text-gray-900";
  const chipActive = "border-[#FC8019] text-[#FC8019] bg-[#FC8019]/10";
  const toggleBg = dark
    ? "bg-[#111] border-[#222] text-gray-400 hover:text-white"
    : "bg-white border-gray-200 text-gray-500 hover:text-gray-900";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* ── STICKY HEADER ── */}
      <div
        className={`sticky top-0 z-30 backdrop-blur-xl border-b ${headerBg}`}
      >
        <div className="max-w-lg mx-auto px-5 py-4">
          {/* Row 1: Back + Title + Lang + Dark */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className={`p-2 rounded-full border transition-all ${toggleBg}`}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1
                  className={`text-lg font-black tracking-tight ${textPrimary}`}
                >
                  Vocal<span className="text-[#FC8019]">ForLocal</span>
                </h1>
                {userLocation ? (
                  <p
                    className={`text-[10px] font-bold flex items-center gap-1 ${textSecondary}`}
                  >
                    <MapPin size={9} /> {t.findVendors}
                  </p>
                ) : (
                  <p className={`text-[10px] font-bold ${textSecondary}`}>
                    {t.locating}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language */}
              <div
                className={`flex items-center gap-0.5 border rounded-xl p-0.5 ${toggleBg}`}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      lang === l.code
                        ? "bg-[#FC8019] text-white"
                        : dark
                          ? "text-gray-500 hover:text-white"
                          : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {/* Dark toggle */}
              <button
                onClick={toggleDark}
                className={`p-2 rounded-full border transition-all ${toggleBg}`}
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>

          {/* Row 2: Search */}
          <div
            className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-colors ${inputCls}`}
          >
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm font-bold placeholder-inherit"
            />
            {search ? (
              <button onClick={() => setSearch("")}>
                <X size={16} className="text-gray-500 hover:text-white" />
              </button>
            ) : (
              <button onClick={handleVoiceSearch}>
                {isListening ? (
                  <MicOff size={16} className="text-[#FC8019] animate-pulse" />
                ) : (
                  <Mic
                    size={16}
                    className="text-gray-500 hover:text-[#FC8019] transition-colors"
                  />
                )}
              </button>
            )}
          </div>

          {/* Row 3: Category chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.label] || LayoutGrid;
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex items-center gap-1.5 shrink-0 border rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                    isActive ? chipActive : chipBase
                  }`}
                >
                  <Icon size={12} />
                  {cat.label === "All"
                    ? t.allCategories
                    : cat.label.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── VENDOR LIST ── */}
      <div className="max-w-lg mx-auto px-5 py-6 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <MapPin size={32} className="text-gray-700" />
            <p className={`text-sm font-bold ${textSecondary}`}>
              {t.noVendors}
            </p>
          </div>
        ) : (
          filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              distance={vendor.distance}
              dark={dark}
              t={t}
              onClick={() => setSelectedVendor(vendor)}
            />
          ))
        )}
      </div>

      {/* ── VENDOR MODAL ── */}
      {selectedVendor && (
        <VendorModal
          vendor={selectedVendor}
          distance={selectedVendor.distance}
          dark={dark}
          t={t}
          lang={lang}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  );
}
