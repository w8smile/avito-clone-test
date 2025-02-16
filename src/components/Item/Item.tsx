import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchItemById } from '../../store/itemsSlice.ts'
import './Item.css'
import placeholderImage from '../../assets/img.png'
import { CarItem, RealEstateItem, ServiceItem } from '../../types.ts'

type ItemType = RealEstateItem | CarItem | ServiceItem

export const Item = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentItem, loading, error } = useSelector((state: RootState) => state.items)

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id))
    }
  }, [id, dispatch])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!currentItem) return <div>Объявление не найдено</div>

  const item = currentItem as ItemType

  return (
    <div className="item-container">
      <h1>{item.name}</h1>
      {}
      <img src={item.image || placeholderImage} alt={item.name} className="item-image" />
      <p>
        <strong>Описание:</strong> {item.description}
      </p>
      <p>
        <strong>Локация:</strong> {item.location}
      </p>
      <p>
        <strong>Тип:</strong> {item.type}
      </p>

      {item.type === 'Недвижимость' && (
        <>
          <p>
            <strong>Тип недвижимости:</strong> {item.propertyType}
          </p>
          <p>
            <strong>Площадь:</strong> {item.area} м²
          </p>
          <p>
            <strong>Комнат:</strong> {item.rooms}
          </p>
          <p>
            <strong>Цена:</strong> {item.price} ₽
          </p>
        </>
      )}

      {item.type === 'Авто' && (
        <>
          <p>
            <strong>Марка:</strong> {item.brand}
          </p>
          <p>
            <strong>Модель:</strong> {item.model}
          </p>
          <p>
            <strong>Год выпуска:</strong> {item.year}
          </p>
          {item.mileage && (
            <p>
              <strong>Пробег:</strong> {item.mileage} км
            </p>
          )}
        </>
      )}

      {item.type === 'Услуги' && (
        <>
          <p>
            <strong>Тип услуги:</strong> {item.serviceType}
          </p>
          <p>
            <strong>Опыт:</strong> {item.experience} лет
          </p>
          <p>
            <strong>Стоимость:</strong> {item.cost} ₽
          </p>
          {item.workSchedule && (
            <p>
              <strong>График работы:</strong> {item.workSchedule}
            </p>
          )}
        </>
      )}

      <div className="button-container">
        <Link to={`/edit/${item.id}`}>
          <button className="edit-button">Редактировать</button>
        </Link>
      </div>
    </div>
  )
}
