import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import {IProfile} from "../models/IProfile";
import {IProfileChange} from "../models/IProfileChange";

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
    }),
    changeProfile: build.mutation<string, IProfileChange>({
      query: (request) => ({
        url: '/profile',
        method: 'POST',
        body: request
      })
    })
  })
})