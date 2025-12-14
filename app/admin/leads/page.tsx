import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Phone, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { deleteLead, updateLeadStatus } from '@/lib/actions/leads'
import { StatusSelect, DeleteButton } from './LeadActions'

export const dynamic = 'force-dynamic';

// Цвета и лейблы для статусов
const statusConfig = {
  NEW: { label: 'Новая', color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  PROCESSING: { label: 'В работе', color: 'bg-yellow-500/20 text-yellow-400', icon: Loader2 },
  COMPLETED: { label: 'Завершена', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Отменена', color: 'bg-red-500/20 text-red-400', icon: XCircle },
}

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Server Action для удаления
  async function handleDelete(formData: FormData) {
    'use server'
    const leadId = Number(formData.get('leadId'))
    await deleteLead(leadId)
    revalidatePath('/admin/leads')
  }

  // Server Action для изменения статуса
  async function handleStatusChange(formData: FormData) {
    'use server'
    const leadId = Number(formData.get('leadId'))
    const status = formData.get('status') as 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    await updateLeadStatus(leadId, status)
    revalidatePath('/admin/leads')
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Шапка */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Заявки</h1>
            <p className="text-gray-400 mt-1">
              Всего заявок: {leads.length}
            </p>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-xl border border-white/10 p-4">
            <div className="text-3xl font-bold text-blue-400">
              {leads.filter(l => l.status === 'NEW').length}
            </div>
            <div className="text-sm text-gray-400">Новых</div>
          </div>
          <div className="bg-surface rounded-xl border border-white/10 p-4">
            <div className="text-3xl font-bold text-yellow-400">
              {leads.filter(l => l.status === 'PROCESSING').length}
            </div>
            <div className="text-sm text-gray-400">В работе</div>
          </div>
          <div className="bg-surface rounded-xl border border-white/10 p-4">
            <div className="text-3xl font-bold text-green-400">
              {leads.filter(l => l.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-400">Завершено</div>
          </div>
          <div className="bg-surface rounded-xl border border-white/10 p-4">
            <div className="text-3xl font-bold text-red-400">
              {leads.filter(l => l.status === 'CANCELLED').length}
            </div>
            <div className="text-sm text-gray-400">Отменено</div>
          </div>
        </div>

        {/* Таблица заявок */}
        {leads.length === 0 ? (
          <div className="bg-surface rounded-xl border border-white/10 p-12 text-center">
            <p className="text-gray-400">Заявок пока нет</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-gray-400 uppercase">
                    <th className="px-6 py-4 font-medium">Дата</th>
                    <th className="px-6 py-4 font-medium">Имя</th>
                    <th className="px-6 py-4 font-medium">Телефон</th>
                    <th className="px-6 py-4 font-medium">Источник</th>
                    <th className="px-6 py-4 font-medium">Техника</th>
                    <th className="px-6 py-4 font-medium">Сообщение</th>
                    <th className="px-6 py-4 font-medium">Статус</th>
                    <th className="px-6 py-4 font-medium text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => {
                    const status = statusConfig[lead.status]
                    const StatusIcon = status.icon

                    return (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        {/* Дата */}
                        <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Имя */}
                        <td className="px-6 py-4 font-medium text-white">
                          {lead.name}
                        </td>

                        {/* Телефон */}
                        <td className="px-6 py-4">
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-2 text-accent hover:underline"
                          >
                            <Phone size={14} />
                            {lead.phone}
                          </a>
                        </td>

                        {/* Источник */}
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {lead.source || '—'}
                        </td>

                        {/* Техника */}
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {lead.machine || '—'}
                        </td>

                        {/* Сообщение */}
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                          {lead.message || '—'}
                        </td>

                        {/* Статус */}
                        <td className="px-6 py-4">
                          <StatusSelect
                            leadId={lead.id}
                            currentStatus={lead.status}
                            onStatusChange={handleStatusChange}
                          />
                        </td>

                        {/* Действия */}
                        <td className="px-6 py-4 text-right">
                          <DeleteButton
                            leadId={lead.id}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
