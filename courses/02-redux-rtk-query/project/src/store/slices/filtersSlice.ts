import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
  sortBy: 'newest' | 'oldest'
  filterUserId: number | null
}

const initialState: FiltersState = {
  sortBy: 'newest',
  filterUserId: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<'newest' | 'oldest'>) {
      state.sortBy = action.payload
    },
    setFilterUserId(state, action: PayloadAction<number | null>) {
      state.filterUserId = action.payload
    },
  },
})

export const { setSortBy, setFilterUserId } = filtersSlice.actions
export default filtersSlice.reducer