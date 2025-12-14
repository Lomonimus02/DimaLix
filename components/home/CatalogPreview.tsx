'use client'

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Тип для сериализованной машины (Decimal преобразован в number)
interface SerializedMachine {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  shiftPrice: number;
  hourlyPrice: number | null;
  specs: unknown;
  description: string | null;
  imageUrl: string | null;
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface SerializedCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: {
    machines: number;
  };
}

interface CatalogPreviewProps {
  machines: SerializedMachine[];
  categories: SerializedCategory[];
  totalCount: number;
}

function StatusBadge({ isAvailable }: { isAvailable: boolean }) {
  if (isAvailable) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded uppercase border border-green-400/20">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full status-live"></span>
        Свободен
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded uppercase border border-orange-400/20">
      Занят
    </span>
  );
}

function EquipmentCard({ machine }: { machine: SerializedMachine }) {
  return (
    <Link
      href={`/catalog/${machine.slug}`}
      className="product-card group bg-surface border border-white/5 rounded-xl p-6 relative overflow-hidden block"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <StatusBadge isAvailable={machine.isAvailable} />
      </div>

      {/* Image */}
      <div className="h-48 flex items-center justify-center relative mb-6">
        <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img
          src={machine.imageUrl || "https://pngimg.com/d/excavator_PNG59.png"}
          alt={machine.title}
          className="tech-img w-full h-full object-contain relative z-10"
        />
      </div>

      {/* Content */}
      <h3 className="font-display text-2xl font-bold uppercase mb-1">
        {machine.title}
      </h3>
      <p className="text-text-gray text-sm mb-4">{machine.category.name}</p>

      {/* Price & CTA */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-text-gray uppercase block">
            Смена (7+1)
          </span>
          <span className="text-2xl font-display font-bold text-accent">
            {Number(machine.shiftPrice).toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <span className="bg-white text-dark group-hover:bg-accent group-hover:scale-105 transition-all w-10 h-10 rounded-full flex items-center justify-center">
          <ArrowUpRight size={20} />
        </span>
      </div>
    </Link>
  );
}

export function CatalogPreview({ machines, categories, totalCount }: CatalogPreviewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Фильтруем машины по выбранной категории
  const filteredMachines = activeCategory
    ? machines.filter((m) => m.category.slug === activeCategory)
    : machines;

  return (
    <section id="catalog" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-2">
              Наш автопарк
            </h2>
            <p className="text-text-gray">
              Вся техника в собственности. Регулярное ТО.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={
                activeCategory === null
                  ? "px-6 py-2 bg-white text-dark font-bold uppercase rounded hover:bg-gray-200 transition"
                  : "px-6 py-2 bg-surface border border-white/10 text-white font-bold uppercase rounded hover:border-accent hover:text-accent transition"
              }
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={
                  activeCategory === category.slug
                    ? "px-6 py-2 bg-white text-dark font-bold uppercase rounded hover:bg-gray-200 transition"
                    : "px-6 py-2 bg-surface border border-white/10 text-white font-bold uppercase rounded hover:border-accent hover:text-accent transition"
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMachines.map((machine) => (
            <EquipmentCard key={machine.id} machine={machine} />
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12 text-text-gray">
            В этой категории пока нет техники
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="text-white border-b border-accent pb-1 hover:text-accent transition inline-block"
          >
            Показать весь каталог ({totalCount} машин)
          </Link>
        </div>
      </div>
    </section>
  );
}
