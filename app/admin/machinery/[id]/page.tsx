import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import MachineForm from './MachineForm'

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>
}

export default async function MachineryEditPage({ params }: Props) {
  const { id } = await params

  // Получаем все категории для селекта
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  // Если id = "new", создаём новую запись
  if (id === 'new') {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold text-white mb-6">
            Добавить технику
          </h1>
          <MachineForm categories={categories} />
        </div>
      </div>
    )
  }

  // Иначе редактируем существующую
  const machineId = parseInt(id, 10)
  if (isNaN(machineId)) {
    notFound()
  }

  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
  })

  if (!machine) {
    notFound()
  }

  // Преобразуем Decimal в number для клиентского компонента
  // Prisma возвращает specs как JsonValue - преобразуем в Record или пустой объект
  let parsedSpecs: Record<string, string> = {}
  if (machine.specs && typeof machine.specs === 'object' && !Array.isArray(machine.specs)) {
    parsedSpecs = machine.specs as Record<string, string>
  }

  const machineData = {
    ...machine,
    shiftPrice: Number(machine.shiftPrice),
    hourlyPrice: machine.hourlyPrice ? Number(machine.hourlyPrice) : null,
    specs: parsedSpecs,
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-white mb-6">
          Редактировать: {machine.title}
        </h1>
        <MachineForm machine={machineData} categories={categories} />
      </div>
    </div>
  )
}
