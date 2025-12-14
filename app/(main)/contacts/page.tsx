import { Metadata } from "next";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";
import { LeadForm } from "@/components/shared";

export const metadata: Metadata = {
  title: "Контакты | Iron Rent — Аренда спецтехники СПб",
  description:
    "Свяжитесь с Iron Rent для аренды спецтехники. Адрес: Санкт-Петербург, ул. Строителей 15. Телефон: +7 (812) 999-00-00. Работаем 24/7.",
};

export default function ContactsPage() {
  return (
    <main className="pt-24 pb-0">
      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4">
            Контакты
          </h1>
          <p className="text-text-gray text-lg max-w-xl">
            Свяжитесь с нами любым удобным способом — ответим в течение 5 минут
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Phone - главный элемент */}
              <div className="bg-surface border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-accent" size={24} />
                  </div>
                  <div>
                    <h2 className="text-sm uppercase tracking-wide text-text-gray mb-2">
                      Телефон
                    </h2>
                    <a
                      href="tel:+78129990000"
                      className="font-display text-3xl md:text-4xl font-bold text-accent hover:text-accent-hover transition-colors"
                    >
                      +7 (812) 999-00-00
                    </a>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full status-live"></span>
                      <span className="text-green-400 text-sm">
                        Работаем 24/7, без выходных
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="text-text-gray" size={24} />
                </div>
                <div>
                  <h2 className="text-sm uppercase tracking-wide text-text-gray mb-1">
                    Адрес офиса
                  </h2>
                  <p className="text-lg font-medium">
                    г. Санкт-Петербург, ул. Строителей 15
                  </p>
                  <p className="text-text-gray text-sm mt-1">
                    Бизнес-центр «Строитель», офис 312
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="text-text-gray" size={24} />
                </div>
                <div>
                  <h2 className="text-sm uppercase tracking-wide text-text-gray mb-1">
                    Email
                  </h2>
                  <a
                    href="mailto:info@iron-rent.ru"
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    info@iron-rent.ru
                  </a>
                  <p className="text-text-gray text-sm mt-1">
                    Ответим в течение 1 часа
                  </p>
                </div>
              </div>

              {/* Requisites */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="text-text-gray" size={24} />
                </div>
                <div>
                  <h2 className="text-sm uppercase tracking-wide text-text-gray mb-2">
                    Реквизиты
                  </h2>
                  <div className="text-sm text-text-gray space-y-1">
                    <p>
                      <span className="text-white/60">ООО «Айрон Рент»</span>
                    </p>
                    <p>ИНН: 7801234567</p>
                    <p>ОГРН: 1234567890123</p>
                    <p>КПП: 780101001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div>
              <h2 className="font-display text-xl font-bold uppercase mb-4">
                Оставить заявку
              </h2>
              <LeadForm
                source="Страница Контакты"
                className="bg-surface p-6 rounded-xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-12">
        <div className="relative w-full h-[400px] md:h-[500px]">
          {/* Grayscale filter for industrial look */}
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aexample&amp;source=constructor&amp;ll=30.315868%2C59.939095&amp;z=15"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="grayscale contrast-125 opacity-80"
            title="Карта офиса Iron Rent"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark via-transparent to-dark/50" />
          
          {/* Location badge */}
          <div className="absolute top-6 left-6 bg-dark/90 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent flex items-center justify-center rounded">
                <MapPin className="text-dark" size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">Iron Rent</div>
                <div className="text-text-gray text-xs">ул. Строителей 15</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
