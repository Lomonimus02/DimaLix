'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { uploadFile } from './upload'

// Функция транслитерации для генерации slug
function generateSlug(title: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  }

  return title
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function saveMachine(formData: FormData) {
  // Получаем ID (если редактирование) или null (если создание)
  const idString = formData.get('id') as string | null
  const id = idString ? parseInt(idString, 10) : null

  // Базовые поля
  const title = formData.get('title') as string
  let slug = (formData.get('slug') as string || '').trim()
  
  // Если slug не указан — генерируем автоматически
  if (!slug) {
    slug = generateSlug(title)
    // Проверяем уникальность и добавляем суффикс если нужно
    const existing = await prisma.machine.findUnique({ where: { slug } })
    if (existing && existing.id !== id) {
      slug = `${slug}-${Date.now()}`
    }
  }

  const categoryId = parseInt(formData.get('categoryId') as string, 10)
  const shiftPrice = parseFloat(formData.get('shiftPrice') as string)
  const hourlyPriceStr = formData.get('hourlyPrice') as string
  const hourlyPrice = hourlyPriceStr ? parseFloat(hourlyPriceStr) : null
  const description = formData.get('description') as string || null
  const isFeatured = formData.get('isFeatured') === 'on'
  const isAvailable = formData.get('isAvailable') === 'on'

  // Характеристики (JSON строка)
  const specsJson = formData.get('specs') as string
  let specs = {}
  try {
    specs = specsJson ? JSON.parse(specsJson) : {}
  } catch {
    specs = {}
  }

  // Загрузка главного фото
  const imageFile = formData.get('image') as File | null
  const currentImageUrl = formData.get('currentImageUrl') as string | null
  
  console.log('[saveMachine] Image file received:', imageFile ? { name: imageFile.name, size: imageFile.size, type: imageFile.type } : 'no file')
  console.log('[saveMachine] Current image URL:', currentImageUrl)

  // Определяем итоговый URL изображения
  let imageUrl: string | null | undefined = undefined // undefined = не менять поле в Prisma

  // Проверяем, был ли загружен новый файл
  if (imageFile && imageFile.size > 0 && imageFile.name && imageFile.name !== 'undefined') {
    console.log('[saveMachine] Uploading new image...')
    const imageFormData = new FormData()
    imageFormData.append('file', imageFile)
    const uploadedUrl = await uploadFile(imageFormData)
    if (uploadedUrl) {
      imageUrl = uploadedUrl
      console.log('[saveMachine] New image uploaded:', uploadedUrl)
    }
  } else if (currentImageUrl) {
    // Файл не загружали, сохраняем текущий URL
    imageUrl = currentImageUrl
    console.log('[saveMachine] Keeping current image:', currentImageUrl)
  } else {
    // Нет ни нового файла, ни текущего URL - устанавливаем null
    imageUrl = null
    console.log('[saveMachine] No image')
  }

  // Загрузка галереи
  const galleryFiles = formData.getAll('gallery') as File[]
  const existingImagesJson = formData.get('existingImages') as string
  let images: string[] = []
  
  try {
    images = existingImagesJson ? JSON.parse(existingImagesJson) : []
  } catch {
    images = []
  }

  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const galleryFormData = new FormData()
      galleryFormData.append('file', file)
      const uploadedUrl = await uploadFile(galleryFormData)
      if (uploadedUrl) {
        images.push(uploadedUrl)
      }
    }
  }

  // Данные для сохранения
  const machineData = {
    title,
    slug,
    categoryId,
    shiftPrice,
    hourlyPrice,
    description,
    specs,
    imageUrl,
    images,
    isFeatured,
    isAvailable,
  }

  if (id) {
    // Обновление существующей записи
    await prisma.machine.update({
      where: { id },
      data: machineData,
    })
  } else {
    // Создание новой записи
    await prisma.machine.create({
      data: machineData,
    })
  }

  revalidatePath('/admin/machinery')
  revalidatePath('/catalog')
  redirect('/admin/machinery')
}

export async function deleteMachine(id: number) {
  await prisma.machine.delete({
    where: { id },
  })

  revalidatePath('/admin/machinery')
  revalidatePath('/catalog')
  redirect('/admin/machinery')
}
