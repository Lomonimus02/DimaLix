'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { createDocument, updateDocument } from '@/lib/actions/company'
import type { Document } from '@prisma/client'

interface DocumentFormProps {
  document?: Document
}

export function DocumentForm({ document }: DocumentFormProps) {
  const router = useRouter()
  const isEditing = !!document

  const [preview, setPreview] = useState<string | null>(document?.imageUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    const result = isEditing
      ? await updateDocument(document.id, formData)
      : await createDocument(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/admin/company')
    }
  }

  return (
    <form action={handleSubmit} className="bg-surface rounded-xl border border-white/10 p-6">
      <div className="space-y-6">
        {/* Название */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-gray mb-2">
            Название документа *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={document?.title || ''}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-white placeholder-text-gray"
            placeholder="Например: Свидетельство СРО"
          />
        </div>

        {/* Номер документа */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-text-gray mb-2">
            Номер документа
          </label>
          <input
            type="text"
            id="number"
            name="number"
            defaultValue={document?.number || ''}
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-white placeholder-text-gray"
            placeholder="Например: СРО-001-2024"
          />
        </div>

        {/* Порядок сортировки */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-text-gray mb-2">
            Порядок сортировки
          </label>
          <input
            type="number"
            id="sortOrder"
            name="sortOrder"
            defaultValue={document?.sortOrder || 0}
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-white placeholder-text-gray"
            placeholder="0"
          />
          <p className="text-text-gray text-xs mt-1">Чем меньше число, тем выше в списке</p>
        </div>

        {/* Изображение */}
        <div>
          <label className="block text-sm font-medium text-text-gray mb-2">
            Скан документа
          </label>
          <div className="flex gap-4">
            {/* Preview */}
            <div className="w-32 aspect-[3/4] bg-dark rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-gray">
                  <svg
                    className="w-8 h-8 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-text-gray
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-white/10 file:text-white
                  hover:file:bg-white/20
                  file:cursor-pointer cursor-pointer"
              />
              <p className="text-text-gray text-xs mt-2">
                Рекомендуемый размер: 600×800 px
              </p>
            </div>
          </div>
        </div>

        {/* Активен */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={document?.isActive ?? true}
            className="w-5 h-5 rounded border-white/10 bg-dark text-accent focus:ring-accent"
          />
          <label htmlFor="isActive" className="text-sm text-white">
            Показывать на сайте
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent text-dark font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Сохранение...
            </>
          ) : (
            <>
              <Save size={20} />
              {isEditing ? 'Сохранить изменения' : 'Добавить документ'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
