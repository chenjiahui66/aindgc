<script setup lang="ts">
import { computed } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
  autosize?: boolean | { minRows: number; maxRows: number }
  maxlength?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  autosize: true,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'blur', evt: FocusEvent): void
}>()

const elSize = computed(() => {
  if (props.size === 'sm') return 'small'
  if (props.size === 'lg') return 'large'
  return 'default'
})

function onInput(v: string | number) {
  emit('update:modelValue', String(v))
}
</script>

<template>
  <ElInput
    type="textarea"
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :autosize="autosize"
    :maxlength="maxlength"
    :show-word-limit="showCount && !!maxlength"
    :size="elSize as 'small' | 'default' | 'large'"
    :class="['a-textarea', { block }]"
    @update:model-value="onInput"
    @blur="(e: FocusEvent) => emit('blur', e)"
  />
</template>

<style scoped>
/* Full-width by default so it lines up with the label above, matching AInput. */
.a-textarea :deep(.el-textarea) {
  width: 100%;
  display: block;
}
</style>
