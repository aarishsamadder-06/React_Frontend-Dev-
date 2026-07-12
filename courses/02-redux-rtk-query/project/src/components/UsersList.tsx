import { useGetUsersQuery } from '../api/apiSlice'

export default function UsersList() {
  const { data, isLoading, isError, refetch } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>
  }

  if (isError) {
    return <div data-testid="users-error">Error loading users.</div>
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