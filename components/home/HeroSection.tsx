'use client'

import { useState } from "react"
import { Zap, Star, Shovel, ArrowUpFromLine, Truck, Calculator, X } from "lucide-react"
import { LeadForm } from "@/components/shared/LeadForm"

// Задачи для intent-based навигации
const tasks = [
  { 
    icon: Shovel, 
    label: "Копать", 
    interest: "Экскаватор",
    description: "Экскаваторы"
  },
  { 
    icon: ArrowUpFromLine, 
    label: "Поднимать", 
    interest: "Автокран",
    description: "Автокраны"
  },
  { 
    icon: Truck, 
    label: "Возить", 
    interest: "Самосвал",
    description: "Самосвалы"
  },
]

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const handleTaskClick = (interest: string) => {
    setSelectedTask(prev => prev === interest ? null : interest)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden -mt-20 pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-30 grayscale"
          alt="Строительная площадка"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-5 md:space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-accent">
            <Zap size={14} />
            Подача техники от 45 минут
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase leading-none">
            Мощь для вашего <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">
              масштаба
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-gray max-w-md border-l-2 border-accent pl-4">
            Аренда строительной техники с экипажем. Без скрытых платежей.
            Работаем с НДС. Замена техники за 2 часа при поломке.
          </p>

          {/* Intent-based Navigation */}
          <div className="space-y-4 pt-2">
            {/* Task Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {tasks.map((task) => {
                const isActive = selectedTask === task.interest
                return (
                  <button
                    key={task.label}
                    type="button"
                    onClick={() => handleTaskClick(task.interest)}
                    className={`group bg-surface/50 backdrop-blur border rounded-lg p-3 md:p-4 text-center transition-all ${
                      isActive 
                        ? 'border-accent bg-accent/20 ring-2 ring-accent/50' 
                        : 'border-white/10 hover:border-accent hover:bg-accent/10'
                    }`}
                  >
                    <task.icon 
                      size={24} 
                      className={`mx-auto mb-1 md:mb-2 transition-colors ${
                        isActive ? 'text-accent' : 'text-text-gray group-hover:text-accent'
                      }`} 
                    />
                    <span className={`block text-xs md:text-sm font-bold uppercase transition-colors ${
                      isActive ? 'text-accent' : 'text-text-gray group-hover:text-accent'
                    }`}>
                      {task.label}
                    </span>
                    <span className="hidden md:block text-[10px] text-gray-500 mt-1">
                      {task.description}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Main CTA Button */}
            <button
              onClick={handleOpenModal}
              className="w-full btn-industrial bg-accent hover:bg-accent-hover text-dark font-display font-bold text-lg md:text-xl uppercase py-3 md:py-4 rounded-lg shadow-glow flex items-center justify-center gap-3 transition-all"
            >
              <Calculator size={22} />
              Получить расчёт
            </button>

            {/* Trust hint */}
            <p className="text-xs text-gray-500 text-center">
              Бесплатный расчёт • Ответим за 5 минут
            </p>
          </div>
        </div>

        {/* Hero Image/Visual */}
        <div className="hidden md:block relative">
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"></div>

          {/* Excavator Image */}
          <img
            src="https://pngimg.com/d/excavator_PNG59.png"
            className="relative z-10 w-full drop-shadow-2xl"
            alt="JCB Экскаватор"
          />

          {/* Floating Badge */}
          <div className="absolute top-20 right-0 bg-surface/90 backdrop-blur border border-white/10 p-4 rounded shadow-card z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Star className="text-accent" size={24} />
              </div>
              <div>
                <div className="text-2xl font-display font-bold">500+</div>
                <div className="text-xs text-text-gray uppercase">
                  Единиц в парке
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-surface border border-white/10 rounded-xl p-6 md:p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Title */}
            <h3 className="font-display text-2xl font-bold mb-2">
              Получите расчёт
            </h3>
            <p className="text-text-gray mb-6">
              {selectedTask 
                ? `Вы выбрали: ${selectedTask}. Оставьте контакт — мы перезвоним.`
                : 'Оставьте контакт — мы перезвоним за 5 минут.'}
            </p>

            {/* Lead Form */}
            <LeadForm
              source="Hero Selection"
              initialInterest={selectedTask}
              buttonText="Получить расчёт"
              showMessage={false}
              onSuccess={handleCloseModal}
            />
          </div>
        </div>
      )}
    </section>
  )
}
