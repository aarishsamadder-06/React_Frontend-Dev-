import { useAppDispatch, useAppSelector } from '../store/hooks'
import { increment, decrement } from '../store/slices/counterSlice'

export default function CounterView() {
  const dispatch = useAppDispatch()
  const value = useAppSelector((state) => state.counter)

  return (
    <div data-testid="counter-view">
      <span data-testid="counter-value">{value}</span>
      <button type="button" data-testid="increment-btn" onClick={() => dispatch(increment())}>Increment</button>
      <button type="button" data-testid="decrement-btn" onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}