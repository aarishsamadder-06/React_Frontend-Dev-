import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-loading">Loading users...</div>
  }

  if (isError) {
    return (
      <ErrorDisplay
        error={(error as Error)?.message ?? 'Failed to load users.'}
        onRetry={refetch}
      />
    )
  }

  return (
    <div data-testid="users-list">
      <button type="button" onClick={refetch}>Refresh</button>
      {data?.map((user) => (
        <div key={user.id} data-testid="user-item">
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </div>
      ))}
    </div>
  )
}