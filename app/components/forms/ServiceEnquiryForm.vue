<script setup lang="ts">
import { serviceEnquirySchema, zodErrors } from '~/utils/validation'

const props = withDefaults(
  defineProps<{
    defaultService?: string
    compact?: boolean
  }>(),
  { defaultService: '', compact: false },
)

const toast = useToast()
const { add } = useDemoMessages()

const services = [
  'New installation',
  'System upgrade or expansion',
  'Fault diagnosis and repair',
  'Maintenance visit',
  'Energy audit',
  'Solar water pumping',
  'Decommission or relocation',
]

const propertyTypes = ['Home / apartment', 'Shop / office', 'Clinic / hospital', 'School / institution', 'Industrial / factory', 'Farm / rural site', 'Other']

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  service: props.defaultService,
  propertyType: '',
  location: '',
  details: '',
  consent: false,
  website: '',
})

const errors = ref<Record<string, string>>({})
const submitted = ref(false)
const reference = ref('')

watch(
  () => props.defaultService,
  (value) => {
    if (value) form.service = value
  },
)

function submit() {
  const parsed = serviceEnquirySchema.safeParse(form)
  if (!parsed.success) {
    errors.value = zodErrors(parsed.error)
    toast.add({ title: 'Please check the form', description: 'Some required information is missing or invalid.', color: 'error' })
    return
  }
  const message = add({
    channel: 'service',
    name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? '',
    subject: parsed.data.service,
    body: parsed.data.details,
    meta: `${parsed.data.propertyType} · ${parsed.data.location}`,
  })
  reference.value = message.reference
  submitted.value = true
  errors.value = {}
  toast.add({
    title: 'Service request saved',
    description: `${message.reference} is stored in this browser only.`,
    color: 'success',
  })
}

function reset() {
  submitted.value = false
  reference.value = ''
  form.fullName = ''
  form.phone = ''
  form.email = ''
  form.service = props.defaultService
  form.propertyType = ''
  form.location = ''
  form.details = ''
  form.consent = false
  form.website = ''
  errors.value = {}
}
</script>

<template>
  <div>
    <div v-if="submitted" class="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft" role="status">
      <span class="grid size-11 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
        <UIcon name="i-lucide-check" class="size-5" aria-hidden="true" />
      </span>
      <h2 class="mt-4 font-display text-xl font-bold text-ink">Service request saved</h2>
      <p class="mt-2 text-[12.5px] leading-6 text-muted">
        Reference <strong class="font-semibold text-ink">{{ reference }}</strong>. Nothing was sent to a server
        and no technician has been scheduled. The request is visible in the
        <NuxtLink to="/admin/content" class="font-medium text-forest-800 underline underline-offset-2">demo dashboard</NuxtLink>
        on this browser.
      </p>
      <div class="mt-5 flex flex-wrap gap-2">
        <AppButton size="sm" variant="outline" icon="i-lucide-rotate-ccw" @click="reset">New request</AppButton>
        <AppButton size="sm" to="/contact" variant="ghost" icon-right="i-lucide-arrow-right">Contact options</AppButton>
      </div>
    </div>

    <form v-else class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4" :class="compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2'">
        <AppInput
          v-model="form.fullName"
          label="Full name"
          autocomplete="name"
          placeholder="e.g. Ada Obi"
          required
          :error="errors.fullName"
        />
        <AppInput
          v-model="form.phone"
          label="Phone number"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="0803 123 4567"
          required
          :error="errors.phone"
        />
        <AppInput
          v-model="form.email"
          label="Email address"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="you@example.com"
          :error="errors.email"
        />
        <AppSelect
          v-model="form.service"
          label="Service needed"
          :options="services.map((value) => ({ value, label: value }))"
          placeholder="Select a service"
          required
          :error="errors.service"
        />
        <AppSelect
          v-model="form.propertyType"
          label="Property type"
          :options="propertyTypes.map((value) => ({ value, label: value }))"
          placeholder="Select a property type"
          required
          :error="errors.propertyType"
        />
        <AppInput
          v-model="form.location"
          label="City / area"
          placeholder="e.g. Wuse 2, Abuja"
          required
          :error="errors.location"
        />
      </div>

      <AppTextarea
        v-model="form.details"
        label="Describe the work required"
        placeholder="What is happening now, what equipment is installed, and when did the problem start?"
        :rows="4"
        :maxlength="1500"
        required
        :error="errors.details"
      />

      <AppCheckbox v-model="form.consent" :error="errors.consent">
        I agree that this demo may store this request in my browser. I have read the
        <NuxtLink to="/privacy" class="font-medium text-forest-800 underline underline-offset-2">privacy notice</NuxtLink>.
      </AppCheckbox>

      <div class="hidden" aria-hidden="true">
        <label for="service-website">Website</label>
        <input id="service-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/[0.08] pt-4">
        <p class="max-w-xs text-[9.5px] leading-4 text-muted">
          Demo form — no booking, dispatch or email is created.
        </p>
        <AppButton type="submit" icon-right="i-lucide-wrench">Save service request</AppButton>
      </div>
    </form>
  </div>
</template>
