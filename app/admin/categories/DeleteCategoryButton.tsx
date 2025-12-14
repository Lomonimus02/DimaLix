'use client'

import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/categories'

interface DeleteButtonProps {
  categoryId: number
  machinesCount: number
}

export default function DeleteCategoryButton({ categoryId, machinesCount }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (machinesCount > 0) {
      alert(`Невозможно удалить категорию. Она содержит ${machinesCount} единиц техники.`)
      return
    }
    
    if (!confirm('Удалить категорию?')) {
      return
    }
    
    try {
      await deleteCategory(categoryId)
    } catch (err: unknown) {
      // NEXT_REDIRECT - нормальное поведение
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        return
      }
      console.error('Ошибка удаления:', err)
      alert('Ошибка при удалении категории')
    }
  }

  if (machinesCount > 0) {
    return (
      <button
        disabled
        className="p-2 text-gray-600 cursor-not-allowed rounded-lg"
        title={`Нельзя удалить: ${machinesCount} ед. техники`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
      title="Удалить"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
