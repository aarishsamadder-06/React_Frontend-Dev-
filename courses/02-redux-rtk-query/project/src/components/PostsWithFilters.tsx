import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { setSortBy, setFilterUserId } from '../store/slices/filtersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsWithFilters() {
  const dispatch = useDispatch<AppDispatch>()
  const { sortBy, filterUserId } = useSelector((state: RootState) => state.filters)
  const { data: posts, isLoading } = useGetPostsQuery()

  const filtered = posts
    ? posts
        .filter((p) => filterUserId === null || p.userId === filterUserId)
        .slice()
        .sort((a, b) => sortBy === 'newest' ? b.id - a.id : a.id - b.id)
    : []

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as 'newest' | 'oldest'))}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <select
          value={filterUserId ?? ''}
          onChange={(e) => dispatch(setFilterUserId(e.target.value ? Number(e.target.value) : null))}
        >
          <option value="">All Users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {filtered.map((post) => (
        <div key={post.id} data-testid="post-item">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  )
}