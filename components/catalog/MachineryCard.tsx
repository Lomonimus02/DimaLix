import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MachineWithCategory } from '@/lib/data'

// Парсинг specs из JSON
function parseSpecs(specs: unknown): Record<string, string> {
  if (typeof specs === 'string') {
    try {
      return JSON.parse(specs)
    } catch {
      return {}
    }
  }
  if (typeof specs === 'object' && specs !== null) {
    return specs as Record<string, string>
  }
  return {}
}

// Форматирование цены
function formatPrice(price: number | string | { toString(): string }): string {
  const numPrice = typeof price === 'number' ? price : parseFloat(price.toString())
  return numPrice.toLocaleString('ru-RU')
}

// Бейдж доступности
function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  if (isAvailable) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded uppercase border border-green-400/20">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
        Свободен
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded uppercase border border-orange-400/20">
      Занят
    </span>
  )
}

interface MachineryCardProps {
  machine: MachineWithCategory
}

export function MachineryCard({ machine }: MachineryCardProps) {
  const specs = parseSpecs(machine.specs)
  
  // Получаем первые 2 характеристики для превью
  const specEntries = Object.entries(specs).slice(0, 2)
  
  // Метки для характеристик
  const specLabels: Record<string, string> = {
    weight: 'Масса',
    bucketVolume: 'Ковш',
    maxDepth: 'Глубина',
    maxReach: 'Вылет',
    liftingCapacity: 'Грузоподъёмность',
    boomLength: 'Стрела',
    maxHeight: 'Высота',
    bucketCapacity: 'Ковш',
    operatingWeight: 'Масса',
    maxLiftHeight: 'Подъём',
    maxLoadCapacity: 'Грузоподъёмность',
    bladeCapacity: 'Отвал',
    bladeWidth: 'Ширина отвала',
  }

  return (
    <Link
      href={`/catalog/${machine.slug}`}
      className="product-card group bg-surface border border-white/5 rounded-xl p-6 relative overflow-hidden block hover:border-accent/30 transition-all duration-300"
    >
      {/* Бейдж доступности */}
      <div className="absolute top-4 right-4 z-20">
        <AvailabilityBadge isAvailable={machine.isAvailable} />
      </div>

      {/* Изображение */}
      <div className="h-48 flex items-center justify-center relative mb-6">
        <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {machine.imageUrl ? (
          <img
            src={machine.imageUrl}
            alt={machine.title}
            className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg">
            <span className="text-text-gray text-sm">Нет фото</span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="space-y-2">
        {/* Категория */}
        <span className="text-xs text-accent uppercase tracking-wider">
          {machine.category.name}
        </span>
        
        {/* Название */}
        <h3 className="font-display text-xl md:text-2xl font-bold uppercase leading-tight">
          {machine.title}
        </h3>

        {/* Характеристики */}
        {specEntries.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {specEntries.map(([key, value]) => (
              <span
                key={key}
                className="text-xs text-text-gray bg-white/5 px-2 py-1 rounded"
              >
                {specLabels[key] || key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Цена и кнопка */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div>
          <span className="text-xs text-text-gray uppercase block">
            Смена (7+1)
          </span>
          <span className="text-2xl font-display font-bold text-accent">
            {formatPrice(machine.shiftPrice)} ₽
          </span>
        </div>
        <span className="bg-white text-dark group-hover:bg-accent group-hover:scale-105 transition-all w-10 h-10 rounded-full flex items-center justify-center">
          <ArrowUpRight size={20} />
        </span>
      </div>
    </Link>
  )
}
