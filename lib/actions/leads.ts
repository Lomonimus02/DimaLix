'use server'

import { prisma } from '@/lib/prisma'
import { sendTelegramMessage, formatLeadMessage } from '@/lib/telegram'

/**
 * Результат отправки заявки
 */
type SubmitLeadResult = 
  | { success: true; leadId: number }
  | { success: false; error: string }

/**
 * Данные формы заявки
 */
interface LeadFormData {
  name: string
  phone: string
  email?: string
  machine?: string
  interest?: string
  message?: string
  source?: string
}

/**
 * Server Action для приёма заявок
 * Сохраняет заявку в БД и отправляет уведомление в Telegram
 */
export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  try {
    // Извлекаем данные из FormData
    const data: LeadFormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      machine: formData.get('machine') as string || undefined,
      interest: formData.get('interest') as string || undefined,
      message: formData.get('message') as string || undefined,
      source: formData.get('source') as string || undefined,
    }

    // Валидация обязательных полей
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: 'Укажите ваше имя' }
    }

    if (!data.phone || data.phone.trim().length < 10) {
      return { success: false, error: 'Укажите корректный номер телефона' }
    }

    // Очищаем телефон от лишних символов для хранения
    const cleanPhone = data.phone.replace(/[^\d+]/g, '')

    // Сохраняем заявку в базу данных
    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || null,
        machine: data.machine?.trim() || null,
        interest: data.interest?.trim() || null,
        message: data.message?.trim() || null,
        source: data.source?.trim() || 'website',
      },
    })

    // Формируем и отправляем сообщение в Telegram
    const telegramMessage = formatLeadMessage({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      machine: lead.machine,
      interest: lead.interest,
      message: lead.message,
      source: lead.source,
    })

    // Отправляем в Telegram (не блокируем основной процесс при ошибке)
    await sendTelegramMessage(telegramMessage)

    console.log(`[Lead] Создана заявка #${lead.id} от ${lead.name}`)

    return { success: true, leadId: lead.id }

  } catch (error) {
    console.error('[Lead] Ошибка при создании заявки:', error)
    return { success: false, error: 'Произошла ошибка. Попробуйте позже или позвоните нам.' }
  }
}

/**
 * Альтернативная версия для вызова с объектом (не FormData)
 */
export async function submitLeadData(data: LeadFormData): Promise<SubmitLeadResult> {
  const formData = new FormData()
  formData.set('name', data.name)
  formData.set('phone', data.phone)
  if (data.email) formData.set('email', data.email)
  if (data.machine) formData.set('machine', data.machine)
  if (data.interest) formData.set('interest', data.interest)
  if (data.message) formData.set('message', data.message)
  if (data.source) formData.set('source', data.source)
  
  return submitLead(formData)
}

/**
 * Результат удаления заявки
 */
type DeleteLeadResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Server Action для удаления заявки
 */
export async function deleteLead(leadId: number): Promise<DeleteLeadResult> {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    })

    console.log(`[Lead] Удалена заявка #${leadId}`)
    return { success: true }
  } catch (error) {
    console.error('[Lead] Ошибка при удалении заявки:', error)
    return { success: false, error: 'Не удалось удалить заявку' }
  }
}

/**
 * Server Action для обновления статуса заявки
 */
export async function updateLeadStatus(
  leadId: number, 
  status: 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })

    console.log(`[Lead] Обновлен статус заявки #${leadId} -> ${status}`)
    return { success: true }
  } catch (error) {
    console.error('[Lead] Ошибка при обновлении статуса:', error)
    return { success: false, error: 'Не удалось обновить статус' }
  }
}
