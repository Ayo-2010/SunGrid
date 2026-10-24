import type { ProjectStage } from '#shared/types'

export interface AdminNavItem {
  label: string
  to: string
  icon: string
  description: string
}

export const adminNav: AdminNavItem[] = [
  { label: 'Overview', to: '/admin', icon: 'i-lucide-layout-dashboard', description: 'Pipeline, activity and quick actions' },
  { label: 'Products', to: '/admin/products', icon: 'i-lucide-package-search', description: 'Catalogue, local pricing and availability' },
  { label: 'Enquiries', to: '/admin/enquiries', icon: 'i-lucide-inbox', description: 'Website quote requests and follow-up' },
  { label: 'Quotations', to: '/admin/quotations', icon: 'i-lucide-file-text', description: 'Draft, send and track quotations' },
  { label: 'Customers', to: '/admin/customers', icon: 'i-lucide-users', description: 'Customer records and project history' },
  { label: 'Installations', to: '/admin/installations', icon: 'i-lucide-hammer', description: 'Delivery stages and site progress' },
  { label: 'Content', to: '/admin/content', icon: 'i-lucide-newspaper', description: 'Form inbox, articles and FAQs' },
  { label: 'Reports', to: '/admin/reports', icon: 'i-lucide-chart-no-axes-combined', description: 'Demo performance and export' },
  { label: 'Team & roles', to: '/admin/team', icon: 'i-lucide-shield-check', description: 'Demo memberships and permission matrix' },
]

export const adminRoles = [
  'Super Administrator',
  'Sales Representative',
  'Technical Engineer',
  'Installation Technician',
  'Content Editor',
] as const

export const adminOwnerOptions = ['Unassigned', 'Tola Adeyemi', 'Ifeoma Nwosu', 'Yusuf Bello', 'Tunde Bakare']

export function installationStageProgress(stage: ProjectStage): number {
  return {
    assessment: 10,
    design: 25,
    procurement: 40,
    installation: 70,
    commissioning: 90,
    complete: 100,
  }[stage]
}

export function nextInstallationStage(stage: ProjectStage): ProjectStage {
  const order: ProjectStage[] = ['assessment', 'design', 'procurement', 'installation', 'commissioning', 'complete']
  const index = order.indexOf(stage)
  return order[Math.min(index + 1, order.length - 1)] ?? 'complete'
}

export interface CsvColumn<T> {
  key: keyof T | string
  label: string
  value?: (row: T) => unknown
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  // Prevent spreadsheet formula injection for exported demo data.
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCell(column.label)).join(',')
  const body = rows.map((row) =>
    columns
      .map((column) =>
        escapeCell(column.value ? column.value(row) : (row as Record<string, unknown>)[column.key as string]),
      )
      .join(','),
  )
  return [header, ...body].join('\r\n')
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): boolean {
  if (!import.meta.client) return false
  try {
    const blob = new Blob([`\uFEFF${toCsv(rows, columns)}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}

export function isoDateToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysIso(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function daysUntil(value: string): number {
  const target = new Date(`${value}T23:59:59`).getTime()
  if (Number.isNaN(target)) return 0
  return Math.ceil((target - Date.now()) / 86_400_000)
}
