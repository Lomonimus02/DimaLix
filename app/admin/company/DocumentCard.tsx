'use client'

import Link from 'next/link'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteDocument } from '@/lib/actions/company'
import type { Document } from '@prisma/client'

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  const handleDelete = async () => {
    if (confirm(`Удалить документ "${document.title}"?`)) {
      await deleteDocument(document.id)
    }
  }

  return (
    <div className="bg-dark rounded-lg border border-white/10 overflow-hidden group">
      {/* Image */}
      <div className="aspect-[3/4] bg-white/5 relative">
        {document.imageUrl ? (
          <img
            src={document.imageUrl}
            alt={document.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-gray">
            <svg
              className="w-16 h-16 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          {document.isActive ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
              <Eye size={12} />
              Активен
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded border border-gray-500/30">
              <EyeOff size={12} />
              Скрыт
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`/admin/company/documents/${document.id}`}
            className="p-2 bg-accent text-dark rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Edit size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-white text-sm truncate">{document.title}</h3>
        {document.number && (
          <p className="text-text-gray text-xs mt-1">{document.number}</p>
        )}
      </div>
    </div>
  )
}
