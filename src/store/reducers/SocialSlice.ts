import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {IGetPosts} from "../../models/IGetPosts";

interface SocialState {
  name: string,
  surname: string,
  posts: IGetPosts[],
  error: null | string,
  login: boolean
}

const initialState: SocialState = {
  name: '',
  surname: '',
  posts: [],
  error: null,
  login: false
}

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },
    setSurname(state, action: PayloadAction<string>) {
      state.surname = action.payload
    },
    login(state, action: PayloadAction<boolean>) {
      state.login = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    }
  }
})

export default socialSlice.reducer