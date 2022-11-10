import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {IError} from "../../models/IError";
import {IGetPosts} from "../../models/IGetPosts";

interface SocialState {
  name: string
  surname: string
  errorInfo: IError
  login: boolean
  posts: IGetPosts[]
  loading: boolean
}

const initialState: SocialState = {
  name: '',
  surname: '',
  errorInfo: {
    message: null,
    errorGuilt: 'server'
  },
  login: false,
  posts: [],
  loading: false
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
    setError(state, action: PayloadAction<IError>) {
      state.errorInfo = action.payload
    },
    setPosts(state, actions: PayloadAction<IGetPosts[]>) {
      state.posts = actions.payload
    },
    setLoading(state, actions: PayloadAction<boolean>) {
      state.loading = actions.payload
    }
  }
})

export default socialSlice.reducer