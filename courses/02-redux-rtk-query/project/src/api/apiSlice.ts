import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface User {
  id: number
  name: string
  email: string
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Users', 'Posts'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Posts'],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Posts', id }],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Posts'],
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.unshift({
              id: Date.now(),
              title: newPost.title ?? '',
              body: newPost.body ?? '',
              userId: newPost.userId ?? 1,
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