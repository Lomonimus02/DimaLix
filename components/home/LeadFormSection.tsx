import { MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/shared";

export function LeadFormSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-accent/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-dark border border-white/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-card flex flex-col md:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1">
            <h2 className="font-display text-4xl font-bold uppercase mb-4">
              Горит объект?
            </h2>
            <p className="text-text-gray mb-6">
              Оставьте заявку сейчас. Диспетчер перезвонит через 3 минуты,
              согласует цену и отправит технику.
            </p>
            <a
              href="https://wa.me/78129990000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded bg-green-500/10 flex items-center justify-center text-green-400 text-xl group-hover:bg-green-500/20 transition-colors">
                <MessageCircle size={24} />
              </div>
              <div className="text-sm">
                <div className="font-bold group-hover:text-green-400 transition-colors">
                  Пишите в WhatsApp
                </div>
                <div className="text-text-gray">Отвечаем мгновенно</div>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2">
            <LeadForm
              source="Главная - Секция заявки"
              buttonText="Рассчитать стоимость"
              showMessage={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
