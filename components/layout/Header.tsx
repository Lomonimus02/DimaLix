"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { CallbackModal } from "./CallbackModal";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  const handleCallbackClick = () => {
    setIsCallbackModalOpen(true);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent flex items-center justify-center font-display font-bold text-dark text-xl skew-x-[-10deg]">
            IR
          </div>
          <div className="leading-tight">
            <span className="block font-display text-xl font-bold tracking-wider uppercase">
              Iron Rent
            </span>
            <span className="block text-xs text-text-gray">
              Спецтехника СПБ
            </span>
          </div>
        </Link>

        {/* Nav (Desktop) */}
        <nav className="hidden md:flex gap-8 font-medium text-sm uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contacts (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <a
              href="tel:+78129990000"
              className="text-accent font-bold font-display text-lg tracking-wide hover:text-accent-hover transition-colors"
            >
              +7 (812) 999-00-00
            </a>
            <div className="text-xs text-green-400 flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full status-live"></span>
              Работаем 24/7
            </div>
          </div>
          <button
            onClick={handleCallbackClick}
            className="bg-transparent border border-white/30 hover:border-accent hover:text-accent px-6 py-2 rounded font-bold uppercase text-xs transition-all"
          >
            Заказать звонок
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md border-t border-white/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium uppercase tracking-wide hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10" />
            <a
              href="tel:+78129990000"
              className="flex items-center gap-2 text-accent font-bold font-display text-lg"
            >
              <Phone size={18} />
              +7 (812) 999-00-00
            </a>
            <button
              onClick={() => {
                handleCallbackClick();
                setIsMenuOpen(false);
              }}
              className="bg-accent text-dark font-bold uppercase py-3 rounded text-sm"
            >
              Заказать звонок
            </button>
          </nav>
        </div>
      )}

      {/* Callback Modal */}
      <CallbackModal 
        isOpen={isCallbackModalOpen} 
        onClose={() => setIsCallbackModalOpen(false)} 
      />
    </header>
  );
}
