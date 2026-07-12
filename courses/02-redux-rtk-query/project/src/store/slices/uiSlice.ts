import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isLoading: boolean
  modalOpen: boolean
}

const initialState: UIState = {
  isLoading: false,
  modalOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload
    },
  },
})

export const { setLoading, setModalOpen } = uiSlice.actions
export default uiSlice.reducer