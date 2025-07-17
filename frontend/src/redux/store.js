import { configureStore } from '@reduxjs/toolkit'
import { actpReducer } from './actp'
export const store = configureStore({
  reducer: {
    value:actpReducer
  },
})