'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import { uploadFile } from '@/lib/actions/upload'
import { ImageUpload } from '@/components/admin'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  _count: {
    machines: number
  }
}

interface CategoryFormProps {
  category?: Category
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!category

  const handleDelete = async () => {
    if (!category) return
    
    if (category._count.machines > 0) {
      setError(`Невозможно удалить категорию. Она содержит ${category._count.machines} единиц техники.`)
      return
    }
    
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию? Это действие необратимо.')) {
      return
    }
    
    setIsDeleting(true)
    setError(null)
    
    try {
      const result = await deleteCategory(category.id)
      if (result?.error) {
        setError(result.error)
        setIsDeleting(false)
      }
    } catch (err: unknown) {
      // NEXT_REDIRECT - это нормальное поведение
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return
      }
      console.error('Ошибка удаления:', err)
      setError('Произошла ошибка при удалении')
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Загружаем изображение если есть
      const imageFile = formData.get('image') as File
      let imageUrl = formData.get('currentImageUrl') as string
      
      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        const uploadedUrl = await uploadFile(uploadFormData)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }
      
      // Создаём новую FormData с imageUrl
      const submitData = new FormData()
      submitData.append('name', formData.get('name') as string)
      submitData.append('description', formData.get('description') as string || '')
      submitData.append('imageUrl', imageUrl || '')
      
      let result
      if (isEditing) {
        result = await updateCategory(category.id, submitData)
      } else {
        result = await createCategory(submitData)
      }
      
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
    } catch (err: unknown) {
      // NEXT_REDIRECT - это нормальное поведение, не ошибка
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return // redirect сработает
      }
      console.error('Ошибка сохранения:', err)
      setError('Произошла ошибка при сохранении')
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Навигация */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </Link>
        <div className="flex items-center gap-3">
          {isEditing && (
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

      {/* Сообщение об ошибке */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Основная информация */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Основная информация
        </h2>

        <div className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={category?.name || ''}
              placeholder="Экскаваторы"
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Описание (необязательное) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание <span className="text-gray-500 font-normal">(необязательно)</span>
            </label>
            <textarea
              name="description"
              rows={2}
              defaultValue={category?.description || ''}
              placeholder="Краткое описание категории..."
              className="w-full px-4 py-2.5 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Изображение */}
      <div className="bg-surface rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Изображение категории
        </h2>

        <ImageUpload currentImage={category?.imageUrl} name="image" />
        
        <p className="text-xs text-gray-500 mt-3">
          Рекомендуемый размер: 800x600 пикселей. Форматы: JPG, PNG, WebP.
        </p>
      </div>

      {/* Информация о связанной технике (только для редактирования) */}
      {isEditing && (
        <div className="bg-surface rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Связанная техника
          </h2>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Единиц техники в категории: <span className="text-white font-medium">{category._count.machines}</span>
            </p>
            {category._count.machines > 0 && (
              <Link
                href={`/admin/machinery?category=${category.id}`}
                className="text-accent hover:text-accent-hover transition-colors text-sm"
              >
                Посмотреть технику →
              </Link>
            )}
          </div>
        </div>
      )}
    </form>
  )
}
