import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'
import type { User, Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        const data = await mockApi.getUsers()
        return { data }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        const data = await mockApi.getPosts()
        return { data }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post' as const, id: 'LIST' }]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),
    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        const data = await mockApi.getPostById(id)
        return { data }
      },
      providesTags: (_result, _error, id) => [{ type: 'Post' as const, id }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => {
        const data = await mockApi.createPost(newPost)
        return { data }
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.unshift({
              id: Date.now(),
              title: newPost.title,
              body: newPost.body,
              userId: newPost.userId,
            })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = apiSlice