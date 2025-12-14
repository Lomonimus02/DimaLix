'use client'

import { useState } from 'react'
import { FolderOpen } from 'lucide-react'

interface CategoryImageProps {
  imageUrl: string | null
  name: string
}

export default function CategoryImage({ imageUrl, name }: CategoryImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!imageUrl || hasError) {
    return (
      <div className="w-10 h-10 bg-dark rounded flex items-center justify-center border border-white/10">
        <FolderOpen className="w-5 h-5 text-gray-500" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className="w-10 h-10 object-cover rounded border border-white/10"
      onError={() => setHasError(true)}
    />
  )
}
