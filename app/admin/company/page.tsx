import Link from 'next/link'
import { ArrowLeft, Plus, Image, FileText } from 'lucide-react'
import { getCompanySettings, getDocuments } from '@/lib/actions/company'
import { AboutImageForm } from './AboutImageForm'
import { DocumentCard } from './DocumentCard'

export const dynamic = 'force-dynamic';

export default async function CompanyAdminPage() {
  const [settings, documents] = await Promise.all([
    getCompanySettings(),
    getDocuments(),
  ])

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Шапка */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="text-white" size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">О компании</h1>
            <p className="text-gray-400 mt-1">Управление контентом страницы</p>
          </div>
        </div>

        {/* Секция: Фото для страницы "О компании" */}
        <section className="bg-surface rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Image className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-white">Фото компании</h2>
          </div>
          <p className="text-text-gray text-sm mb-4">
            Это изображение отображается в секции &quot;О компании&quot; на странице about
          </p>
          
          <AboutImageForm currentImage={settings?.aboutImage || null} />
        </section>

        {/* Секция: Документы */}
        <section className="bg-surface rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-accent" size={24} />
              <h2 className="text-xl font-bold text-white">Лицензии и допуски</h2>
            </div>
            <Link
              href="/admin/company/documents/new"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-dark font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus size={20} />
              Добавить
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 text-text-gray">
              <FileText className="mx-auto mb-3 opacity-30" size={48} />
              <p>Документы не добавлены</p>
              <p className="text-sm mt-1">Нажмите &quot;Добавить&quot; чтобы загрузить первый документ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
