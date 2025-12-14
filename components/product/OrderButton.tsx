'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { CallbackModal } from '@/components/layout'

interface OrderButtonProps {
  machineTitle: string
}

export function OrderButton({ machineTitle }: OrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 px-6 bg-accent hover:bg-accent/90 text-dark font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 text-lg"
      >
        <Phone size={20} />
        Заказать технику
      </button>

      <CallbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        machineName={machineTitle}
        source={`Карточка товара - ${machineTitle}`}
      />
    </>
  )
}
