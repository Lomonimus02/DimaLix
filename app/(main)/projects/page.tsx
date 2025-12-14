import type { Metadata } from "next";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Наши объекты",
  description:
    "Видеоотчеты с реальных строек Санкт-Петербурга. Смотрите как работает наша техника на крупных объектах.",
};

const projects = [
  {
    id: 1,
    title: 'ЖК "Северная Долина"',
    description: "Рытье котлована под 4 корпус",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Трасса М-11",
    description: "Планировка откосов",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function ProjectsPage() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <h1 className="font-display text-5xl font-bold uppercase">
            Наши объекты
          </h1>
          <p className="text-text-gray">Видеоотчеты с реальных строек СПБ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="relative group rounded-xl overflow-hidden aspect-video bg-surface border border-white/10"
            >
              <img
                src={project.image}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                alt={project.title}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-dark text-2xl shadow-glow cursor-pointer transition transform group-hover:scale-110"
                  aria-label="Смотреть видео"
                >
                  <Play className="ml-1" size={28} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-dark to-transparent">
                <h3 className="text-xl font-bold uppercase">{project.title}</h3>
                <p className="text-sm text-accent">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
