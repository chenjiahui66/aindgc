<script setup lang="ts" generic="T extends string | number | boolean | object">
import { ElSelect, ElOption } from 'element-plus'

interface Option {
  label: string
  value: T
  disabled?: boolean
}

interface Props {
  modelValue?: T | T[]
  options: Option[]
  multiple?: boolean
  clearable?: boolean
  filterable?: boolean
  disabled?: boolean
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: T | T[] | undefined): void
  (e: 'change', v: T | T[] | undefined): void
}>()

const elSize = (props.size === 'sm' ? 'small' : props.size === 'lg' ? 'large' : 'default') as 'small' | 'default' | 'large'

function onChange(v: T | T[]) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <ElSelect
    :model-value="modelValue as unknown as string | number | unknown[] | undefined"
    :multiple="multiple"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :placeholder="placeholder"
    :size="elSize"
    :class="['a-select', { block }]"
    @update:model-value="(v: unknown) => onChange(v as T | T[])"
    @change="(v: unknown) => onChange(v as T | T[])"
  >
    <ElOption
      v-for="opt in options"
      :key="String(opt.value)"
      :label="opt.label"
      :value="opt.value as unknown as string | number | boolean | object"
      :disabled="opt.disabled"
    />
  </ElSelect>
</template>

<style scoped>
.a-select.block :deep(.el-select) {
  width: 100%;
  display: block;
}
</style>
