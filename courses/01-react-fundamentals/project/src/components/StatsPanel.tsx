interface StatsPanelProps {
  tasks?: { completed: boolean; priority?: string }[]
  total?: number
  completed?: number
}

export default function StatsPanel({ tasks, total, completed }: StatsPanelProps) {
  const totalCount = total ?? tasks?.length ?? 0
  const completedCount = completed ?? tasks?.filter((t) => t.completed).length ?? 0

  return (
    <div id="stats-panel">
      <p>Total: {totalCount}</p>
      <p>Completed: {completedCount}</p>
    </div>
  )
}