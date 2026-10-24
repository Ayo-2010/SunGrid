<script setup lang="ts">
import type { TeamMember } from '#shared/types'
import { roleMatrix } from '~/data/admin'
import { adminRoles } from '~/utils/admin'

definePageMeta({ layout: 'admin' })

usePageMeta({
  title: 'Admin team & roles',
  description: 'Demonstration team management and permission matrix. No authentication exists; role changes are local mock actions.',
  noindex: true,
})

const admin = useAdminData()
const toast = useToast()

const inviteOpen = ref(false)
const errors = reactive<Record<string, string>>({})

const form = reactive({
  name: '',
  email: '',
  role: 'Sales Representative' as string,
})

const team = computed(() => admin.state.value.team)

const activeCount = computed(() => team.value.filter((member) => member.status === 'active').length)
const invitedCount = computed(() => team.value.filter((member) => member.status === 'invited').length)
const disabledCount = computed(() => team.value.filter((member) => member.status === 'disabled').length)

const roles = computed(() => Array.from(new Set([...adminRoles, ...team.value.map((member) => member.role)])))

const matrixColumns = ['Super Admin', 'Admin', 'Sales', 'Engineer', 'Technician', 'Editor']

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function openInvite() {
  clearErrors()
  form.name = ''
  form.email = ''
  form.role = 'Sales Representative'
  inviteOpen.value = true
}

function validate(): boolean {
  clearErrors()
  if (!form.name.trim()) errors.name = 'Enter a name.'
  if (!form.email.trim()) errors.email = 'Enter an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  else if (team.value.some((member) => member.email.toLowerCase() === form.email.trim().toLowerCase())) errors.email = 'That email is already on the demo team.'
  return Object.keys(errors).length === 0
}

function invite() {
  if (!validate()) return
  const member = admin.inviteMember(form.name, form.email, form.role)
  inviteOpen.value = false
  toast.add({
    title: `${member.name} added as invited`,
    description: 'No email invitation was sent. The record is stored in this browser.',
    color: 'success',
  })
}

function changeRole(member: TeamMember, event: Event) {
  const target = event.target as HTMLSelectElement
  admin.updateMember(member.id, { role: target.value })
  toast.add({ title: 'Role updated locally', description: `${member.name} is shown as ${target.value}. No permissions changed.`, color: 'success' })
}

function toggleStatus(member: TeamMember) {
  const next = member.status === 'active' ? 'disabled' : 'active'
  admin.updateMember(member.id, { status: next, lastActive: next === 'active' ? new Date().toISOString() : member.lastActive })
  toast.add({
    title: next === 'disabled' ? `${member.name} disabled` : `${member.name} activated`,
    description: 'Demo membership status only. No authentication is affected.',
    color: 'success',
  })
}

function remove(member: TeamMember) {
  if (!import.meta.client) return
  if (!window.confirm(`Remove ${member.name} from the demo team? This only affects this browser.`)) return
  admin.removeMember(member.id)
  toast.add({ title: 'Demo member removed', description: `${member.name} no longer appears in this workspace.`, color: 'success' })
}

function statusTone(status: TeamMember['status']): 'success' | 'warning' | 'neutral' {
  if (status === 'active') return 'success'
  if (status === 'invited') return 'warning'
  return 'neutral'
}

function exportCsv() {
  const ok = downloadCsv('sungrid-demo-team.csv', team.value, [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'lastActive', label: 'Last active' },
  ])
  toast.add({
    title: ok ? 'CSV exported' : 'Export unavailable',
    description: ok ? `${team.value.length} team records exported.` : 'Your browser blocked the download.',
    color: ok ? 'success' : 'warning',
  })
}
</script>

<template>
  <div class="space-y-5">
    <AdminPageHeader
      eyebrow="Access"
      title="Team & roles"
      description="Illustrative team management for the prototype. There is no sign-in, session or real permission enforcement — the matrix explains intended access, not actual security."
      badge="No authentication"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" icon="i-lucide-download" @click="exportCsv">Export CSV</AppButton>
        <AppButton size="sm" icon="i-lucide-user-plus" @click="openInvite">Invite member</AppButton>
      </template>
    </AdminPageHeader>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Team members" :value="String(team.length)" icon="i-lucide-users" hint="Demo records" />
      <AdminStatCard label="Active" :value="String(activeCount)" icon="i-lucide-circle-check" hint="Shown as active" />
      <AdminStatCard label="Invited" :value="String(invitedCount)" icon="i-lucide-mail-plus" hint="No email sent" />
      <AdminStatCard label="Disabled" :value="String(disabledCount)" icon="i-lucide-user-round-x" hint="Local status only" />
    </div>

    <AdminPanel title="Members" description="Role changes update the label in this browser. They do not grant or remove real access." :padded="false">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[52rem] text-left">
          <caption class="sr-only">Demo team members and roles</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" class="px-4 py-2.5 font-semibold">Member</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Role</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
              <th scope="col" class="px-4 py-2.5 font-semibold">Last active</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="member in team" :key="member.id" class="hover:bg-cream-deep/20">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <span class="grid size-7 shrink-0 place-items-center rounded-full bg-forest-900 text-[9px] font-bold text-solar-300">
                    {{ initials(member.name) }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-[11px] font-semibold text-ink">
                      {{ member.name }}
                      <span v-if="member.id === 'tm-1'" class="ml-1 rounded bg-solar-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-solar-900">You</span>
                    </p>
                    <p class="truncate text-[9.5px] text-muted">{{ member.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <select
                  :id="`member-role-${member.id}`"
                  :value="member.role"
                  class="field-base !w-auto !py-1 text-[10.5px]"
                  :disabled="member.id === 'tm-1'"
                  :aria-label="`Role for ${member.name}`"
                  @change="changeRole(member, $event)"
                >
                  <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                </select>
              </td>
              <td class="px-4 py-3">
                <AppBadge :tone="statusTone(member.status)">{{ member.status }}</AppBadge>
              </td>
              <td class="px-4 py-3 text-[10px] text-muted">
                {{ member.lastActive === '—' ? '—' : relativeTime(member.lastActive) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="member.id !== 'tm-1'"
                    type="button"
                    class="text-[9.5px] font-medium text-muted underline underline-offset-2 hover:text-forest-700"
                    @click="toggleStatus(member)"
                  >
                    {{ member.status === 'active' ? 'Disable' : 'Activate' }}
                  </button>
                  <button
                    v-if="member.id !== 'tm-1'"
                    type="button"
                    class="text-[9.5px] font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
                    @click="remove(member)"
                  >
                    Remove
                  </button>
                  <span v-if="member.id === 'tm-1'" class="text-[9px] text-muted">Current demo user</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminPanel>

    <AdminPanel
      title="Role matrix"
      description="Intended permission model for a future backend. It is documentation only and is not enforced anywhere in this prototype."
    >
      <template #actions>
        <AppBadge tone="warning">Illustrative</AppBadge>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[46rem] text-left">
          <caption class="sr-only">Illustrative role permission matrix</caption>
          <thead>
            <tr class="border-b border-forest-900/[0.07] text-[9.5px] uppercase tracking-[0.08em] text-muted">
              <th scope="col" class="py-2.5 pr-4 font-semibold">Permission</th>
              <th v-for="column in matrixColumns" :key="column" scope="col" class="px-2 py-2.5 text-center font-semibold">{{ column }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-forest-900/[0.06]">
            <tr v-for="row in roleMatrix" :key="row.permission">
              <th scope="row" class="py-2.5 pr-4 text-[10.5px] font-medium text-ink-soft">{{ row.permission }}</th>
              <td v-for="column in matrixColumns" :key="column" class="px-2 py-2.5 text-center">
                <UIcon
                  :name="row.roles.includes(column) ? 'i-lucide-check' : 'i-lucide-minus'"
                  class="size-3.5"
                  :class="row.roles.includes(column) ? 'text-forest-600' : 'text-muted/30'"
                  :aria-label="row.roles.includes(column) ? `${column} allowed` : `${column} not allowed`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2.5">
        <UIcon name="i-lucide-shield-alert" class="mt-0.5 size-4 shrink-0 text-amber-800" aria-hidden="true" />
        <p class="text-[10.5px] leading-5 text-amber-950">
          <strong class="font-semibold">Security note:</strong>
          anyone with the URL can open this dashboard. Do not reuse this layout with real customer data until authentication, authorisation and audit logging are implemented server-side.
        </p>
      </div>
    </AdminPanel>

    <AdminModal
      v-model:open="inviteOpen"
      title="Invite a demo member"
      description="Adds a local record with an “invited” status. No email is sent and no account is created."
      size="md"
    >
      <form class="space-y-3" @submit.prevent="invite">
        <AppInput v-model="form.name" label="Full name" required :error="errors.name" placeholder="e.g. Zainab Lawal" />
        <AppInput v-model="form.email" label="Email" type="email" inputmode="email" required :error="errors.email" placeholder="name@sungrid.example.com" hint="Use a fictional address. Nothing is delivered." />
        <div>
          <label for="invite-role" class="mb-1.5 block text-[13px] font-semibold text-ink">Role</label>
          <select id="invite-role" v-model="form.role" class="field-base text-[13px]">
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
          <p class="mt-1.5 text-xs leading-5 text-muted">The role is a label only; no permissions are applied.</p>
        </div>
      </form>

      <template #footer>
        <AppButton variant="ghost" size="sm" @click="inviteOpen = false">Cancel</AppButton>
        <AppButton size="sm" icon="i-lucide-user-plus" @click="invite">Add invited member</AppButton>
      </template>
    </AdminModal>
  </div>
</template>
