<script setup lang="ts">
import { contactSchema, zodErrors } from '~/utils/validation'

const toast = useToast()
const { add } = useDemoMessages()

const subjects = [
  'New solar system',
  'Product availability',
  'Installation or service',
  'Support with an existing system',
  'Partnership or supplier enquiry',
  'Something else',
]

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
})

const errors = ref<Record<string, string>>({})
const submitted = ref(false)
const reference = ref('')

function submit() {
  const parsed = contactSchema.safeParse(form)
  if (!parsed.success) {
    errors.value = zodErrors(parsed.error)
    toast.add({ title: 'Please check the form', description: 'Some required information is missing or invalid.', color: 'error' })
    return
  }
  const message = add({
    channel: 'contact',
    name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? '',
    subject: parsed.data.subject,
    body: parsed.data.message,
  })
  reference.value = message.reference
  errors.value = {}
  submitted.value = true
  toast.add({
    title: 'Demo message saved',
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
  form.subject = ''
  form.message = ''
  form.consent = false
  form.website = ''
  errors.value = {}
}
</script>

<template>
  <div>
    <div v-if="submitted" class="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft sm:p-8" role="status">
      <span class="grid size-11 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
        <UIcon name="i-lucide-check" class="size-5" aria-hidden="true" />
      </span>
      <h2 class="mt-4 font-display text-xl font-bold text-ink">Message saved in this browser</h2>
      <p class="mt-2 text-[12.5px] leading-6 text-muted">
        Reference <strong class="font-semibold text-ink">{{ reference }}</strong>. This demo has no backend:
        nothing was emailed or sent to SunGrid Energy. The message appears under
        <NuxtLink to="/admin/content" class="font-medium text-forest-800 underline underline-offset-2">demo content → messages</NuxtLink>.
      </p>
      <div class="mt-5 flex flex-wrap gap-2">
        <AppButton size="sm" variant="outline" icon="i-lucide-rotate-ccw" @click="reset">Write another message</AppButton>
        <AppButton size="sm" to="/admin/content" variant="ghost" icon-right="i-lucide-arrow-right">View in demo dashboard</AppButton>
      </div>
    </div>

    <form v-else class="space-y-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
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
          v-model="form.subject"
          label="Subject"
          :options="subjects.map((value) => ({ value, label: value }))"
          placeholder="What is this about?"
          required
          :error="errors.subject"
        />
      </div>

      <AppTextarea
        v-model="form.message"
        label="Message"
        placeholder="Tell us what you need help with. Include the system size, equipment or symptoms where relevant."
        :rows="5"
        :maxlength="2000"
        required
        :error="errors.message"
      />

      <AppCheckbox v-model="form.consent" :error="errors.consent">
        I agree that this demo may store this message in my browser. I have read the
        <NuxtLink to="/privacy" class="font-medium text-forest-800 underline underline-offset-2">privacy notice</NuxtLink>.
      </AppCheckbox>

      <div class="hidden" aria-hidden="true">
        <label for="contact-website">Website</label>
        <input id="contact-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/[0.08] pt-4">
        <p class="max-w-xs text-[9.5px] leading-4 text-muted">
          Stored locally only. Do not send passwords, card details or sensitive documents.
        </p>
        <AppButton type="submit" icon-right="i-lucide-send">Send demo message</AppButton>
      </div>
    </form>
  </div>
</template>
