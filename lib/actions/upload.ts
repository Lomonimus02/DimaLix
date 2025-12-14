'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function uploadFile(formData: FormData): Promise<string | null> {
  const file = formData.get('file') as File | null
  
  if (!file || file.size === 0) {
    return null
  }

  // Создаём папку uploads если не существует
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }

  // Генерируем уникальное имя файла
  const timestamp = Date.now()
  const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `${timestamp}_${originalName}`
  const filePath = join(UPLOAD_DIR, fileName)

  // Читаем файл и сохраняем
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(filePath, buffer)

  // Возвращаем путь относительно public
  return `/uploads/${fileName}`
}
