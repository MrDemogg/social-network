import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import {IProfile} from "../models/IProfile";
import {IProfileChange} from "../models/IProfileChange";
import {IGetPosts} from "../models/IGetPosts";

export const socialAPI = createApi({
  reducerPath: 'postAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    login: build.query<string, IProfile>({
      query: (profile) => ({
        url: '/profile',
        method: 'GET',
        body: profile
      })
    }),
    changeProfile: build.mutation<string, IProfileChange>({
      query: (request) => ({
        url: '/profile',
        method: 'POST',
        body: request
      }),
      invalidatesTags: ['Post']
    }),
    fetchPosts: build.query<IGetPosts, IProfile>({
      query: (profile) => ({
        url: '/posts',
        method: 'GET',
        body: profile
      }),
      providesTags: result => ['Post']
    })
  })
})