import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'
import filtersReducer from './slices/filtersSlice'
import { apiSlice } from '../api/apiSlice'

const appRootReducer = combineReducers({
  counter: counterReducer,
  ui: uiReducer,
  users: usersReducer,
  filters: filtersReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

export const store = configureStore({
  reducer: appRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof appRootReducer>
export type AppDispatch = typeof store.dispatch