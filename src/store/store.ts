import { combineReducers, configureStore } from '@reduxjs/toolkit'
import socialReducer from './reducers/SocialSlice'
import {socialAPI} from "../service/SocialService";

const rootReducer = combineReducers({
  socialReducer,
  [socialAPI.reducerPath]: socialAPI.reducer
})

export const setupStore = (): any => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(socialAPI.middleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']