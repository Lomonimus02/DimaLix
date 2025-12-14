import { notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/actions/categories'
import CategoryForm from './CategoryForm'

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>
}

export default async function CategoryEditPage({ params }: Props) {
  const { id } = await params

  // Если id = "new", создаём новую категорию
  if (id === 'new') {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold text-white mb-6">
            Добавить категорию
          </h1>
          <CategoryForm />
        </div>
      </div>
    )
  }

  // Иначе редактируем существующую
  const categoryId = parseInt(id, 10)
  if (isNaN(categoryId)) {
    notFound()
  }

  const category = await getCategoryById(categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-white mb-6">
          Редактировать: {category.name}
        </h1>
        <CategoryForm category={category} />
      </div>
    </div>
  )
}
