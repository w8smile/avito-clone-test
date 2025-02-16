import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface Item {
  id: number
  name: string
  description: string
  location: string
  type: 'Недвижимость' | 'Авто' | 'Услуги'
  image?: string

  propertyType?: string
  area?: number
  rooms?: number
  price?: number
  brand?: string
  model?: string
  year?: number
  mileage?: number
  serviceType?: string
  experience?: number
  cost?: number
  workSchedule?: string
}

interface ItemsState {
  items: Item[]
  currentItem: Item | null
  loading: boolean
  error: string | null
}

const initialState: ItemsState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
}

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const response = await axios.get<Item[]>('http://localhost:3000/items')
  return response.data
})

export const fetchItemById = createAsyncThunk('items/fetchItemById', async (id: string) => {
  const response = await axios.get<Item>(`http://localhost:3000/items/${id}`)
  return response.data
})

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items = [action.payload, ...state.items]
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state) => {
        state.loading = false
        state.error = 'Ошибка загрузки объявлений'
      })

      .addCase(fetchItemById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false
        state.currentItem = action.payload
      })
      .addCase(fetchItemById.rejected, (state) => {
        state.loading = false
        state.error = 'Ошибка загрузки объявления'
      })
  },
})

export const { addItem } = itemsSlice.actions
export default itemsSlice.reducer
