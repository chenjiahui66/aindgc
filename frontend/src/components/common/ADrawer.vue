<script setup lang="ts">
import { ElDrawer } from 'element-plus'

interface Props {
  modelValue: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: string | number
  withHeader?: boolean
  showClose?: boolean
  closeOnPressEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right',
  size: '480px',
  withHeader: true,
  showClose: true,
  closeOnPressEscape: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()
</script>

<template>
  <ElDrawer
    :model-value="modelValue"
    :title="title"
    :direction="placement"
    :size="placement === 'left' || placement === 'right' ? size : size"
    :with-header="withHeader"
    :show-close="showClose"
    :close-on-press-escape="closeOnPressEscape"
    class="a-drawer"
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
  </ElDrawer>
</template>

<style scoped>
.a-drawer :deep(.el-drawer__header) {
  padding: var(--space-5) var(--space-6);
  margin: 0;
  border-bottom: 1px solid var(--border-subtle);
}
.a-drawer :deep(.el-drawer__title) {
  font-size: var(--fs-body-lg);
  font-weight: 600;
}
.a-drawer :deep(.el-drawer__body) {
  padding: var(--space-5) var(--space-6);
}
</style>
