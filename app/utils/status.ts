import type { EnquiryStatus, ProjectStage, QuoteStatus } from '#shared/types'

export const enquiryStatusOptions: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal-sent', label: 'Proposal sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export const quoteStatusOptions: { value: QuoteStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

export const stageOptions: { value: ProjectStage; label: string }[] = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'design', label: 'Design' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'installation', label: 'Installation' },
  { value: 'commissioning', label: 'Commissioning' },
  { value: 'complete', label: 'Complete' },
]

export function enquiryStatusLabel(status: EnquiryStatus): string {
  return enquiryStatusOptions.find((option) => option.value === status)?.label ?? status
}

export function quoteStatusLabel(status: QuoteStatus): string {
  return quoteStatusOptions.find((option) => option.value === status)?.label ?? status
}

export function stageLabel(stage: ProjectStage): string {
  return stageOptions.find((option) => option.value === stage)?.label ?? stage
}

export function enquiryStatusTone(status: EnquiryStatus): string {
  return (
    {
      new: 'bg-sky-50 text-sky-800 ring-sky-200',
      contacted: 'bg-amber-50 text-amber-800 ring-amber-200',
      qualified: 'bg-forest-50 text-forest-800 ring-forest-200',
      'proposal-sent': 'bg-violet-50 text-violet-800 ring-violet-200',
      won: 'bg-green-50 text-green-800 ring-green-200',
      lost: 'bg-stone-100 text-stone-600 ring-stone-200',
    }[status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'
  )
}

export function quoteStatusTone(status: QuoteStatus): string {
  return (
    {
      draft: 'bg-stone-100 text-stone-700 ring-stone-200',
      sent: 'bg-sky-50 text-sky-800 ring-sky-200',
      accepted: 'bg-green-50 text-green-800 ring-green-200',
      rejected: 'bg-red-50 text-red-800 ring-red-200',
      expired: 'bg-amber-50 text-amber-800 ring-amber-200',
    }[status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'
  )
}

export function stageTone(stage: ProjectStage): string {
  return (
    {
      assessment: 'bg-stone-100 text-stone-700',
      design: 'bg-violet-100 text-violet-800',
      procurement: 'bg-amber-100 text-amber-800',
      installation: 'bg-sky-100 text-sky-800',
      commissioning: 'bg-forest-100 text-forest-800',
      complete: 'bg-green-100 text-green-800',
    }[stage] ?? 'bg-stone-100 text-stone-700'
  )
}
