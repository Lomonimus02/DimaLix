'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadFile } from './upload'

// ==================== Company Settings ====================

export async function getCompanySettings() {
  const settings = await prisma.companySettings.findFirst()
  return settings
}

export async function updateAboutImage(formData: FormData) {
  const imageUrl = await uploadFile(formData)
  
  if (!imageUrl) {
    return { error: 'Не удалось загрузить изображение' }
  }

  // Upsert - создаём или обновляем запись
  await prisma.companySettings.upsert({
    where: { id: 1 },
    update: { aboutImage: imageUrl },
    create: { id: 1, aboutImage: imageUrl },
  })

  revalidatePath('/about')
  revalidatePath('/admin/company')
  return { success: true, imageUrl }
}

// ==================== Documents ====================

export async function getDocuments() {
  return prisma.document.findMany({
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getActiveDocuments() {
  return prisma.document.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getDocument(id: number) {
  return prisma.document.findUnique({
    where: { id },
  })
}

export async function createDocument(formData: FormData) {
  const title = formData.get('title') as string
  const number = formData.get('number') as string | null
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
  const isActive = formData.get('isActive') === 'on'
  
  // Загружаем изображение если есть
  const imageUrl = await uploadFile(formData)

  if (!title?.trim()) {
    return { error: 'Название документа обязательно' }
  }

  await prisma.document.create({
    data: {
      title: title.trim(),
      number: number?.trim() || null,
      imageUrl,
      sortOrder,
      isActive,
    },
  })

  revalidatePath('/about')
  revalidatePath('/admin/company')
  return { success: true }
}

export async function updateDocument(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const number = formData.get('number') as string | null
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
  const isActive = formData.get('isActive') === 'on'
  
  if (!title?.trim()) {
    return { error: 'Название документа обязательно' }
  }

  // Проверяем, нужно ли обновлять изображение
  const file = formData.get('file') as File | null
  let imageUrl: string | null | undefined = undefined
  
  if (file && file.size > 0) {
    imageUrl = await uploadFile(formData)
  }

  await prisma.document.update({
    where: { id },
    data: {
      title: title.trim(),
      number: number?.trim() || null,
      sortOrder,
      isActive,
      ...(imageUrl !== undefined && { imageUrl }),
    },
  })

  revalidatePath('/about')
  revalidatePath('/admin/company')
  return { success: true }
}

export async function deleteDocument(id: number) {
  await prisma.document.delete({
    where: { id },
  })

  revalidatePath('/about')
  revalidatePath('/admin/company')
  return { success: true }
}
