/**
 * Утилита для отправки сообщений в Telegram
 */

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN
const TG_CHAT_ID = process.env.TG_CHAT_ID

/**
 * Отправляет сообщение в Telegram чат
 * @param text - Текст сообщения (поддерживает Markdown)
 * @returns true если отправлено успешно, false если произошла ошибка
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  // Проверяем наличие конфигурации
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.warn('[Telegram] Не настроены TG_BOT_TOKEN или TG_CHAT_ID. Сообщение не отправлено.')
    return false
  }

  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Telegram] Ошибка отправки:', response.status, errorData)
      return false
    }

    console.log('[Telegram] Сообщение успешно отправлено')
    return true
  } catch (error) {
    console.error('[Telegram] Ошибка при отправке сообщения:', error)
    return false
  }
}

/**
 * Форматирует заявку для отправки в Telegram
 */
export function formatLeadMessage(data: {
  name: string
  phone: string
  email?: string | null
  machine?: string | null
  interest?: string | null
  message?: string | null
  source?: string | null
}): string {
  const lines = [
    '🔥 *НОВАЯ ЗАЯВКА*',
    '',
    `👤 *Имя:* ${escapeMarkdown(data.name)}`,
    `📱 *Тел:* ${escapeMarkdown(data.phone)}`,
  ]

  if (data.email) {
    lines.push(`📧 *Email:* ${escapeMarkdown(data.email)}`)
  }

  if (data.interest) {
    lines.push(`🎯 *Интересует:* ${escapeMarkdown(data.interest)}`)
  }

  if (data.machine) {
    lines.push(`🚜 *Техника:* ${escapeMarkdown(data.machine)}`)
  }

  if (data.message) {
    lines.push(`💬 *Комментарий:* ${escapeMarkdown(data.message)}`)
  }

  if (data.source) {
    lines.push(`📍 *Источник:* ${escapeMarkdown(data.source)}`)
  }

  lines.push('')
  lines.push(`📅 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`)

  return lines.join('\n')
}

/**
 * Экранирует специальные символы Markdown
 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}
