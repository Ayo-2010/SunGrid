<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    prefix?: string
    inputId?: string
    autocomplete?: string
    inputmode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal' | 'url' | 'search'
    min?: string | number
    max?: string | number
    step?: string | number
    maxlength?: number
    name?: string
  }>(),
  { type: 'text' },
)

const model = defineModel<string | number>({ default: '' })
const generatedId = useId()
const id = computed(() => props.inputId ?? `field-${generatedId}`)
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
      <span
        v-if="prefix"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-forest-900/10 pl-3 pr-2.5 text-sm font-medium text-muted"
      >
        {{ prefix }}
      </span>
      <input
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : hint ? `${id}-hint` : undefined"
        class="field-base"
        :class="[prefix ? 'pl-16' : '', error ? '!border-red-600 !bg-red-50/40' : '']"
      />
    </div>

    <p v-if="error" :id="errorId" class="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-700">
      <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1.5 text-xs leading-5 text-muted">{{ hint }}</p>
  </div>
</template>
