export interface BaseItem {
  id: number
  name: string
  description: string
  location: string
  type: 'Недвижимость' | 'Авто' | 'Услуги'
  image?: string
}

export interface RealEstateItem extends BaseItem {
  type: 'Недвижимость'
  propertyType: string
  area: number
  rooms: number
  price: number
}

export interface CarItem extends BaseItem {
  type: 'Авто'
  brand: string
  model: string
  year: number
  mileage?: number
}

export interface ServiceItem extends BaseItem {
  type: 'Услуги'
  serviceType: string
  experience: number
  cost: number
  workSchedule?: string
}

export type Item = RealEstateItem | CarItem | ServiceItem
