import prisma from './prisma'
import { Prisma } from '@prisma/client'

// Типы для параметров поиска
export interface MachineSearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  available?: string
}

// Получить машины с фильтрацией
export async function getMachines(searchParams: MachineSearchParams = {}) {
  const { category, minPrice, maxPrice, available } = searchParams

  // Строим условия фильтрации
  const where: Prisma.MachineWhereInput = {}

  // Фильтр по категории (slug)
  if (category) {
    where.category = {
      slug: category,
    }
  }

  // Фильтр по минимальной цене
  if (minPrice) {
    const min = parseFloat(minPrice)
    if (!isNaN(min)) {
      where.shiftPrice = {
        ...((where.shiftPrice as Prisma.DecimalFilter) || {}),
        gte: min,
      }
    }
  }

  // Фильтр по максимальной цене
  if (maxPrice) {
    const max = parseFloat(maxPrice)
    if (!isNaN(max)) {
      where.shiftPrice = {
        ...((where.shiftPrice as Prisma.DecimalFilter) || {}),
        lte: max,
      }
    }
  }

  // Фильтр по доступности
  if (available === 'true') {
    where.isAvailable = true
  }

  const machines = await prisma.machine.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return machines
}

// Получить одну машину по slug
export async function getMachineBySlug(slug: string) {
  const machine = await prisma.machine.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  return machine
}

// Получить все категории
export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { machines: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories
}

// Получить featured технику для главной
export async function getFeaturedMachines(limit = 3) {
  const machines = await prisma.machine.findMany({
    where: {
      isFeatured: true,
      isAvailable: true,
    },
    include: {
      category: true,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return machines
}

// Получить featured технику для главной (сериализованные данные для Client Components)
export async function getFeaturedMachinesSerialized(limit = 3) {
  const machines = await prisma.machine.findMany({
    where: {
      isFeatured: true,
      isAvailable: true,
    },
    include: {
      category: true,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Сериализуем для передачи в Client Component
  return machines.map((m) => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    categoryId: m.categoryId,
    shiftPrice: Number(m.shiftPrice),
    hourlyPrice: m.hourlyPrice ? Number(m.hourlyPrice) : null,
    specs: m.specs,
    description: m.description,
    imageUrl: m.imageUrl,
    images: m.images,
    isFeatured: m.isFeatured,
    isAvailable: m.isAvailable,
    category: {
      id: m.category.id,
      name: m.category.name,
      slug: m.category.slug,
    },
  }))
}

// Получить категории (сериализованные данные для Client Components)
export async function getCategoriesSerialized() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { machines: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    _count: c._count,
  }))
}

// Получить количество техники
export async function getMachinesCount() {
  return prisma.machine.count({
    where: { isAvailable: true },
  })
}

// Типы для экспорта
export type MachineWithCategory = Awaited<ReturnType<typeof getMachines>>[number]
export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number]
