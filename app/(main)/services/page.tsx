import { Metadata } from "next";
import Link from "next/link";
import { Users, Truck, Clock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Услуги аренды спецтехники | Iron Rent",
  description:
    "Аренда спецтехники с экипажем в Санкт-Петербурге. Доставка техники, работа 24/7, срочная подача от 4 часов. Опытные машинисты.",
};

const services = [
  {
    icon: Users,
    title: "Аренда с экипажем",
    description:
      "Опытные машинисты с допусками и стажем от 5 лет. Все операторы — граждане РФ с официальным трудоустройством.",
    features: ["Допуски СРО", "Медицинские книжки", "Страхование"],
  },
  {
    icon: Truck,
    title: "Доставка техники",
    description:
      "Собственный парк тралов и низкорамников для перевозки техники любых габаритов. Доставим на объект в удобное время.",
    features: ["Тралы до 60 тонн", "Низкорамники", "Сопровождение ГИБДД"],
  },
  {
    icon: Clock,
    title: "Работа 24/7",
    description:
      "Выполняем заказы в ночные смены и выходные дни. Идеально для объектов с ограничением движения в дневное время.",
    features: ["Ночные смены", "Выходные и праздники", "Без доплат за ночь"],
  },
  {
    icon: Zap,
    title: "Срочная подача",
    description:
      "Экстренная подача техники от 4 часов. Для срочных работ и аварийных ситуаций — выезжаем немедленно.",
    features: ["От 4 часов", "Диспетчер 24/7", "Приоритетная обработка"],
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase mb-6">
            Услуги аренды{" "}
            <span className="text-accent">спецтехники</span>
          </h1>
          <p className="text-text-gray text-lg md:text-xl max-w-2xl">
            Комплексные решения для строительных и промышленных объектов
            Санкт-Петербурга и Ленинградской области
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-surface border border-white/10 rounded-xl p-6 lg:p-8 hover:border-accent/50 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="text-accent" size={28} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl lg:text-2xl font-bold uppercase mb-2">
                      {service.title}
                    </h2>
                    <p className="text-text-gray text-sm lg:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs uppercase tracking-wide bg-white/5 px-3 py-1.5 rounded-full text-text-gray"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 mt-12 bg-surface border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-4">
            Нужна техника <span className="text-accent">прямо сейчас?</span>
          </h2>
          <p className="text-text-gray text-lg mb-8 max-w-xl mx-auto">
            Выберите нужную технику из нашего каталога или позвоните — поможем
            подобрать оптимальный вариант под ваши задачи
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="btn-industrial bg-accent hover:bg-accent-hover text-dark font-bold uppercase px-8 py-4 text-lg"
            >
              Перейти в каталог
            </Link>
            <a
              href="tel:+78129990000"
              className="border border-white/30 hover:border-accent hover:text-accent font-bold uppercase px-8 py-4 text-lg transition-all rounded"
            >
              +7 (812) 999-00-00
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
