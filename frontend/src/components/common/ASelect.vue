<script setup lang="ts" generic="T extends string | number | boolean | object">
import { ElSelect, ElOption } from 'element-plus'
import { computed } from 'vue'

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

// Element Plus fixes its own value type to (string | number), but this
// component is generic over T and callers legitimately handle booleans,
// objects, and undefined. Emitting the wide shape keeps handler bindings
// type-compatible at every call site.
type ElSelectValue = string | number | boolean | object

const emit = defineEmits<{
  (e: 'update:modelValue', v: ElSelectValue | ElSelectValue[] | undefined): void
  (e: 'change', v: ElSelectValue | ElSelectValue[] | undefined): void
}>()

const elSize = (props.size === 'sm' ? 'small' : props.size === 'lg' ? 'large' : 'default') as 'small' | 'default' | 'large'

// Bound to <ElSelect>, whose handler param is narrower than what onChange
// accepts — adapt in the other direction here.
const handleElUpdate = (v: string | string[] | undefined) => onChange(v)

// ElSelect / ElOption prop types are fixed to (string | number) while this
// component's generic is wider. Bridge the casts in script — `as` inside a
// template attribute is not reliably parseable.
const elValue = computed(() => props.modelValue as unknown as string | number | string[] | undefined)
const elOptions = computed(() => props.options.map(o => ({ ...o, value: o.value as unknown as string | number })))

function onChange(v: ElSelectValue | ElSelectValue[] | undefined) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <ElSelect
    :model-value="elValue"
    :multiple="multiple"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :placeholder="placeholder"
    :size="elSize"
    :class="['a-select', { block }]"
    @update:model-value="handleElUpdate"
    @change="handleElUpdate"
  >
    <ElOption
      v-for="opt in elOptions"
      :key="String(opt.value)"
      :label="opt.label"
      :value="opt.value"
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
