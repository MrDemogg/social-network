import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {IProfile} from "../models/IProfile";
import {IProfileChange} from "../models/IProfileChange";
import {IGetPosts} from "../models/IGetPosts";
import {IPostPosts} from "../models/IPostPosts";
import {ISubscribe} from "../models/ISubscribe";
import {IProfilePost} from "../models/IProfilePost";

export const socialAPI = createApi({
  reducerPath: 'socialAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (build) => ({
    profilePost: build.mutation<string, IProfilePost>({
      query: (profile: IProfilePost) => ({
        url: '/profile',
        method: 'GET',
        params: {
          name: profile.name,
          surname: profile.surname,
          mail: profile.mail ? profile.mail : null
        },
        responseHandler: (response) => response.text()
      })
    }),
    changeProfile: build.mutation<string, IProfileChange>({
      query: (request) => ({
        url: '/profile',
        method: 'POST',
        body: request,
        responseHandler: (response) => response.text()
      })
    }),
    fetchAllPosts: build.mutation<IGetPosts[], IProfile>({
      query: (profile) => ({
        url: '/posts',
        method: 'GET',
        params: {
          name: profile.name,
          surname: profile.surname
        },
        responseHandler: response => response.text()
      })
    }),
    post: build.mutation<string, IPostPosts>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
        responseHandler: (response) => response.text()
      })
    }),
    subscribe: build.mutation<string, ISubscribe>({
      query: (subscribe) => ({
        url: '/subscribe',
        method: 'POST',
        body: subscribe,
        responseHandler: (response) => response.text()
      })
    }),
    subsDelete: build.mutation<string, IProfile>({
      query: (profile) => ({
        url: '/subscribe/delete',
        method: 'POST',
        body: profile,
        responseHandler: (response) => response.text()
      })
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