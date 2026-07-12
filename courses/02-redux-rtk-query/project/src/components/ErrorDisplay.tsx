interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message = 'Something went wrong.', onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display">
      <p>{message}</p>
      <button type="button" data-testid="retry-btn" onClick={onRetry}>Retry</button>
    </div>
  )
}