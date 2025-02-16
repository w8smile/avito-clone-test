import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { fetchItemById, fetchItems } from '../src/store/itemsSlice'

const mock = new MockAdapter(axios)

describe('itemsSlice', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        items: require('../src/store/itemsSlice').default,
      },
    })
  })

  afterEach(() => {
    mock.reset()
  })

  test('должен вернуть начальное состояние', () => {
    const initialState = {
      items: [],
      currentItem: null,
      loading: false,
      error: null,
    }

    expect(store.getState().items).toEqual(initialState)
  })

  test('должен успешно загружать список элементов', async () => {
    const itemsData = [
      { id: 1, name: 'Item 1', description: 'Desc 1', location: 'Moscow', type: 'Недвижимость' },
      { id: 2, name: 'Item 2', description: 'Desc 2', location: 'SPB', type: 'Авто' },
    ]

    mock.onGet('http://localhost:3000/items').reply(200, itemsData)

    await store.dispatch(fetchItems())

    const state = store.getState().items
    expect(state.items).toEqual(itemsData)
    expect(state.loading).toBe(false)
  })

  test('должен обрабатывать ошибку при загрузке списка элементов', async () => {
    mock.onGet('http://localhost:3000/items').reply(500)

    await store.dispatch(fetchItems())

    const state = store.getState().items
    expect(state.error).toBe('Ошибка загрузки объявлений')
    expect(state.loading).toBe(false)
  })

  test('должен успешно загружать один элемент по ID', async () => {
    const itemData = { id: 1, name: 'Item 1', description: 'Desc 1', location: 'Moscow', type: 'Недвижимость' }

    mock.onGet('http://localhost:3000/items/1').reply(200, itemData)

    await store.dispatch(fetchItemById('1'))

    const state = store.getState().items
    expect(state.currentItem).toEqual(itemData)
    expect(state.loading).toBe(false)
  })

  test('должен обрабатывать ошибку при загрузке элемента по ID', async () => {
    mock.onGet('http://localhost:3000/items/1').reply(500)

    await store.dispatch(fetchItemById('1'))

    const state = store.getState().items
    expect(state.error).toBe('Ошибка загрузки объявления')
    expect(state.loading).toBe(false)
  })
})
