const operators = [
  { src: "https://randomuser.me/api/portraits/men/32.jpg", alt: "Оператор 1" },
  { src: "https://randomuser.me/api/portraits/men/44.jpg", alt: "Оператор 2" },
  { src: "https://randomuser.me/api/portraits/men/86.jpg", alt: "Оператор 3" },
];

export function WhyUs() {
  return (
    <section className="py-20 bg-surface border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Stat 1 */}
          <div className="p-4">
            <div className="text-accent text-5xl font-display font-bold mb-2">
              98%
            </div>
            <p className="text-sm text-text-gray uppercase tracking-wide">
              Заказов выполняются в срок без опозданий
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-4 md:pl-8">
            <div className="text-white text-5xl font-display font-bold mb-2">
              5 <span className="text-accent text-2xl">лет</span>
            </div>
            <p className="text-sm text-text-gray uppercase tracking-wide">
              Средний возраст техники. Нет старого хлама.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="p-4 md:pl-8">
            <div className="text-white text-5xl font-display font-bold mb-2">
              24/7
            </div>
            <p className="text-sm text-text-gray uppercase tracking-wide">
              Круглосуточная поддержка диспетчера
            </p>
          </div>

          {/* Operators */}
          <div className="p-4 md:pl-8">
            <div className="flex -space-x-4 mb-4 justify-center md:justify-start">
              {operators.map((operator, index) => (
                <img
                  key={index}
                  src={operator.src}
                  alt={operator.alt}
                  className="w-12 h-12 rounded-full border-2 border-surface object-cover"
                />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-dark flex items-center justify-center text-xs font-bold">
                +50
              </div>
            </div>
            <p className="text-sm text-text-gray uppercase tracking-wide">
              Штат квалифицированных машинистов
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
