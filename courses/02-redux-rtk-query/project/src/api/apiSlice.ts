import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'
import type { User, Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Users', 'Posts'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        const data = await mockApi.getUsers()
        return { data }
      },
      providesTags: ['Users'],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        const data = await mockApi.getPosts()
        return { data }
      },
      providesTags: ['Posts'],
    }),
    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        const data = await mockApi.getPostById(id)
        return { data }
      },
      providesTags: (_result, _error, id) => [{ type: 'Posts', id }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => {
        const data = await mockApi.createPost(newPost)
        return { data }
      },
      invalidatesTags: ['Posts'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = apiSlice