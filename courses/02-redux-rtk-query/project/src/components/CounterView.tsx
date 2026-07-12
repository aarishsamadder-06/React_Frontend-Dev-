import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { increment, decrement } from '../store/slices/counterSlice'

export default function CounterView() {
  const dispatch = useDispatch<AppDispatch>()
  const value = useSelector((state: RootState) => state.counter.value)

  return (
    <div data-testid="counter-view">
      <span data-testid="counter-value">{value}</span>
      <button type="button" data-testid="increment-btn" onClick={() => dispatch(increment())}>+</button>
      <button type="button" data-testid="decrement-btn" onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}