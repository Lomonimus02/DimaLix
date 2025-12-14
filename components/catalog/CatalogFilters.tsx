'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import type { CategoryWithCount } from '@/lib/data'

interface CatalogFiltersProps {
  categories: CategoryWithCount[]
}

export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Локальное состояние для инпутов цены (с debounce)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  
  // Состояние для мобильного меню
  const [isOpen, setIsOpen] = useState(false)
  
  // Текущая выбранная категория
  const currentCategory = searchParams.get('category') || ''

  // Создание URL с новыми параметрами
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          current.delete(key)
        } else {
          current.set(key, value)
        }
      })
      
      return current.toString()
    },
    [searchParams]
  )

  // Обработчик изменения категории
  const handleCategoryChange = (categorySlug: string) => {
    const newCategory = categorySlug === currentCategory ? null : categorySlug
    const queryString = createQueryString({ category: newCategory })
    
    startTransition(() => {
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
    })
  }

  // Debounced обновление цены
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentMin = searchParams.get('minPrice') || ''
      const currentMax = searchParams.get('maxPrice') || ''
      
      if (minPrice !== currentMin || maxPrice !== currentMax) {
        const queryString = createQueryString({
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
        })
        
        startTransition(() => {
          router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
        })
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [minPrice, maxPrice, searchParams, createQueryString, pathname, router])

  // Сброс всех фильтров
  const handleReset = () => {
    setMinPrice('')
    setMaxPrice('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  // Есть ли активные фильтры
  const hasActiveFilters = currentCategory || minPrice || maxPrice

  // Контент фильтров
  const filtersContent = (
    <div className="space-y-6">
      {/* Категории */}
      <div>
        <h3 className="font-display text-sm font-bold uppercase text-white mb-3">
          Категории
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                currentCategory === category.slug
                  ? 'bg-accent text-dark font-medium'
                  : 'bg-white/5 text-text-gray hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{category.name}</span>
              <span className={`text-xs ${
                currentCategory === category.slug ? 'text-dark/60' : 'text-text-gray'
              }`}>
                {category._count.machines}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div>
        <h3 className="font-display text-sm font-bold uppercase text-white mb-3">
          Цена за смену, ₽
        </h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="От"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-text-gray focus:outline-none focus:border-accent transition"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-text-gray focus:outline-none focus:border-accent transition"
            />
          </div>
        </div>
      </div>

      {/* Кнопка сброса */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 border border-white/10 rounded-lg text-text-gray hover:text-white hover:border-white/20 transition flex items-center justify-center gap-2"
        >
          <X size={16} />
          Сбросить фильтры
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Мобильная кнопка */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 px-4 bg-surface border border-white/10 rounded-lg flex items-center justify-between text-white"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} />
            Фильтры
            {hasActiveFilters && (
              <span className="bg-accent text-dark text-xs px-2 py-0.5 rounded-full font-bold">
                {[currentCategory, minPrice, maxPrice].filter(Boolean).length}
              </span>
            )}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {/* Мобильные фильтры */}
        {isOpen && (
          <div className="mt-4 p-4 bg-surface border border-white/10 rounded-lg">
            {filtersContent}
          </div>
        )}
      </div>

      {/* Десктопный сайдбар */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 p-4 bg-surface border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold uppercase flex items-center gap-2">
              <Filter size={18} className="text-accent" />
              Фильтры
            </h2>
            {isPending && (
              <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
            )}
          </div>
          {filtersContent}
        </div>
      </aside>
    </>
  )
}
