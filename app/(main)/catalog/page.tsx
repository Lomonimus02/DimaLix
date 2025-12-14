import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Search, Truck } from 'lucide-react'
import { getMachines, getCategories, type MachineSearchParams } from '@/lib/data'
import { MachineryCard, CatalogFilters } from '@/components/catalog'

export const metadata: Metadata = {
  title: 'Каталог спецтехники | Iron Rent',
  description:
    'Каталог строительной техники в аренду: экскаваторы, автокраны, погрузчики, бульдозеры. Вся техника в собственности с регулярным ТО.',
}

// Компонент пустого состояния
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Search size={32} className="text-text-gray" />
      </div>
      <h3 className="font-display text-2xl font-bold uppercase mb-2">
        Ничего не найдено
      </h3>
      <p className="text-text-gray max-w-md">
        По вашему запросу не найдено техники. Попробуйте изменить параметры фильтрации или сбросить фильтры.
      </p>
    </div>
  )
}

// Скелетон для загрузки
function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-surface border border-white/5 rounded-xl p-6 animate-pulse"
        >
          <div className="h-48 bg-white/5 rounded-lg mb-6"></div>
          <div className="h-4 bg-white/5 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

// Интерфейс для пропсов страницы
interface CatalogPageProps {
  searchParams: Promise<MachineSearchParams>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Await searchParams в Next.js 15
  const params = await searchParams
  
  // Параллельный запрос данных
  const [machines, categories] = await Promise.all([
    getMachines(params),
    getCategories(),
  ])

  // Получаем текущую категорию для заголовка
  const currentCategory = params.category
    ? categories.find((c) => c.slug === params.category)
    : null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Truck size={32} className="text-accent" />
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase">
              {currentCategory ? currentCategory.name : 'Каталог техники'}
            </h1>
          </div>
          <p className="text-text-gray">
            {currentCategory
              ? currentCategory.description
              : 'Вся техника в собственности. Регулярное ТО. Быстрая подача.'}
          </p>
          <div className="mt-2 text-sm text-text-gray">
            Найдено: <span className="text-white font-medium">{machines.length}</span> единиц техники
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Сайдбар с фильтрами */}
          <Suspense fallback={<div className="w-64 h-96 bg-surface animate-pulse rounded-xl"></div>}>
            <CatalogFilters categories={categories} />
          </Suspense>

          {/* Сетка товаров */}
          <div className="flex-1">
            <Suspense fallback={<CatalogSkeleton />}>
              {machines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {machines.map((machine) => (
                    <MachineryCard key={machine.id} machine={machine} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
