import Link from 'next/link'
import { Search, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Иконка */}
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search size={40} className="text-text-gray" />
          </div>

          {/* Заголовок */}
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4">
            Техника не найдена
          </h1>

          {/* Описание */}
          <p className="text-text-gray text-lg mb-8">
            К сожалению, запрашиваемая техника не найдена. Возможно, она была
            снята с аренды или ссылка устарела.
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-dark font-bold uppercase rounded-lg transition"
            >
              <ArrowLeft size={18} />
              Вернуться в каталог
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase rounded-lg transition border border-white/10"
            >
              <Home size={18} />
              На главную
            </Link>
          </div>

          {/* Подсказка */}
          <p className="text-sm text-text-gray mt-8">
            Нужна помощь?{' '}
            <a href="tel:+78001234567" className="text-accent hover:underline">
              Позвоните нам
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
