'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { LeadForm } from '@/components/shared'

interface CallbackModalProps {
  isOpen: boolean
  onClose: () => void
  /** Название техники (если открыто со страницы товара) */
  machineName?: string
  /** Источник (по умолчанию "Модалка в шапке") */
  source?: string
}

export function CallbackModal({ 
  isOpen, 
  onClose, 
  machineName,
  source = 'Модалка в шапке' 
}: CallbackModalProps) {
  const [mounted, setMounted] = useState(false)

  // Для SSR - монтируем портал только на клиенте
  useEffect(() => {
    setMounted(true)
  }, [])

  // Блокируем скролл при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-white/10 rounded-lg p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-text-gray hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h3 className="font-display text-2xl font-bold mb-2">
          {machineName ? 'Заказать технику' : 'Заказать звонок'}
        </h3>
        <p className="text-text-gray text-sm mb-6">
          {machineName 
            ? `Оставьте заявку на "${machineName}"` 
            : 'Оставьте контакты и мы перезвоним вам в течение 15 минут'
          }
        </p>

        {/* Lead Form */}
        <LeadForm 
          source={source}
          machineName={machineName}
          showMessage={!!machineName}
          buttonText={machineName ? 'Заказать' : 'Жду звонка'}
          onSuccess={() => {
            // Закрываем модалку через 2 секунды после успеха
            setTimeout(onClose, 2000)
          }}
        />
      </div>
    </div>
  )

  // Рендерим через портал в body
  return createPortal(modalContent, document.body)
}
