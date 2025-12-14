'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react'
import { saveMachine, deleteMachine } from '@/lib/actions/machine'
import { SpecsEditor, ImageUpload } from '@/components/admin'

interface Category {
  id: number
  name: string
  slug: string
}

interface Machine {
  id: number
  title: string
  slug: string
  categoryId: number
  shiftPrice: number
  hourlyPrice: number | null
  description: string | null
  imageUrl: string | null
  images: string[]
  specs: Record<string, string>
  isFeatured: boolean
  isAvailable: boolean
}

interface MachineFormProps {
  machine?: Machine
  categories: Category[]
}

export default function MachineForm({ machine, categories }: MachineFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!machine) return
    if (!window.confirm('Вы уверены, что хотите удалить эту технику? Это действие необратимо.')) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteMachine(machine.id)
    } catch (error) {
      console.error('Ошибка удаления:', error)
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await saveMachine(formData)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Скрытое поле ID для редактирования */}
      {machine && <input type="hidden" name="id" value={machine.id} />}
      {/* Скрытое поле slug - генерируется автоматически на сервере если пустое */}
      <input type="hidden" name="slug" value={machine?.slug || ''} />

      {/* Навигация */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/machinery"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </Link>
        <div className="flex items-center gap-3">
          {machine && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </>
              )}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-dark font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Сохранить
              </>
            )}
          </button>
        </div>
      </div>

      {/* Основная информация */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Основная информация
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Название */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={machine?.title || ''}
              placeholder="Экскаватор JCB JS220"
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL страницы будет сгенерирован автоматически из названия
            </p>
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Категория *
            </label>
            <select
              name="categoryId"
              required
              defaultValue={machine?.categoryId || ''}
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="" className="bg-dark">Выберите категорию</option>
              {categories.length === 0 ? (
                <option disabled className="bg-dark text-gray-500">Нет категорий</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-dark">
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-400 mt-1">Сначала добавьте категории в базу данных</p>
            )}
          </div>

          {/* Пустая ячейка для выравнивания */}
          <div />

          {/* Цена за смену */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Цена за смену (₽) *
            </label>
            <input
              type="number"
              name="shiftPrice"
              required
              min="0"
              step="0.01"
              defaultValue={machine?.shiftPrice || ''}
              placeholder="15000"
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Цена за час */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Цена за час (₽)
            </label>
            <input
              type="number"
              name="hourlyPrice"
              min="0"
              step="0.01"
              defaultValue={machine?.hourlyPrice || ''}
              placeholder="2500"
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* Описание */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Описание
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={machine?.description || ''}
            placeholder="Полное описание техники..."
            className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Фото */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Главное фото
        </h2>
        <ImageUpload currentImage={machine?.imageUrl} />
      </div>

      {/* Характеристики */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Характеристики
        </h2>
        <SpecsEditor initialSpecs={machine?.specs || {}} />
      </div>

      {/* Настройки */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Настройки отображения
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={machine?.isFeatured || false}
              className="w-5 h-5 bg-dark border-white/20 rounded text-accent focus:ring-accent focus:ring-offset-0"
            />
            <div>
              <span className="font-medium text-white">Показывать на главной</span>
              <p className="text-sm text-gray-400">Техника будет отображаться в блоке избранного на главной странице</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              defaultChecked={machine?.isAvailable ?? true}
              className="w-5 h-5 bg-dark border-white/20 rounded text-accent focus:ring-accent focus:ring-offset-0"
            />
            <div>
              <span className="font-medium text-white">Доступна для аренды</span>
              <p className="text-sm text-gray-400">Отключите, если техника временно недоступна</p>
            </div>
          </label>
        </div>
      </div>

      {/* Кнопка сохранения внизу */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-dark font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Сохранить технику
            </>
          )}
        </button>
      </div>
    </form>
  )
}
