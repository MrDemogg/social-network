import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import {IProfile} from "../models/IProfile";

export const socialAPI = createApi({
  reducerPath: 'postAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Get'],
  endpoints: (build) => ({
    login: build.query<string, IProfile>({
      query: (profile) => ({
        url: '/profile',
        method: 'GET',
        body: profile
      }),
      providesTags: result => ['Get']
    })
  })
})