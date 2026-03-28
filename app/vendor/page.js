// app/vendor/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Zap,
  TrendingUp,
  LogOut,
  Store,
  CheckCircle,
  Sun,
  Moon,
  MapPin,
  Phone,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { LANGUAGES, useT, TRENDING_TIPS } from "../i18n";
import { CATEGORIES } from "../data";

// ── THEME HOOK ──
function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("vfl_dark");
    if (saved !== null) setDark(saved === "true");
  }, []);
  const toggle = () => {
    setDark((d) => {
      localStorage.setItem("vfl_dark", !d);
      return !d;
    });
  };
  return { dark, toggle };
}

// ── LANG HOOK ──
function useLang(defaultLang = "or") {
  const [lang, setLang] = useState(defaultLang);
  useEffect(() => {
    const saved = localStorage.getItem("vfl_lang");
    if (saved) setLang(saved);
  }, []);
  const change = (code) => {
    setLang(code);
    localStorage.setItem("vfl_lang", code);
  };
  return { lang, change };
}

// ── TOP BAR (shared across all screens) ──
function TopBar({ dark, toggleDark, lang, changeLang, showBack, onBack, t }) {
  const bg = dark ? "bg-black/90 border-[#222]" : "bg-white/90 border-gray-200";
  const toggleBg = dark
    ? "bg-[#111] border-[#222] text-gray-400 hover:text-white"
    : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900";

  return (
    <div
      className={`sticky top-0 z-50 backdrop-blur-xl border-b px-5 py-4 flex items-center justify-between ${bg}`}
    >
      <div className="w-10">
        {showBack && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full border transition-all ${toggleBg}`}
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>

      <span
        className={`text-base font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
      >
        Vocal<span className="text-[#FC8019]">ForLocal</span>
      </span>

      <div className="flex items-center gap-2">
        {/* Language */}
        <div
          className={`flex items-center gap-0.5 border rounded-xl p-0.5 ${toggleBg}`}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
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
  );
}

// ── LOGIN SCREEN ──
function LoginScreen({ dark, t, onLogin, onGoRegister }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const cardBg = dark ? "bg-[#111] border-[#222]" : "bg-white border-gray-200";
  const inputCls = dark
    ? "bg-[#1a1a1a] border-[#222] focus:border-[#FC8019]/50 text-white placeholder-gray-600"
    : "bg-gray-50 border-gray-200 focus:border-[#FC8019]/50 text-gray-900 placeholder-gray-400";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";

  const handleLogin = () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    // Demo: only 9999999999 works
    if (phone !== "9999999999") {
      setError(t.wrongPhone);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onLogin({
        phone,
        shopName: "Raju Samosa Corner",
        category: "Food & Snacks",
      });
    }, 1200);
  };

  return (
    <div
      className={`min-h-[calc(100vh-65px)] ${bg} flex flex-col items-center justify-center px-8 transition-colors duration-300`}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-start mb-10">
          <div className="bg-[#FC8019]/10 p-4 rounded-2xl mb-6 border border-[#FC8019]/20">
            <Store size={28} className="text-[#FC8019]" />
          </div>
          <h1
            className={`text-3xl font-black tracking-tight mb-1 ${textPrimary}`}
          >
            {t.merchantPortal}
          </h1>
          <p
            className={`text-sm font-bold tracking-widest uppercase ${textSecondary}`}
          >
            {t.merchantSub}
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div
            className={`flex items-center gap-3 border rounded-2xl px-5 py-4 ${inputCls}`}
          >
            <Phone size={16} className="text-[#FC8019] shrink-0" />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-transparent outline-none w-full text-sm font-bold placeholder-inherit"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs font-bold tracking-wide mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#FC8019] hover:bg-[#e06b12] disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all active:scale-95 mb-4"
        >
          {loading ? t.verifying : t.sendOTP}
        </button>

        <button
          onClick={onGoRegister}
          className="w-full text-center text-[#FC8019] text-sm font-black tracking-wide hover:underline"
        >
          {t.newVendor}
        </button>

        <p
          className={`text-xs font-bold text-center mt-6 tracking-wide ${textSecondary}`}
        >
          {t.demoHint}
        </p>
      </div>
    </div>
  );
}

// ── REGISTER SCREEN ──
function RegisterScreen({ dark, t, onGoLogin, onRegistered }) {
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("");
  const [locState, setLocState] = useState("idle"); // idle | fetching | done | error
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const inputCls = dark
    ? "bg-[#1a1a1a] border-[#222] focus:border-[#FC8019]/50 text-white placeholder-gray-600"
    : "bg-gray-50 border-gray-200 focus:border-[#FC8019]/50 text-gray-900 placeholder-gray-400";
  const selectCls = dark
    ? "bg-[#1a1a1a] border-[#222] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const labelCls = `text-xs font-black uppercase tracking-widest mb-2 block ${textSecondary}`;

  const fetchLocation = () => {
    setLocState("fetching");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocState("done");
      },
      () => setLocState("error"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleRegister = () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit number.");
      return;
    }
    if (!shopName.trim()) {
      setError("Please enter your shop name.");
      return;
    }
    if (!category) {
      setError("Please pick a category.");
      return;
    }
    if (!coords) {
      setError("Please capture your location first.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate OTP send then auto-verify
    setTimeout(() => {
      setLoading(false);
      onRegistered({ phone, shopName: shopName.trim(), category, coords });
    }, 800);
  };

  // Filter out "All" from categories for the dropdown
  const vendorCategories = CATEGORIES.filter((c) => c.label !== "All");

  return (
    <div
      className={`min-h-[calc(100vh-65px)] ${bg} flex flex-col items-center justify-center px-8 py-10 transition-colors duration-300`}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-start mb-8">
          <div className="bg-[#FC8019]/10 p-4 rounded-2xl mb-5 border border-[#FC8019]/20">
            <Store size={28} className="text-[#FC8019]" />
          </div>
          <h1
            className={`text-3xl font-black tracking-tight mb-1 ${textPrimary}`}
          >
            {t.registerTitle}
          </h1>
          <p className={`text-sm font-bold ${textSecondary}`}>
            {t.registerSub}
          </p>
        </div>

        <div className="flex flex-col gap-5 mb-6">
          {/* Phone */}
          <div>
            <label className={labelCls}>{t.phone}</label>
            <div
              className={`flex items-center gap-3 border rounded-2xl px-5 py-4 ${inputCls}`}
            >
              <Phone size={16} className="text-[#FC8019] shrink-0" />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="bg-transparent outline-none w-full text-sm font-bold placeholder-inherit"
              />
            </div>
          </div>

          {/* Shop Name */}
          <div>
            <label className={labelCls}>{t.shopName}</label>
            <input
              type="text"
              placeholder={t.shopNamePlaceholder}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-colors ${inputCls}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>{t.category}</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold outline-none appearance-none cursor-pointer ${selectCls}`}
              >
                <option value="">{t.pickCategory}</option>
                {vendorCategories.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}>{t.locationLabel}</label>
            <button
              onClick={fetchLocation}
              disabled={locState === "fetching" || locState === "done"}
              className={`w-full flex items-center justify-center gap-3 border rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest transition-all ${
                locState === "done"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : locState === "error"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : locState === "fetching"
                      ? "bg-[#FC8019]/10 border-[#FC8019]/20 text-[#FC8019] animate-pulse"
                      : dark
                        ? "bg-[#1a1a1a] border-[#222] text-gray-400 hover:text-white hover:border-[#FC8019]/30"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900"
              }`}
            >
              <MapPin size={16} />
              {locState === "fetching" && t.fetchingLocation}
              {locState === "done" && t.locationCaptured}
              {locState === "error" && t.locationFailed}
              {locState === "idle" && t.getLocation}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs font-bold tracking-wide mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#FC8019] hover:bg-[#e06b12] disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all active:scale-95 mb-4"
        >
          {loading ? t.verifying : t.registerBtn}
        </button>

        <button
          onClick={onGoLogin}
          className="w-full text-center text-[#FC8019] text-sm font-black tracking-wide hover:underline"
        >
          {t.alreadyRegistered}
        </button>
      </div>
    </div>
  );
}

// ── OTP SCREEN (auto-verify) ──
function OTPScreen({ dark, t, onVerified }) {
  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    // Auto verify after 3 seconds
    const timer = setTimeout(onVerified, 3000);
    return () => {
      clearTimeout(timer);
      clearInterval(dotInterval);
    };
  }, [onVerified]);

  return (
    <div
      className={`min-h-[calc(100vh-65px)] ${bg} flex flex-col items-center justify-center px-8 transition-colors duration-300`}
    >
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#FC8019]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FC8019] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Phone size={28} className="text-[#FC8019]" />
          </div>
        </div>
        <div>
          <h2
            className={`text-2xl font-black tracking-tight mb-2 ${textPrimary}`}
          >
            {t.otpTitle}
            {dots}
          </h2>
          <p className={`text-sm font-bold ${textSecondary}`}>{t.otpSub}</p>
          <p className={`text-xs font-bold mt-2 ${textSecondary}`}>
            {t.otpHint}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── WELCOME SCREEN ──
function WelcomeScreen({ dark, t, shopName, onContinue }) {
  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";

  return (
    <div
      className={`min-h-[calc(100vh-65px)] ${bg} flex flex-col items-center justify-center px-8 transition-colors duration-300`}
    >
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-full">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <div>
          <h2
            className={`text-3xl font-black tracking-tight mb-2 ${textPrimary}`}
          >
            {t.welcomeTitle}
          </h2>
          <p className={`text-base font-bold mb-1 ${textSecondary}`}>
            {t.welcomeSub}
          </p>
          <p className="text-[#FC8019] font-black text-lg mt-3">{shopName}</p>
        </div>
        <button
          onClick={onContinue}
          className="w-full bg-[#FC8019] hover:bg-[#e06b12] text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all active:scale-95 mt-2"
        >
          {t.goToDashboard}
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ dark, t, lang, vendor, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chalkboard, setChalkboard] = useState("");
  const [isBoosted, setIsBoosted] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [claimedTips, setClaimedTips] = useState([]);
  const [liveCoords, setLiveCoords] = useState(vendor.coords || null);
  const recognitionRef = useRef(null);

  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const cardBg = dark ? "bg-[#111] border-[#222]" : "bg-white border-gray-200";
  const headerBg = dark
    ? "bg-black/90 border-[#222]"
    : "bg-white/90 border-gray-200";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const inputCls = dark
    ? "bg-[#1a1a1a] border-[#222] focus:border-[#FC8019]/50 text-white placeholder-gray-600"
    : "bg-gray-50 border-gray-200 focus:border-[#FC8019]/50 text-gray-900 placeholder-gray-400";
  const rowBg = dark
    ? "bg-[#1a1a1a] border-[#222]"
    : "bg-gray-50 border-gray-200";

  // When going Open: re-fetch live location
  const handleToggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLiveCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {},
        { enableHighAccuracy: true, timeout: 8000 },
      );
    }
  };

  const handleBoost = () => {
    setBoosting(true);
    setTimeout(() => {
      setIsBoosted(true);
      setBoosting(false);
    }, 1500);
  };

  // ── FIXED MIC: properly starts/stops recognition ──
  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(t.voiceOnlyChrome);
      return;
    }

    // If already listening, stop
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
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChalkboard((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Get category-specific trending tips
  const categoryTips =
    TRENDING_TIPS[vendor.category] || TRENDING_TIPS["Food & Snacks"];
  const tips = categoryTips[lang] || categoryTips["en"];

  const handleClaimTip = (index) => {
    if (!claimedTips.includes(index))
      setClaimedTips((prev) => [...prev, index]);
  };

  return (
    <div className={`min-h-screen ${bg} pb-20 transition-colors duration-300`}>
      {/* Shop Header */}
      <div
        className={`sticky top-[65px] z-20 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between ${headerBg}`}
      >
        <div>
          <p className={`text-lg font-black tracking-tight ${textPrimary}`}>
            {t.myShop}
          </p>
          <p className="text-[#FC8019] text-xs font-black uppercase tracking-widest mt-0.5">
            {vendor.shopName}
          </p>
        </div>
        <button
          onClick={onLogout}
          className={`p-3 rounded-full border transition-all ${
            dark
              ? "bg-[#111] border-[#222] text-gray-500 hover:text-white"
              : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900"
          }`}
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
        {/* ── OPEN / CLOSED TOGGLE ── */}
        <div
          className={`border rounded-3xl p-7 flex items-center justify-between ${cardBg}`}
        >
          <div>
            <p
              className={`text-xs font-black uppercase tracking-widest mb-2 ${textSecondary}`}
            >
              {t.shopStatus}
            </p>
            <p
              className={`text-2xl font-black tracking-tight ${isOpen ? "text-green-400" : "text-gray-500"}`}
            >
              {isOpen ? t.liveNow : t.offline}
            </p>
            {isOpen && liveCoords && (
              <p className="text-[10px] font-bold text-gray-600 mt-1">
                {liveCoords.lat.toFixed(4)}, {liveCoords.lng.toFixed(4)}
              </p>
            )}
          </div>
          <button
            onClick={handleToggleOpen}
            className={`w-16 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${isOpen ? "bg-green-500" : dark ? "bg-[#222]" : "bg-gray-200"}`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isOpen ? "translate-x-8" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* ── DIGITAL CHALKBOARD ── */}
        <div className={`border rounded-3xl p-7 ${cardBg}`}>
          <p
            className={`text-xs font-black uppercase tracking-widest mb-5 ${textSecondary}`}
          >
            {t.digitalChalkboard}
          </p>
          <div className="relative">
            <textarea
              value={chalkboard}
              onChange={(e) => setChalkboard(e.target.value)}
              placeholder={t.chalkboardPlaceholder}
              rows={4}
              className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold outline-none resize-none transition-colors pr-14 ${inputCls}`}
            />
            <button
              onClick={handleVoice}
              className={`absolute right-4 bottom-4 p-2 rounded-xl transition-all ${
                isListening
                  ? "text-[#FC8019] animate-pulse bg-[#FC8019]/10 border border-[#FC8019]/30"
                  : dark
                    ? "text-gray-500 hover:text-white hover:bg-[#222]"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          {chalkboard && (
            <p
              className={`text-xs font-bold mt-3 tracking-wide ${textSecondary}`}
            >
              {chalkboard.length} {t.chalkboardHint}
            </p>
          )}
        </div>

        {/* ── TRENDING TIPS ── */}
        <div className={`border rounded-3xl p-7 ${cardBg}`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-[#FC8019]" />
            <p
              className={`text-xs font-black uppercase tracking-widest ${textSecondary}`}
            >
              {t.trendingTitle}
            </p>
          </div>
          <p className={`text-xs font-bold mb-5 ${textSecondary}`}>
            {t.trendingSubtitle}
          </p>
          <div className="flex flex-col gap-3">
            {tips.map((tip, index) => {
              const claimed = claimedTips.includes(index);
              return (
                <div
                  key={index}
                  className={`border rounded-2xl px-5 py-4 flex flex-col gap-3 ${rowBg}`}
                >
                  <p
                    className={`text-sm font-bold leading-relaxed ${textPrimary}`}
                  >
                    {tip}
                  </p>
                  <button
                    onClick={() => handleClaimTip(index)}
                    disabled={claimed}
                    className={`self-start flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                      claimed
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-[#FC8019]/10 text-[#FC8019] border border-[#FC8019]/20 hover:bg-[#FC8019] hover:text-white"
                    }`}
                  >
                    {claimed ? (
                      <>
                        <CheckCircle size={12} /> {t.selling}
                      </>
                    ) : (
                      t.iSellThis
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MICRO BOOST ── */}
        <div
          className={`border rounded-3xl p-7 transition-colors ${
            isBoosted
              ? dark
                ? "bg-[#FC8019]/5 border-[#FC8019]/30"
                : "bg-orange-50 border-[#FC8019]/30"
              : cardBg
          }`}
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap
              size={16}
              className={isBoosted ? "text-[#FC8019]" : "text-gray-500"}
            />
            <p
              className={`text-xs font-black uppercase tracking-widest ${textSecondary}`}
            >
              {t.microBoost}
            </p>
          </div>
          {isBoosted ? (
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#FC8019]" />
              <p className="text-[#FC8019] font-black tracking-wide">
                {t.boostActive}
              </p>
            </div>
          ) : (
            <>
              <p
                className={`text-sm font-bold mb-5 leading-relaxed ${textSecondary}`}
              >
                {t.boostDesc}
              </p>
              <button
                onClick={handleBoost}
                disabled={boosting}
                className="w-full bg-[#FC8019] hover:bg-[#e06b12] disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all active:scale-95"
              >
                {boosting ? t.boosting : t.boostBtn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ROOT PAGE ──
export default function VendorPage() {
  const router = useRouter();
  const { dark, toggle: toggleDark } = useTheme();
  // Vendor page defaults to Odia
  const { lang, change: changeLang } = useLang("or");
  const t = useT(lang);

  // screen: "login" | "register" | "otp" | "welcome" | "dashboard"
  const [screen, setScreen] = useState("login");
  const [vendor, setVendor] = useState(null);

  const handleLogin = (vendorData) => {
    setVendor(vendorData);
    setScreen("otp");
  };

  const handleRegistered = (vendorData) => {
    setVendor(vendorData);
    setScreen("otp");
  };

  const handleOTPVerified = () => {
    setScreen("welcome");
  };

  const handleContinueToDashboard = () => {
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setVendor(null);
    setScreen("login");
  };

  const showBack = screen === "login" || screen === "register";

  return (
    <div>
      <TopBar
        dark={dark}
        toggleDark={toggleDark}
        lang={lang}
        changeLang={changeLang}
        showBack={showBack}
        onBack={() =>
          screen === "register" ? setScreen("login") : router.push("/")
        }
        t={t}
      />

      {screen === "login" && (
        <LoginScreen
          dark={dark}
          t={t}
          onLogin={handleLogin}
          onGoRegister={() => setScreen("register")}
        />
      )}
      {screen === "register" && (
        <RegisterScreen
          dark={dark}
          t={t}
          onGoLogin={() => setScreen("login")}
          onRegistered={handleRegistered}
        />
      )}
      {screen === "otp" && (
        <OTPScreen dark={dark} t={t} onVerified={handleOTPVerified} />
      )}
      {screen === "welcome" && vendor && (
        <WelcomeScreen
          dark={dark}
          t={t}
          shopName={vendor.shopName}
          onContinue={handleContinueToDashboard}
        />
      )}
      {screen === "dashboard" && vendor && (
        <Dashboard
          dark={dark}
          t={t}
          lang={lang}
          vendor={vendor}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
