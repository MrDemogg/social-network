import { combineReducers, configureStore } from '@reduxjs/toolkit'
import socialReducer from './reducers/SocialSlice'

const rootReducer = combineReducers({
  socialReducer
})

export const setupStore = (): any => {
  return configureStore({
    reducer: rootReducer
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']