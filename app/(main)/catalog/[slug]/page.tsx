import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, MapPin, Clock, Shield } from 'lucide-react'
import { getMachineBySlug } from '@/lib/data'
import { RentalCalculator, OrderButton } from '@/components/product'

// Интерфейс параметров
interface PageProps {
  params: Promise<{ slug: string }>
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const machine = await getMachineBySlug(slug)

  if (!machine) {
    return {
      title: 'Техника не найдена | Iron Rent',
    }
  }

  const price = Number(machine.shiftPrice).toLocaleString('ru-RU')

  return {
    title: `Аренда ${machine.title} в Санкт-Петербурге — цена ${price} ₽/смена | Iron Rent`,
    description: machine.description
      ? machine.description.slice(0, 160)
      : `Аренда ${machine.title} в СПб. Цена от ${price} ₽ за смену. Доставка по городу и области. Опытные машинисты.`,
    openGraph: {
      title: `Аренда ${machine.title} — ${price} ₽/смена`,
      description: machine.description || `Аренда ${machine.title} в Санкт-Петербурге`,
      images: machine.imageUrl ? [machine.imageUrl] : [],
    },
  }
}

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

// Метки для характеристик
const specLabels: Record<string, string> = {
  weight: 'Масса',
  bucketVolume: 'Объём ковша',
  maxDepth: 'Макс. глубина копания',
  maxReach: 'Макс. вылет',
  engine: 'Двигатель',
  year: 'Год выпуска',
  liftingCapacity: 'Грузоподъёмность',
  boomLength: 'Длина стрелы',
  maxHeight: 'Макс. высота подъёма',
  axles: 'Количество осей',
  bucketCapacity: 'Объём ковша',
  operatingWeight: 'Эксплуатационная масса',
  maxLiftHeight: 'Макс. высота подъёма',
  maxLoadCapacity: 'Макс. грузоподъёмность',
  bladeCapacity: 'Объём отвала',
  bladeWidth: 'Ширина отвала',
  chassis: 'Шасси',
  maxSpeed: 'Макс. скорость',
}

export default async function MachinePage({ params }: PageProps) {
  const { slug } = await params
  const machine = await getMachineBySlug(slug)

  if (!machine) {
    notFound()
  }

  const specs = parseSpecs(machine.specs)
  const specEntries = Object.entries(specs)
  const shiftPrice = Number(machine.shiftPrice)
  const hourlyPrice = machine.hourlyPrice ? Number(machine.hourlyPrice) : null

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-text-gray hover:text-accent transition"
          >
            <ArrowLeft size={18} />
            Назад в каталог
          </Link>
        </nav>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Левая колонка - Фото */}
          <div>
            <div className="bg-surface border border-white/10 rounded-xl p-8 sticky top-24">
              {machine.imageUrl ? (
                <img
                  src={machine.imageUrl}
                  alt={machine.title}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              ) : (
                <div className="aspect-square flex items-center justify-center bg-white/5 rounded-lg">
                  <span className="text-text-gray">Фото отсутствует</span>
                </div>
              )}
              
              {/* Галерея миниатюр */}
              {machine.images && machine.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {machine.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border-2 border-transparent hover:border-accent transition cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`${machine.title} - фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - Информация */}
          <div className="space-y-6">
            {/* Категория */}
            <Link
              href={`/catalog?category=${machine.category.slug}`}
              className="inline-block text-sm text-accent uppercase tracking-wider hover:underline"
            >
              {machine.category.name}
            </Link>

            {/* Заголовок */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight">
              {machine.title}
            </h1>

            {/* Статус доступности */}
            <div className="flex items-center gap-2">
              {machine.isAvailable ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 font-medium">Свободен</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-orange-400 font-medium">Занят</span>
                </>
              )}
            </div>

            {/* Цены */}
            <div className="bg-surface border border-white/10 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-text-gray uppercase block mb-1">
                    Смена (7+1 час)
                  </span>
                  <span className="text-3xl font-display font-bold text-accent">
                    {shiftPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                {hourlyPrice && (
                  <div>
                    <span className="text-xs text-text-gray uppercase block mb-1">
                      Час
                    </span>
                    <span className="text-3xl font-display font-bold text-white">
                      {hourlyPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Калькулятор */}
            <RentalCalculator
              shiftPrice={shiftPrice}
              hourlyPrice={hourlyPrice}
            />

            {/* Кнопка заказа */}
            <OrderButton machineTitle={machine.title} />

            {/* Преимущества */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-text-gray">
                <CheckCircle size={18} className="text-green-400" />
                <span>Своя техника</span>
              </div>
              <div className="flex items-center gap-2 text-text-gray">
                <Clock size={18} className="text-accent" />
                <span>Подача за 2 часа</span>
              </div>
              <div className="flex items-center gap-2 text-text-gray">
                <MapPin size={18} className="text-accent" />
                <span>СПб и ЛО</span>
              </div>
              <div className="flex items-center gap-2 text-text-gray">
                <Shield size={18} className="text-green-400" />
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя секция - Характеристики и описание */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Характеристики */}
          {specEntries.length > 0 && (
            <div className="bg-surface border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold uppercase mb-6">
                Технические характеристики
              </h2>
              <div className="space-y-3">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-text-gray">
                      {specLabels[key] || key}
                    </span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Описание */}
          {machine.description && (
            <div className="bg-surface border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold uppercase mb-6">
                Описание
              </h2>
              <div className="prose prose-invert prose-sm max-w-none">
                {machine.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-text-gray mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
