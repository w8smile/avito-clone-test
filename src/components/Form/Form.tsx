import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { addItem } from '../../store/itemsSlice.ts'
import { toast } from 'react-toastify'
import './Form.css'
import { CarItem, Item, RealEstateItem, ServiceItem } from '../../types.ts'

type Errors<T> = {
  [K in keyof T]?: { message: string }
}

interface FormProps {
  isEdit?: boolean
}

export const Form: React.FC<FormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Item>()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const type = watch('type')

  const DRAFT_KEY = 'form-draft'

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      Object.keys(parsedDraft).forEach((key) => {
        setValue(key as keyof Item, parsedDraft[key as keyof Item])
      })
    }
  }, [setValue])

  useEffect(() => {
    const controller = new AbortController()

    if (isEdit && id) {
      axios
        .get(`http://localhost:3000/items/${id}`, { signal: controller.signal })
        .then((res) => {
          const item = res.data
          Object.keys(item).forEach((key) => {
            setValue(key as keyof Item, item[key as keyof Item])
          })
          setLoading(false)
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setError('Ошибка загрузки данных объявления')
            setLoading(false)
          }
        })
    } else {
      setLoading(false)
    }

    return () => {
      controller.abort()
    }
  }, [isEdit, id, setValue])

  const onSubmit: SubmitHandler<Item> = async (data) => {
    const controller = new AbortController()

    try {
      const res = await axios.post('http://localhost:3000/items', data, {
        signal: controller.signal,
      })
      dispatch(addItem(res.data))
      setError(null)
      reset()

      localStorage.removeItem(DRAFT_KEY)

      toast.success('Объявление успешно создано!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      setTimeout(() => {
        navigate('/list')
      }, 3000)
    } catch (err) {
      if (!axios.isCancel(err)) {
        const axiosError = err as AxiosError<{ message: string }>
        setError(axiosError.response?.data?.message || 'Ошибка при создании объявления')

        toast.error('Ошибка при создании объявления', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    }
  }

  const typedErrors = errors as Errors<Item>

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="form-container">
      <h1 className="form-title">{isEdit ? 'Редактировать объявление' : 'Создать объявление'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input
          type="text"
          {...register('name', { required: 'Название обязательно' })}
          placeholder="Название"
          className="form-input"
        />
        {typedErrors.name && <span className="error-message">{typedErrors.name.message}</span>}

        <textarea
          {...register('description', { required: 'Описание обязательно' })}
          placeholder="Описание"
          className="form-textarea"
        />
        {typedErrors.description && <span className="error-message">{typedErrors.description.message}</span>}

        <input
          type="text"
          {...register('location', { required: 'Локация обязательна' })}
          placeholder="Локация"
          className="form-input"
        />
        {typedErrors.location && <span className="error-message">{typedErrors.location.message}</span>}

        <select {...register('type', { required: 'Тип объявления обязателен' })} className="form-select">
          <option value="">Выберите тип</option>
          <option value="Недвижимость">Недвижимость</option>
          <option value="Авто">Авто</option>
          <option value="Услуги">Услуги</option>
        </select>
        {typedErrors.type && <span className="error-message">{typedErrors.type.message}</span>}

        <input type="text" {...register('image')} placeholder="Ссылка на изображение" className="form-input" />

        {type === 'Недвижимость' && (
          <>
            <select {...register('propertyType', { required: 'Тип недвижимости обязателен' })} className="form-select">
              <option value="">Выберите тип недвижимости</option>
              <option value="Квартира">Квартира</option>
              <option value="Дом">Дом</option>
              <option value="Коттедж">Коттедж</option>
              <option value="Офис">Офис</option>
            </select>
            {(typedErrors as Errors<RealEstateItem>).propertyType && (
              <span className="error-message">{(typedErrors as Errors<RealEstateItem>).propertyType?.message}</span>
            )}

            <input
              type="number"
              {...register('area', { required: 'Площадь обязательна', valueAsNumber: true })}
              placeholder="Площадь"
              className="form-input"
            />
            {(typedErrors as Errors<RealEstateItem>).area && (
              <span className="error-message">{(typedErrors as Errors<RealEstateItem>).area?.message}</span>
            )}

            <input
              type="number"
              {...register('rooms', { required: 'Количество комнат обязательно', valueAsNumber: true })}
              placeholder="Комнаты"
              className="form-input"
            />
            {(typedErrors as Errors<RealEstateItem>).rooms && (
              <span className="error-message">{(typedErrors as Errors<RealEstateItem>).rooms?.message}</span>
            )}

            <input
              type="number"
              {...register('price', { required: 'Цена обязательна', valueAsNumber: true })}
              placeholder="Цена"
              className="form-input"
            />
            {(typedErrors as Errors<RealEstateItem>).price && (
              <span className="error-message">{(typedErrors as Errors<RealEstateItem>).price?.message}</span>
            )}
          </>
        )}

        {type === 'Авто' && (
          <>
            <select {...register('brand', { required: 'Марка обязательна' })} className="form-select">
              <option value="">Выберите марку</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="BMW">BMW</option>
              <option value="Audi">Audi</option>
            </select>
            {(typedErrors as Errors<CarItem>).brand && (
              <span className="error-message">{(typedErrors as Errors<CarItem>).brand?.message}</span>
            )}

            <input
              type="text"
              {...register('model', { required: 'Модель обязательна' })}
              placeholder="Модель"
              className="form-input"
            />
            {(typedErrors as Errors<CarItem>).model && (
              <span className="error-message">{(typedErrors as Errors<CarItem>).model?.message}</span>
            )}

            <input
              type="number"
              {...register('year', { required: 'Год выпуска обязателен', valueAsNumber: true })}
              placeholder="Год выпуска"
              className="form-input"
            />
            {(typedErrors as Errors<CarItem>).year && (
              <span className="error-message">{(typedErrors as Errors<CarItem>).year?.message}</span>
            )}

            <input
              type="number"
              {...register('mileage', { valueAsNumber: true })}
              placeholder="Пробег"
              className="form-input"
            />
          </>
        )}

        {type === 'Услуги' && (
          <>
            <select {...register('serviceType', { required: 'Тип услуги обязателен' })} className="form-select">
              <option value="">Выберите тип услуги</option>
              <option value="Ремонт">Ремонт</option>
              <option value="Уборка">Уборка</option>
              <option value="Доставка">Доставка</option>
              <option value="Консультация">Консультация</option>
            </select>
            {(typedErrors as Errors<ServiceItem>).serviceType && (
              <span className="error-message">{(typedErrors as Errors<ServiceItem>).serviceType?.message}</span>
            )}

            <input
              type="number"
              {...register('experience', { required: 'Опыт обязателен', valueAsNumber: true })}
              placeholder="Опыт работы"
              className="form-input"
            />
            {(typedErrors as Errors<ServiceItem>).experience && (
              <span className="error-message">{(typedErrors as Errors<ServiceItem>).experience?.message}</span>
            )}

            <input
              type="number"
              {...register('cost', { required: 'Стоимость обязательна', valueAsNumber: true })}
              placeholder="Стоимость"
              className="form-input"
            />
            {(typedErrors as Errors<ServiceItem>).cost && (
              <span className="error-message">{(typedErrors as Errors<ServiceItem>).cost?.message}</span>
            )}

            <input type="text" {...register('workSchedule')} placeholder="График работы" className="form-input" />
          </>
        )}

        <button type="submit" className="form-submit-btn">
          {isEdit ? 'Сохранить' : 'Создать'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  )
}
