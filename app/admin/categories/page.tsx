import Link from 'next/link'
import { Plus, Pencil, ArrowLeft, FolderOpen } from 'lucide-react'
import { getAllCategories } from '@/lib/actions/categories'
import DeleteCategoryButton from './DeleteCategoryButton'
import CategoryImage from './CategoryImage'

export const dynamic = 'force-dynamic';

type CategoryWithCount = {
  id: number
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    machines: number
  }
}

export default async function CategoriesListPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Категории</h1>
              <p className="text-gray-400 mt-1">
                Всего категорий: {categories.length}
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-dark font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </Link>
        </div>

        {/* Таблица */}
        <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Категории пока не добавлены</p>
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить первую категорию
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-dark/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Фото
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Техника
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {categories.map((category: CategoryWithCount) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <CategoryImage imageUrl={category.imageUrl} name={category.name} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {category.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {category._count.machines} ед.
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteCategoryButton categoryId={category.id} machinesCount={category._count.machines} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
