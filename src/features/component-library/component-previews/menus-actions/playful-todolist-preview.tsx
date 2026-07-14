import { PlayfulTodoList } from '@/components/playful-todolist'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function PlayfulTodoListPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Animated Task List"
      subtitle="check tasks with motion"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.24),transparent_55%)]"
    >
      <PlayfulTodoList />
    </PreviewDemoSurface>
  )
}
