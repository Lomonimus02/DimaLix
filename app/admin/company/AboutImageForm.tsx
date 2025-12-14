'use client'

import { useState } from 'react'
import { Upload, Check, Loader2 } from 'lucide-react'
import { updateAboutImage } from '@/lib/actions/company'

interface AboutImageFormProps {
  currentImage: string | null
}

export function AboutImageForm({ currentImage }: AboutImageFormProps) {
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
    setIsUploading(true)
    setMessage(null)
    
    const result = await updateAboutImage(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Изображение успешно обновлено!' })
      if (result.imageUrl) {
        setPreview(result.imageUrl)
      }
    }
    
    setIsUploading(false)
  }

  return (
    <form action={handleSubmit}>
      <div className="flex gap-6">
        {/* Preview */}
        <div className="w-64 aspect-[4/3] bg-dark rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-gray">
              <span className="text-sm">Нет изображения</span>
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="flex-1 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-text-gray mb-2">
              Выберите изображение
            </span>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-text-gray
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-accent file:text-dark
                hover:file:bg-accent/90
                file:cursor-pointer cursor-pointer"
            />
          </label>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-dark font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Загрузка...
              </>
            ) : (
              <>
                <Upload size={20} />
                Сохранить
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
