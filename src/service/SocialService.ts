import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import {IProfile} from "../models/IProfile";
import {IProfileChange} from "../models/IProfileChange";
import {IGetPosts} from "../models/IGetPosts";
import {IPostPosts} from "../models/IPostPosts";
import {ISubscribe} from "../models/ISubscribe";

export const socialAPI = createApi({
  reducerPath: 'socialAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Req'],
  endpoints: (build) => ({
    login: build.mutation<string, IProfile>({
      query: (profile) => ({
        url: '/profile',
        method: 'GET',
        body: profile
      }),
      invalidatesTags: ['Req']
    }),
    changeProfile: build.mutation<string, IProfileChange>({
      query: (request) => ({
        url: '/profile',
        method: 'POST',
        body: request,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: ['Req']
    }),
    fetchAllPosts: build.query<IGetPosts, IProfile>({
      query: (profile) => ({
        url: '/posts',
        method: 'GET',
        body: profile,
        responseHandler: (response) => response.text()
      }),
      providesTags: result => ['Req']
    }),
    post: build.mutation<string, IPostPosts>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: ['Req']
    }),
    subscribe: build.mutation<string, ISubscribe>({
      query: (subscribe) => ({
        url: '/subscribe',
        method: 'POST',
        body: subscribe,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: ['Req']
    }),
    subsDelete: build.mutation<string, IProfile>({
      query: (profile) => ({
        url: '/subscribe/delete',
        method: 'POST',
        body: profile,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: ['Req']
    }),
    fetchAllSubs: build.query<string[], IProfile>({
      query: (profile) => ({
        url: '/subscribe',
        method: 'GET',
        body: profile,
        responseHandler: (response) => response.text()
      })
    })
  })
})