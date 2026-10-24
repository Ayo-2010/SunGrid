<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    label: string
    options: SelectOption[]
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    inputId?: string
    name?: string
  }>(),
  { placeholder: 'Select an option' },
)

const model = defineModel<string>({ default: '' })
const generatedId = useId()
const id = computed(() => props.inputId ?? `select-${generatedId}`)
const errorId = computed(() => `${id.value}-error`)
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 flex items-baseline justify-between gap-3 text-[13px] font-semibold text-ink">
      <span>
        {{ label }}
        <span v-if="required" class="text-red-700" aria-hidden="true">*</span>
        <span v-if="required" class="sr-only">(required)</span>
      </span>
      <span v-if="!required" class="text-[11px] font-normal text-muted">Optional</span>
    </label>

    <div class="relative">
      <select
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :required="required"
        :disabled="disabled"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : hint ? `${id}-hint` : undefined"
        class="field-base appearance-none pr-10"
        :class="[
          model ? 'text-ink' : 'text-[#7b8780]',
          error ? '!border-red-600 !bg-red-50/40' : '',
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <UIcon
        name="i-lucide-chevron-down"
        class="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>

    <p v-if="error" :id="errorId" class="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-700">
      <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1.5 text-xs leading-5 text-muted">{{ hint }}</p>
  </div>
</template>
