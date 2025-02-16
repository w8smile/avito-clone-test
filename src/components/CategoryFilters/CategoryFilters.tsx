import { useState } from 'react'
import './CategoryFilters.css'

const categoryFilters = {
  Недвижимость: [
    { name: 'propertyType', label: 'Тип недвижимости' },
    { name: 'area', label: 'Площадь (м²)' },
  ],
  Авто: [
    { name: 'brand', label: 'Марка' },
    { name: 'year', label: 'Год выпуска' },
  ],
  Услуги: [{ name: 'serviceType', label: 'Тип услуги' }],
} as const

type CategoryType = keyof typeof categoryFilters

interface CategoryFiltersProps {
  selectedCategory: string
  onChange: (filters: Record<string, string>) => void
}

export const CategoryFilters = ({ selectedCategory, onChange }: CategoryFiltersProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleFilterChange = (name: string, value: string) => {
    const updatedFilters = { ...filters, [name]: value }
    setFilters(updatedFilters)
    onChange(updatedFilters)
  }

  return (
    <div className="category-filters">
      {categoryFilters[selectedCategory as CategoryType]?.map(({ name, label }) => (
        <div key={name} className="filter-item">
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type="text"
            placeholder={label}
            value={filters[name] || ''}
            onChange={(e) => handleFilterChange(name, e.target.value)}
            className="filter-input"
          />
        </div>
      ))}
    </div>
  )
}
