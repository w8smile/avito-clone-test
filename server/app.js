const express = require('express')
const bodyParser = require('body-parser')

const ItemTypes = {
  REAL_ESTATE: 'Недвижимость',
  AUTO: 'Авто',
  SERVICES: 'Услуги',
}

const app = express()
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())

// In-memory хранилище для объявлений
let items = [
  {
    id: 1,
    name: 'Квартира в центре',
    description: 'Просторная квартира в центре города',
    location: 'Москва',
    type: 'Недвижимость',
    propertyType: 'Квартира',
    area: 80,
    rooms: 3,
    price: 10000000,
  },
  {
    id: 2,
    name: 'Toyota Camry',
    description: 'Автомобиль в отличном состоянии',
    location: 'Санкт-Петербург',
    type: 'Авто',
    brand: 'Toyota',
    model: 'Camry',
    year: 2018,
    mileage: 50000,
  },
  {
    id: 3,
    name: 'Ремонт квартир',
    description: 'Качественный ремонт под ключ',
    location: 'Екатеринбург',
    type: 'Услуги',
    serviceType: 'Ремонт',
    experience: 10,
    cost: 1000,
  },
  {
    id: 4,
    name: 'Дом за городом',
    description: 'Уютный дом с участком',
    location: 'Казань',
    type: 'Недвижимость',
    propertyType: 'Дом',
    area: 150,
    rooms: 5,
    price: 15000000,
  },
  {
    id: 5,
    name: 'Honda Civic',
    description: 'Экономичный и надежный автомобиль',
    location: 'Новосибирск',
    type: 'Авто',
    brand: 'Honda',
    model: 'Civic',
    year: 2015,
    mileage: 70000,
  },
  {
    id: 6,
    name: 'Уборка помещений',
    description: 'Профессиональная уборка офисов и квартир',
    location: 'Краснодар',
    type: 'Услуги',
    serviceType: 'Уборка',
    experience: 5,
    cost: 500,
  },
  {
    id: 7,
    name: 'Офис в бизнес-центре',
    description: 'Современный офис в центре города',
    location: 'Москва',
    type: 'Недвижимость',
    propertyType: 'Офис',
    area: 120,
    rooms: 1,
    price: 20000000,
  },
  {
    id: 8,
    name: 'BMW X5',
    description: 'Премиальный внедорожник',
    location: 'Санкт-Петербург',
    type: 'Авто',
    brand: 'BMW',
    model: 'X5',
    year: 2020,
    mileage: 20000,
  },
  {
    id: 9,
    name: 'Доставка грузов',
    description: 'Быстрая и надежная доставка',
    location: 'Екатеринбург',
    type: 'Услуги',
    serviceType: 'Доставка',
    experience: 7,
    cost: 300,
  },
  {
    id: 10,
    name: 'Коттедж на берегу озера',
    description: 'Роскошный коттедж с видом на озеро',
    location: 'Сочи',
    type: 'Недвижимость',
    propertyType: 'Коттедж',
    area: 200,
    rooms: 6,
    price: 25000000,
  },
  {
    id: 11,
    name: 'Audi A4',
    description: 'Стильный седан с полным приводом',
    location: 'Казань',
    type: 'Авто',
    brand: 'Audi',
    model: 'A4',
    year: 2019,
    mileage: 30000,
  },
  {
    id: 12,
    name: 'Консультация юриста',
    description: 'Юридические услуги любой сложности',
    location: 'Москва',
    type: 'Услуги',
    serviceType: 'Консультация',
    experience: 15,
    cost: 2000,
  },
  {
    id: 13,
    name: 'Квартира в новостройке',
    description: 'Современная квартира с отделкой',
    location: 'Новосибирск',
    type: 'Недвижимость',
    propertyType: 'Квартира',
    area: 90,
    rooms: 2,
    price: 12000000,
  },
  {
    id: 14,
    name: 'Ford Mustang',
    description: 'Легендарный американский мускулкар',
    location: 'Краснодар',
    type: 'Авто',
    brand: 'Ford',
    model: 'Mustang',
    year: 2017,
    mileage: 40000,
  },
  {
    id: 15,
    name: 'Ремонт бытовой техники',
    description: 'Ремонт холодильников, стиральных машин и другой техники',
    location: 'Екатеринбург',
    type: 'Услуги',
    serviceType: 'Ремонт',
    experience: 8,
    cost: 800,
  },
  {
    id: 16,
    name: 'Пентхаус с панорамным видом',
    description: 'Элитный пентхаус в центре города',
    location: 'Москва',
    type: 'Недвижимость',
    propertyType: 'Пентхаус',
    area: 300,
    rooms: 4,
    price: 50000000,
  },
  {
    id: 17,
    name: 'Mercedes-Benz E-Class',
    description: 'Комфортный бизнес-седан',
    location: 'Санкт-Петербург',
    type: 'Авто',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2021,
    mileage: 10000,
  },
  {
    id: 18,
    name: 'Услуги няни',
    description: 'Профессиональный уход за детьми',
    location: 'Казань',
    type: 'Услуги',
    serviceType: 'Няня',
    experience: 12,
    cost: 1500,
  },
]

const makeCounter = () => {
  let count = 19
  return () => count++
}

const itemsIdCounter = makeCounter()

// Создание нового объявления
app.post('/items', (req, res) => {
  const { name, description, location, type, ...rest } = req.body

  // Validate common required fields
  if (!name || !description || !location || !type) {
    return res.status(400).json({ error: 'Missing required common fields' })
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType || !rest.area || !rest.rooms || !rest.price) {
        return res.status(400).json({ error: 'Missing required fields for Real estate' })
      }
      break
    case ItemTypes.AUTO:
      if (!rest.brand || !rest.model || !rest.year || !rest.mileage) {
        return res.status(400).json({ error: 'Missing required fields for Auto' })
      }
      break
    case ItemTypes.SERVICES:
      if (!rest.serviceType || !rest.experience || !rest.cost) {
        return res.status(400).json({ error: 'Missing required fields for Services' })
      }
      break
    default:
      return res.status(400).json({ error: 'Invalid type' })
  }

  const item = {
    id: itemsIdCounter(),
    name,
    description,
    location,
    type,
    ...rest,
  }

  items.unshift(item)
  res.status(201).json(item)
})

// Получение всех объявлений
app.get('/items', (req, res) => {
  res.json(items)
})

// Получение объявления по его id
app.get('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id, 10))
  if (item) {
    res.json(item)
  } else {
    res.status(404).send('Item not found')
  }
})

// Обновление объявления по его id
app.put('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id, 10))
  if (item) {
    Object.assign(item, req.body)
    res.json(item)
  } else {
    res.status(404).send('Item not found')
  }
})

// Удаление объявления по его id
app.delete('/items/:id', (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id, 10))
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1)
    res.status(204).send()
  } else {
    res.status(404).send('Item not found')
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
