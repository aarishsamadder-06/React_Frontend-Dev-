import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { setSearch, setCategory } from '../store/slices/filtersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsWithFilters() {
  const dispatch = useDispatch<AppDispatch>()
  const search = useSelector((state: RootState) => state.filters.search)
  const category = useSelector((state: RootState) => state.filters.category)
  const { data: posts, isLoading } = useGetPostsQuery()

  const filtered = posts?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <input value={search} onChange={(e) => dispatch(setSearch(e.target.value))} placeholder="Search" />
        <input value={category} onChange={(e) => dispatch(setCategory(e.target.value))} placeholder="Category" />
      </div>
      {isLoading && <p>Loading...</p>}
      {filtered.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}