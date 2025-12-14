'use client'

import { useState, useRef, useTransition } from 'react'
import { Loader2, CheckCircle, Phone } from 'lucide-react'
import { submitLead } from '@/lib/actions/leads'

// Варианты техники для селекта
const INTEREST_OPTIONS = [
  { value: '', label: 'Не знаю / Консультация' },
  { value: 'Экскаватор', label: 'Экскаватор' },
  { value: 'Автокран', label: 'Автокран' },
  { value: 'Самосвал', label: 'Самосвал' },
  { value: 'Манипулятор', label: 'Манипулятор' },
  { value: 'Погрузчик', label: 'Погрузчик' },
]

interface LeadFormProps {
  /** Источник заявки (например: "Главная - Hero", "Модалка в шапке") */
  source: string
  /** Название техники (если заявка со страницы товара) */
  machineName?: string
  /** Предвыбранный интерес (например: "Экскаватор") */
  initialInterest?: string | null
  /** Вариант отображения */
  variant?: 'default' | 'compact' | 'inline'
  /** Текст кнопки */
  buttonText?: string
  /** Показывать поле комментария */
  showMessage?: boolean
  /** Callback после успешной отправки */
  onSuccess?: () => void
  /** Дополнительные классы */
  className?: string
}

export function LeadForm({
  source,
  machineName,
  initialInterest,
  variant = 'default',
  buttonText = 'Отправить заявку',
  showMessage = true,
  onSuccess,
  className = '',
}: LeadFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterest, setSelectedInterest] = useState(initialInterest || '')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    
    startTransition(async () => {
      const response = await submitLead(formData)
      
      if (response.success) {
        setIsSuccess(true)
        formRef.current?.reset()
        onSuccess?.()
      } else {
        setError(response.error)
      }
    })
  }

  // Успешное состояние
  if (isSuccess) {
    return (
      <div className={`bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center ${className}`}>
        <CheckCircle className="mx-auto text-green-400 mb-3" size={48} />
        <h3 className="font-display text-xl font-bold mb-2">Спасибо за заявку!</h3>
        <p className="text-text-gray">
          Мы перезвоним вам в течение 5 минут
        </p>
        {machineName && (
          <p className="text-sm text-accent mt-2">
            Техника: {machineName}
          </p>
        )}
      </div>
    )
  }

  // Компактный вариант (только имя и телефон в ряд)
  if (variant === 'compact') {
    return (
      <form ref={formRef} action={handleSubmit} className={className}>
        <input type="hidden" name="source" value={source} />
        {machineName && <input type="hidden" name="machine" value={machineName} />}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            required
            minLength={2}
            disabled={isPending}
            className="flex-1 bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            required
            minLength={10}
            disabled={isPending}
            className="flex-1 bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-accent hover:bg-accent-hover text-dark font-bold uppercase py-3 px-6 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              buttonText
            )}
          </button>
        </div>
        
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </form>
    )
  }

  // Инлайн вариант (горизонтальный)
  if (variant === 'inline') {
    return (
      <form ref={formRef} action={handleSubmit} className={className}>
        <input type="hidden" name="source" value={source} />
        {machineName && <input type="hidden" name="machine" value={machineName} />}
        
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            name="name"
            placeholder="Имя"
            required
            minLength={2}
            disabled={isPending}
            className="w-32 bg-dark/50 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-accent focus:outline-none text-sm disabled:opacity-50"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            required
            minLength={10}
            disabled={isPending}
            className="w-36 bg-dark/50 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-accent focus:outline-none text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-accent hover:bg-accent-hover text-dark font-bold uppercase py-2 px-4 rounded text-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
            {isPending ? '...' : 'Позвоните мне'}
          </button>
        </div>
        
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </form>
    )
  }

  // Дефолтный вариант (вертикальная форма)
  return (
    <form ref={formRef} action={handleSubmit} className={`space-y-4 ${className}`}>
      <input type="hidden" name="source" value={source} />
      {machineName && <input type="hidden" name="machine" value={machineName} />}
      
      {/* Имя */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Ваше имя *"
          required
          minLength={2}
          disabled={isPending}
          className="w-full bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Телефон */}
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Телефон *"
          required
          minLength={10}
          disabled={isPending}
          className="w-full bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email (необязательно)"
          disabled={isPending}
          className="w-full bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Выбор техники */}
      <div>
        <select
          name="interest"
          value={selectedInterest}
          onChange={(e) => setSelectedInterest(e.target.value)}
          disabled={isPending}
          className="w-full bg-dark/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors disabled:opacity-50 appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          {INTEREST_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark text-white">
              {option.label}
            </option>
          ))}
        </select>
        <label className="block text-xs text-gray-500 mt-1 ml-1">Какая техника нужна?</label>
      </div>

      {/* Комментарий */}
      {showMessage && (
        <div>
          <textarea
            name="message"
            placeholder="Комментарий (необязательно)"
            rows={3}
            disabled={isPending}
            className="w-full bg-dark/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent hover:bg-accent-hover text-dark font-bold uppercase py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Отправка...
          </>
        ) : (
          buttonText
        )}
      </button>

      {/* Политика */}
      <p className="text-xs text-gray-600 text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/terms" className="text-accent hover:underline">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  )
}
