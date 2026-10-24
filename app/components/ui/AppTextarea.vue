<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    rows?: number
    maxlength?: number
    inputId?: string
    name?: string
  }>(),
  { rows: 4 },
)

const model = defineModel<string>({ default: '' })
const generatedId = useId()
const id = computed(() => props.inputId ?? `textarea-${generatedId}`)
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 flex items-baseline justify-between gap-3 text-[13px] font-semibold text-ink">
      <span>
        {{ label }}
        <span v-if="required" class="text-red-700" aria-hidden="true">*</span>
        <span v-if="required" class="sr-only">(required)</span>
      </span>
      <span v-if="maxlength" class="text-[11px] font-normal text-muted">{{ model.length }}/{{ maxlength }}</span>
      <span v-else-if="!required" class="text-[11px] font-normal text-muted">Optional</span>
    </label>

    <textarea
      :id="id"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :name="name"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      class="field-base resize-y leading-6"
      :class="error ? '!border-red-600 !bg-red-50/40' : ''"
    />

    <p v-if="error" :id="`${id}-error`" class="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-700">
      <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1.5 text-xs leading-5 text-muted">{{ hint }}</p>
  </div>
</template>
