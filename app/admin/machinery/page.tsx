import Link from 'next/link'
import { Plus, Pencil, ArrowLeft } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function MachineryListPage() {
  const machines = await prisma.machine.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })

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
              <h1 className="text-2xl font-bold text-white">Техника</h1>
              <p className="text-gray-400 mt-1">
                Всего единиц: {machines.length}
              </p>
            </div>
          </div>
          <Link
            href="/admin/machinery/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-dark font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </Link>
        </div>

        {/* Таблица */}
        <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
          {machines.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">Техника пока не добавлена</p>
              <Link
                href="/admin/machinery/new"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить первую единицу
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
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Цена/смена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {machines.map((machine) => (
                  <tr key={machine.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {machine.imageUrl ? (
                        <img
                          src={machine.imageUrl}
                          alt={machine.title}
                          className="w-16 h-12 object-cover rounded-lg border border-white/10"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-dark rounded-lg flex items-center justify-center border border-white/10">
                          <span className="text-gray-500 text-xs">Нет фото</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {machine.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{machine.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {machine.category.name}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {Number(machine.shiftPrice).toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {machine.isAvailable ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            Доступна
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                            Недоступна
                          </span>
                        )}
                        {machine.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                            На главной
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/machinery/${machine.id}`}
                          className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
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
