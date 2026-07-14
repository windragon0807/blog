import { DataTable } from '@/components/data-table'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

const tableColumns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'email', header: 'Email' },
] as const
const tableRows = [
  { name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
  { name: 'Michael Brown', role: 'CFO', status: 'Active', email: 'michael@acme.com' },
]

export function DataTablePreview() {
  return (
    <PreviewDemoSurface
      label="data structure"
      title="Typed Data Table"
      subtitle="scan sortable rows"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.24),transparent_55%)]"
      contentClassName="max-w-5xl"
    >
      <DataTable columns={tableColumns} rows={tableRows} variant="dark" className="w-full max-w-4xl" />
    </PreviewDemoSurface>
  )
}
