<script setup lang="ts" generic="T extends string | number | boolean">
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

interface Option {
  label: string
  value: T
  disabled?: boolean
}

interface Props {
  modelValue?: T[]
  options?: Option[]
  disabled?: boolean
  min?: number
  max?: number
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'update:modelValue', v: T[]): void
  (e: 'change', v: T[]): void
}>()

function onChange(v: T[]) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <ElCheckboxGroup
    :model-value="modelValue as unknown as Array<string | number | boolean>"
    :disabled="disabled"
    :min="min"
    :max="max"
    :class="['a-checkbox-group', { block }]"
    @update:model-value="(v: unknown) => onChange(v as T[])"
    @change="(v: unknown) => onChange(v as T[])"
  >
    <template v-if="options && options.length">
      <ElCheckbox
        v-for="opt in options"
        :key="String(opt.value)"
        :value="opt.value as unknown as string | number | boolean"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElCheckbox>
    </template>
    <slot v-else />
  </ElCheckboxGroup>
</template>

<style scoped>
.block :deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
