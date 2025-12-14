'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'

// Конфиг статусов
const statusOptions = [
  { value: 'NEW', label: '🕐 Новая', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'PROCESSING', label: '⏳ В работе', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'COMPLETED', label: '✅ Завершена', color: 'bg-green-500/20 text-green-400' },
  { value: 'CANCELLED', label: '❌ Отменена', color: 'bg-red-500/20 text-red-400' },
]

interface StatusSelectProps {
  leadId: number
  currentStatus: string
  onStatusChange: (formData: FormData) => Promise<void>
}

export function StatusSelect({ leadId, currentStatus, onStatusChange }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  
  const currentOption = statusOptions.find(opt => opt.value === status) || statusOptions[0]

  const handleChange = (newStatus: string) => {
    setStatus(newStatus) // Мгновенно обновляем UI
    
    const formData = new FormData()
    formData.set('leadId', String(leadId))
    formData.set('status', newStatus)
    
    startTransition(async () => {
      await onStatusChange(formData)
    })
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className={`${currentOption.color} px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 outline-none appearance-none pr-6 disabled:opacity-50`}
        style={{ backgroundImage: 'none' }}
      >
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2 size={14} className="animate-spin text-gray-400 absolute right-1" />
      )}
    </div>
  )
}

interface DeleteButtonProps {
  leadId: number
  onDelete: (formData: FormData) => Promise<void>
}

export function DeleteButton({ leadId, onDelete }: DeleteButtonProps) {
  return (
    <form action={onDelete} className="inline">
      <input type="hidden" name="leadId" value={leadId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm('Удалить заявку?')) {
            e.preventDefault()
          }
        }}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Удалить"
      >
        <Trash2 size={18} />
      </button>
    </form>
  )
}
