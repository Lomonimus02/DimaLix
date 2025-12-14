'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'

// Предустановленные характеристики для спецтехники
const PRESET_SPECS = [
  'Эксплуатационная масса',
  'Объём ковша',
  'Глубина копания',
  'Высота подъёма',
  'Грузоподъёмность',
  'Длина стрелы',
  'Мощность двигателя',
  'Габариты (Д×Ш×В)',
  'Год выпуска',
  'Вылет стрелы',
  'Ширина гусениц',
  'Объём топливного бака',
  'Скорость передвижения',
  'Давление на грунт',
]

interface Spec {
  id: string
  name: string
  value: string
}

interface SpecsEditorProps {
  initialSpecs?: string | Record<string, string> | null
  onChange?: (specs: Record<string, string>) => void
}

// Парсим initialSpecs: может быть JSON-строка, объект или null
function parseInitialSpecs(data: string | Record<string, string> | null | undefined): Spec[] {
  if (!data) return []
  
  let specsObject: Record<string, string> = {}
  
  if (typeof data === 'string') {
    try {
      specsObject = JSON.parse(data)
    } catch {
      return []
    }
  } else if (typeof data === 'object') {
    specsObject = data
  }
  
  // Проверяем что это действительно объект с ключами
  if (!specsObject || typeof specsObject !== 'object' || Array.isArray(specsObject)) {
    return []
  }
  
  return Object.entries(specsObject).map(([name, value]) => ({
    id: crypto.randomUUID(),
    name,
    value: String(value),
  }))
}

// Компонент строки с комбобоксом для выбора характеристики
function SpecRow({ 
  spec, 
  onUpdate, 
  onRemove,
  usedNames 
}: { 
  spec: Spec
  onUpdate: (id: string, field: 'name' | 'value', val: string) => void
  onRemove: (id: string) => void
  usedNames: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Закрытие dropdown при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Фильтруем опции: исключаем уже использованные и фильтруем по поиску
  const filteredOptions = PRESET_SPECS.filter(name => 
    !usedNames.includes(name) && 
    name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (name: string) => {
    onUpdate(spec.id, 'name', name)
    setSearch('')
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onUpdate(spec.id, 'name', value)
    if (!isOpen) setIsOpen(true)
  }

  return (
    <div className="flex gap-3 items-start">
      {/* Комбобокс для названия */}
      <div className="flex-1 relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Выберите или введите..."
            value={spec.name}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 pr-8 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
          <button
            type="button"
            onClick={() => { setIsOpen(!isOpen); inputRef.current?.focus() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Dropdown список */}
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-surface border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-accent/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Поле значения */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Значение (напр. 25 т)"
          value={spec.value}
          onChange={(e) => onUpdate(spec.id, 'value', e.target.value)}
          className="w-full px-3 py-2 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
        />
      </div>

      {/* Кнопка удаления */}
      <button
        type="button"
        onClick={() => onRemove(spec.id)}
        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Удалить"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function SpecsEditor({ initialSpecs, onChange }: SpecsEditorProps) {
  const [specs, setSpecs] = useState<Spec[]>(() => parseInitialSpecs(initialSpecs))

  const updateParent = (newSpecs: Spec[]) => {
    if (onChange) {
      const specsObject: Record<string, string> = {}
      newSpecs.forEach((spec) => {
        if (spec.name.trim()) {
          specsObject[spec.name.trim()] = spec.value
        }
      })
      onChange(specsObject)
    }
  }

  const addSpec = () => {
    const newSpecs = [...specs, { id: crypto.randomUUID(), name: '', value: '' }]
    setSpecs(newSpecs)
  }

  const removeSpec = (id: string) => {
    const newSpecs = specs.filter((spec) => spec.id !== id)
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  const updateSpec = (id: string, field: 'name' | 'value', val: string) => {
    const newSpecs = specs.map((spec) =>
      spec.id === id ? { ...spec, [field]: val } : spec
    )
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  // Собираем specs в JSON для отправки с формой
  const specsJson = JSON.stringify(
    specs.reduce((acc, spec) => {
      if (spec.name.trim()) {
        acc[spec.name.trim()] = spec.value
      }
      return acc
    }, {} as Record<string, string>)
  )

  return (
    <div className="space-y-3">
      {/* Скрытый input для передачи данных в форму */}
      <input type="hidden" name="specs" value={specsJson} />

      {/* Список характеристик */}
      {specs.map((spec) => (
        <SpecRow
          key={spec.id}
          spec={spec}
          onUpdate={updateSpec}
          onRemove={removeSpec}
          usedNames={specs.filter(s => s.id !== spec.id).map(s => s.name)}
        />
      ))}

      {/* Кнопка добавления */}
      <button
        type="button"
        onClick={addSpec}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:text-accent-hover hover:bg-accent/10 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить характеристику
      </button>

      {specs.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Нет характеристик. Нажмите кнопку выше, чтобы добавить.
        </p>
      )}
    </div>
  )
}
