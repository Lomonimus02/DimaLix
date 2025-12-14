import { CheckCircle, Clock, FileText, HardHat } from "lucide-react";

const triggers = [
  { icon: CheckCircle, text: "Пропуска в центр и на КАД" },
  { icon: Clock, text: "Работаем 24/7 без выходных" },
  { icon: FileText, text: "Работаем с НДС 20%" },
  { icon: HardHat, text: "Опытные машинисты РФ" },
];

export function TrustTriggers() {
  return (
    <section
      className="bg-accent text-dark py-4 overflow-hidden border-y border-yellow-600 relative z-20"
      aria-label="Преимущества"
    >
      <div className="container mx-auto px-4 flex justify-between items-center text-sm md:text-base font-bold uppercase tracking-wider overflow-x-auto whitespace-nowrap gap-8">
        {triggers.map((trigger, index) => (
          <span key={index} className="flex items-center gap-2">
            <trigger.icon size={18} />
            {trigger.text}
          </span>
        ))}
      </div>
    </section>
  );
}
