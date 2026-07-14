interface ErrorDisplayProps {
  error?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ error = 'Something went wrong.', onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display">
      <p>{error}</p>
      <button type="button" data-testid="retry-btn" onClick={onRetry}>Retry</button>
    </div>
  )
}