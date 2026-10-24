<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  label?: string
  error?: string
  required?: boolean
  id?: string
}>()

const model = defineModel<boolean>({ default: false })
const generatedId = useId()
const fieldId = computed(() => props.id ?? `checkbox-${generatedId}`)
</script>

<template>
  <div>
    <label :for="fieldId" class="flex cursor-pointer items-start gap-3">
      <input
        :id="fieldId"
        v-model="model"
        type="checkbox"
        :required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${fieldId}-error` : undefined"
        class="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-forest-900/30 accent-forest-800"
      />
      <span class="text-[13px] leading-5 text-ink-soft">
        <slot>{{ label }}</slot>
      </span>
    </label>
    <p v-if="error" :id="`${fieldId}-error`" class="mt-1.5 flex items-start gap-1 pl-7 text-xs font-medium text-red-700">
      <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
  </div>
</template>
