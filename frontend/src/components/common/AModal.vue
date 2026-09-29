<script setup lang="ts">
import { ElDialog } from 'element-plus'
import AIcon from './AIcon.vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string | number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  centered?: boolean
  alignCenter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  centered: false,
  alignCenter: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '760px',
  xl: '960px'
}

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="title"
    :width="width || sizeMap[size]"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :center="centered"
    :align-center="alignCenter"
    :class="['a-modal', `s-${size}`]"
    @update:model-value="(v: boolean) => emit('update:modelValue', v)"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<style scoped>
.a-modal :deep(.el-dialog__header) {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
  margin-right: 0;
}
.a-modal :deep(.el-dialog__title) {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
}
.a-modal :deep(.el-dialog__body) {
  padding: var(--space-6);
}
.a-modal :deep(.el-dialog__footer) {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-subtle);
}
</style>
