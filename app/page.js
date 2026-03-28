// app/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, Sun, Moon } from "lucide-react";
import { LANGUAGES, useT } from "./i18n";

export default function LandingPage() {
  const router = useRouter();

  // Dark mode: default true (dark)
  const [dark, setDark] = useState(true);

  // Language: default English on landing page
  const [lang, setLang] = useState("en");
  const t = useT(lang);

  // Persist dark mode + lang in localStorage so other pages can read it
  useEffect(() => {
    const savedDark = localStorage.getItem("vfl_dark");
    const savedLang = localStorage.getItem("vfl_lang");
    if (savedDark !== null) setDark(savedDark === "true");
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("vfl_dark", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("vfl_lang", lang);
  }, [lang]);

  const bg = dark ? "bg-black" : "bg-[#F5F5F5]";
  const cardBg = dark ? "bg-[#111] border-[#222]" : "bg-white border-gray-200";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-500" : "text-gray-400";
  const iconBg = dark
    ? "bg-[#FC8019]/10 border-[#FC8019]/20"
    : "bg-[#FC8019]/10 border-[#FC8019]/30";
  const toggleBg = dark
    ? "bg-[#111] border-[#222] text-gray-400 hover:text-white"
    : "bg-white border-gray-200 text-gray-500 hover:text-gray-900";

  return (
    <div
      className={`min-h-screen ${bg} transition-colors duration-300 flex flex-col`}
    >
      {/* ── TOP BAR: Dark toggle + Language ── */}
      <div className="flex items-center justify-end gap-3 px-6 pt-6">
        {/* Language Switcher */}
        <div
          className={`flex items-center gap-1 border rounded-2xl p-1 ${toggleBg}`}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
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

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`p-3 rounded-full border transition-all ${toggleBg}`}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* ── HERO ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <h1
          className={`text-5xl font-black tracking-tighter mb-2 ${textPrimary}`}
        >
          VocalFor<span className="text-[#FC8019]">Local</span>
        </h1>
        <p
          className={`font-bold tracking-widest uppercase text-sm mb-12 ${textSecondary}`}
        >
          {t.tagline}
        </p>

        {/* ── ROUTE BUTTONS ── */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          {/* Shopper */}
          <button
            onClick={() => router.push("/shopper")}
            className={`flex-1 border hover:border-[#FC8019]/50 p-10 rounded-[2.5rem] flex flex-col items-center gap-5 transition-all group shadow-2xl ${cardBg} ${
              dark ? "hover:bg-[#151515]" : "hover:bg-orange-50"
            }`}
          >
            <div
              className={`p-5 rounded-full group-hover:scale-110 transition-transform duration-300 border ${iconBg}`}
            >
              <ShoppingBag size={36} className="text-[#FC8019]" />
            </div>
            <span className={`font-black text-xl tracking-wide ${textPrimary}`}>
              {t.iAmShopper}
            </span>
          </button>

          {/* Vendor */}
          <button
            onClick={() => router.push("/vendor")}
            className={`flex-1 border hover:border-[#FC8019]/50 p-10 rounded-[2.5rem] flex flex-col items-center gap-5 transition-all group shadow-2xl ${cardBg} ${
              dark ? "hover:bg-[#151515]" : "hover:bg-orange-50"
            }`}
          >
            <div
              className={`p-5 rounded-full group-hover:scale-110 transition-transform duration-300 border ${iconBg}`}
            >
              <Store size={36} className="text-[#FC8019]" />
            </div>
            <span className={`font-black text-xl tracking-wide ${textPrimary}`}>
              {t.iAmVendor}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
