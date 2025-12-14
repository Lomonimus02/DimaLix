import 'dotenv/config'
import { PrismaClient, LeadStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очистка существующих данных
  await prisma.lead.deleteMany()
  await prisma.machine.deleteMany()
  await prisma.category.deleteMany()

  console.log('📦 Создаём категории...')

  // Создание категорий
  const excavators = await prisma.category.create({
    data: {
      name: 'Экскаваторы',
      slug: 'excavators',
      description: 'Аренда гусеничных и колёсных экскаваторов для земляных работ любой сложности',
      imageUrl: '/images/categories/excavators.jpg',
    },
  })

  const cranes = await prisma.category.create({
    data: {
      name: 'Краны',
      slug: 'cranes',
      description: 'Автокраны и башенные краны для строительных и монтажных работ',
      imageUrl: '/images/categories/cranes.jpg',
    },
  })

  const loaders = await prisma.category.create({
    data: {
      name: 'Погрузчики',
      slug: 'loaders',
      description: 'Фронтальные и телескопические погрузчики для складских и строительных работ',
      imageUrl: '/images/categories/loaders.jpg',
    },
  })

  const bulldozers = await prisma.category.create({
    data: {
      name: 'Бульдозеры',
      slug: 'bulldozers',
      description: 'Мощные бульдозеры для планировки территории и земляных работ',
      imageUrl: '/images/categories/bulldozers.jpg',
    },
  })

  console.log('🚜 Создаём технику...')

  // Создание техники
  const machines = await prisma.machine.createMany({
    data: [
      // Экскаваторы
      {
        title: 'Экскаватор JCB JS220',
        slug: 'jcb-js220',
        categoryId: excavators.id,
        shiftPrice: 25000,
        hourlyPrice: 3500,
        specs: JSON.stringify({
          weight: '22 т',
          bucketVolume: '1.2 м³',
          maxDepth: '6.7 м',
          maxReach: '9.5 м',
          engine: 'JCB Dieselmax 129 кВт',
          year: 2021,
        }),
        description: `Гусеничный экскаватор JCB JS220 — надёжная и производительная машина для земляных работ любой сложности.

Идеально подходит для:
- Рытьё котлованов и траншей
- Погрузочно-разгрузочные работы
- Снос зданий и сооружений
- Планировка территории

Экскаватор оснащён современной кабиной с климат-контролем и отличным обзором. Предоставляется с опытным машинистом.`,
        imageUrl: 'https://pngimg.com/d/excavator_PNG59.png',
        images: ['https://pngimg.com/d/excavator_PNG59.png'],
        isFeatured: true,
        isAvailable: true,
      },
      {
        title: 'Экскаватор Hitachi ZX350',
        slug: 'hitachi-zx350',
        categoryId: excavators.id,
        shiftPrice: 35000,
        hourlyPrice: 4500,
        specs: JSON.stringify({
          weight: '35 т',
          bucketVolume: '1.6 м³',
          maxDepth: '7.5 м',
          maxReach: '11.1 м',
          engine: 'Isuzu 202 кВт',
          year: 2020,
        }),
        description: `Тяжёлый гусеничный экскаватор Hitachi ZX350 для масштабных земляных работ и карьерной добычи.

Преимущества:
- Высокая производительность
- Экономичный расход топлива
- Надёжная гидравлика
- Комфортная кабина оператора`,
        imageUrl: 'https://pngimg.com/d/excavator_PNG64.png',
        images: ['https://pngimg.com/d/excavator_PNG64.png'],
        isFeatured: false,
        isAvailable: true,
      },

      // Краны
      {
        title: 'Автокран Liebherr LTM 1100',
        slug: 'liebherr-ltm-1100',
        categoryId: cranes.id,
        shiftPrice: 45000,
        hourlyPrice: 6000,
        specs: JSON.stringify({
          liftingCapacity: '100 т',
          boomLength: '52 м',
          maxHeight: '91 м',
          axles: 5,
          engine: 'Liebherr 370 кВт',
          year: 2019,
        }),
        description: `Мобильный автокран Liebherr LTM 1100 грузоподъёмностью 100 тонн — универсальное решение для строительных и монтажных работ.

Применение:
- Монтаж металлоконструкций
- Установка башенных кранов
- Подъём тяжёлого оборудования
- Строительство мостов и эстакад

Кран оснащён системой телескопирования и может работать в стеснённых условиях.`,
        imageUrl: 'https://pngimg.com/d/crane_PNG54.png',
        images: ['https://pngimg.com/d/crane_PNG54.png'],
        isFeatured: true,
        isAvailable: true,
      },
      {
        title: 'Автокран КС-55713',
        slug: 'ks-55713',
        categoryId: cranes.id,
        shiftPrice: 22000,
        hourlyPrice: 3000,
        specs: JSON.stringify({
          liftingCapacity: '25 т',
          boomLength: '21.7 м',
          maxHeight: '28 м',
          chassis: 'КамАЗ-65115',
          year: 2022,
        }),
        description: `Отечественный автокран КС-55713 на шасси КамАЗ — экономичное решение для строительных работ.

Особенности:
- Доступная цена аренды
- Высокая проходимость
- Простое обслуживание
- Быстрая доставка`,
        imageUrl: 'https://pngimg.com/d/crane_truck_PNG51439.png',
        images: ['https://pngimg.com/d/crane_truck_PNG51439.png'],
        isFeatured: false,
        isAvailable: true,
      },

      // Погрузчики
      {
        title: 'Погрузчик CAT 950H',
        slug: 'cat-950h',
        categoryId: loaders.id,
        shiftPrice: 20000,
        hourlyPrice: 2800,
        specs: JSON.stringify({
          bucketCapacity: '3.3 м³',
          operatingWeight: '18 т',
          liftingCapacity: '5.5 т',
          maxSpeed: '40 км/ч',
          engine: 'Cat C7 ACERT 153 кВт',
          year: 2020,
        }),
        description: `Фронтальный погрузчик Caterpillar 950H — универсальная машина для строительных площадок и складов.

Возможности:
- Погрузка и разгрузка материалов
- Перемещение сыпучих грузов
- Уборка территории
- Работа с вилами и другим навесным оборудованием

Погрузчик отличается высокой маневренностью и производительностью.`,
        imageUrl: 'https://pngimg.com/d/bulldozer_PNG52086.png',
        images: ['https://pngimg.com/d/bulldozer_PNG52086.png'],
        isFeatured: true,
        isAvailable: true,
      },
      {
        title: 'Телескопический погрузчик JCB 535-140',
        slug: 'jcb-535-140',
        categoryId: loaders.id,
        shiftPrice: 18000,
        hourlyPrice: 2500,
        specs: JSON.stringify({
          maxLiftHeight: '14 м',
          maxLoadCapacity: '3.5 т',
          maxReach: '10 м',
          operatingWeight: '11.5 т',
          engine: 'JCB EcoMAX 74 кВт',
          year: 2021,
        }),
        description: `Телескопический погрузчик JCB 535-140 — идеальный выбор для строительных площадок с ограниченным пространством.

Применение:
- Подача материалов на высоту
- Работа на складах
- Строительство и отделка
- Работа с различным навесным оборудованием`,
        imageUrl: 'https://pngimg.com/d/bulldozer_PNG52064.png',
        images: ['https://pngimg.com/d/bulldozer_PNG52064.png'],
        isFeatured: false,
        isAvailable: true,
      },

      // Бульдозеры
      {
        title: 'Бульдозер Komatsu D65EX',
        slug: 'komatsu-d65ex',
        categoryId: bulldozers.id,
        shiftPrice: 28000,
        hourlyPrice: 3800,
        specs: JSON.stringify({
          operatingWeight: '20 т',
          bladeCapacity: '4.7 м³',
          bladeWidth: '3.9 м',
          engine: 'Komatsu SAA6D114E 169 кВт',
          year: 2020,
        }),
        description: `Гусеничный бульдозер Komatsu D65EX — мощная машина для планировочных и земляных работ.

Преимущества:
- Высокая тяговая мощность
- Надёжная трансмиссия
- Современная система управления
- Комфортные условия работы оператора`,
        imageUrl: 'https://pngimg.com/d/bulldozer_PNG52058.png',
        images: ['https://pngimg.com/d/bulldozer_PNG52058.png'],
        isFeatured: false,
        isAvailable: true,
      },
    ],
  })

  console.log(`✅ Создано ${machines.count} единиц техники`)

  console.log('📝 Создаём тестовые заявки...')

  // Тестовые заявки
  await prisma.lead.createMany({
    data: [
      {
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        email: 'ivan@example.com',
        message: 'Интересует аренда экскаватора на неделю для рытья котлована',
        source: 'main_form',
        status: LeadStatus.NEW,
      },
      {
        name: 'ООО "СтройМонтаж"',
        phone: '+7 (495) 555-55-55',
        email: 'info@stroymontazh.ru',
        message: 'Нужен автокран 100т на 3 дня для монтажа конструкций',
        source: 'catalog',
        status: LeadStatus.PROCESSING,
      },
      {
        name: 'Сергей',
        phone: '+7 (926) 111-22-33',
        message: 'Погрузчик CAT на месяц, уточните цену',
        source: 'hero_form',
        status: LeadStatus.COMPLETED,
      },
    ],
  })

  console.log('🎉 База данных успешно заполнена!')
  
  // Вывод статистики
  const categoriesCount = await prisma.category.count()
  const machinesCount = await prisma.machine.count()
  const leadsCount = await prisma.lead.count()
  
  console.log(`
📊 Итоговая статистика:
   - Категорий: ${categoriesCount}
   - Техники: ${machinesCount}
   - Заявок: ${leadsCount}
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
