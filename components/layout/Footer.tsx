import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

const catalogLinks = [
  { href: "/catalog/excavators", label: "Экскаваторы" },
  { href: "/catalog/cranes", label: "Автокраны" },
  { href: "/catalog/loaders", label: "Погрузчики" },
  { href: "/catalog/dump-trucks", label: "Самосвалы" },
];

const clientLinks = [
  { href: "/catalog", label: "Цены" },
  { href: "/terms", label: "Договор аренды" },
  { href: "/careers", label: "Вакансии" },
  { href: "/contacts", label: "Контакты" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-surface border-t border-white/5 pt-16 pb-32 md:pb-16">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display font-bold text-2xl uppercase mb-4 block">
              Iron Rent
            </Link>
            <p className="text-text-gray text-sm">
              Профессиональная аренда спецтехники в Санкт-Петербурге и
              Ленинградской области.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-sm">Каталог</h4>
            <ul className="space-y-2 text-sm text-text-gray">
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clients */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-sm">Клиентам</h4>
            <ul className="space-y-2 text-sm text-text-gray">
              {clientLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-sm">Контакты</h4>
            <a
              href="tel:+78129990000"
              className="text-xl font-display font-bold mb-2 block hover:text-accent transition-colors"
            >
              +7 (812) 999-00-00
            </a>
            <a
              href="mailto:spb@iron-rent.ru"
              className="text-sm text-text-gray hover:text-accent transition-colors block"
            >
              spb@iron-rent.ru
            </a>
            <address className="text-sm text-text-gray mt-2 not-italic">
              ул. Строителей 15, офис 204
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 text-center border-t border-white/5 pt-8 text-xs text-gray-600">
          © {currentYear} IRON RENT. Все права защищены.
        </div>
      </footer>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-dark/95 backdrop-blur border-t border-white/10 p-4 z-50 flex gap-3">
        <a
          href="tel:+78129990000"
          className="flex-1 bg-surface border border-white/20 text-white font-bold py-3 rounded flex items-center justify-center gap-2"
        >
          <Phone size={18} />
          Позвонить
        </a>
        <a
          href="https://wa.me/78129990000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white font-bold py-3 rounded flex items-center justify-center gap-2 shadow-glow"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </>
  );
}
