import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchItems } from '../../store/itemsSlice.ts'
import { AppDispatch, RootState } from '../../store'
import { CategoryFilters } from '../CategoryFilters/CategoryFilters.tsx'
import './List.css'
import logo from '../../assets/logo.png'
import img from '../../assets/img.png'

interface Item {
  id: number
  name: string
  type: string
  location: string
  image?: string
  [key: string]: any
}

export const List = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.items)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [additionalFilters, setAdditionalFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    dispatch(fetchItems())
  }, [dispatch])

  if (error) return <div>Error: {error}</div>
  if (loading) return <div>Загрузка...</div>

  const filteredItems = items.filter((item: Item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? item.type === selectedCategory : true

    const matchesAdditionalFilters = Object.entries(additionalFilters).every(([key, value]) => {
      const itemValue = item[key]

      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }
      if (typeof itemValue === 'number') {
        return itemValue.toString().includes(value)
      }
      return false
    })

    return matchesSearch && matchesCategory && matchesAdditionalFilters
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <div className="list-container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
            setAdditionalFilters({})
          }}
        >
          <option value="">Все категории</option>
          <option value="Недвижимость">Недвижимость</option>
          <option value="Авто">Авто</option>
          <option value="Услуги">Услуги</option>
        </select>
      </div>

      {}
      <CategoryFilters selectedCategory={selectedCategory} onChange={setAdditionalFilters} />

      <div className="grid">
        {currentItems.slice(0, 3).map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image || img} alt="Фото" className="item-image" />
            <h3>{item.name}</h3>
            <p>{item.location}</p>
            <p>{item.type}</p>
            <Link to={`/item/${item.id}`}>
              <button>Открыть</button>
            </Link>
          </div>
        ))}
      </div>

      <div className="second-row">
        {currentItems.slice(3, 5).map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image || img} alt="Фото" className="item-image" />
            <h3>{item.name}</h3>
            <p>{item.location}</p>
            <p>{item.type}</p>
            <Link to={`/item/${item.id}`}>
              <button>Открыть</button>
            </Link>
          </div>
        ))}
        <div className="logo-card">
          <a href="https://avito.tech/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Логотип" />
          </a>
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Назад
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  )
}
