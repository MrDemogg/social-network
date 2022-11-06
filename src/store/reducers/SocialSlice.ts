import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {IGetPosts} from "../../models/IGetPosts";

interface SocialState {
  name: string,
  surname: string,
  posts: IGetPosts[],
  error: null | string
}

const initialState: SocialState = {
  name: '',
  surname: '',
  posts: [],
  error: null
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
    }
  }
})

export default socialSlice.reducer