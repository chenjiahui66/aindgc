<script setup lang="ts">
import { ElTooltip } from 'element-plus'

interface Props {
  content?: string
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  disabled?: boolean
  showAfter?: number
  hideAfter?: number
  rawContent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  trigger: 'hover',
  showAfter: 100,
  hideAfter: 0
})
</script>

<template>
  <ElTooltip
    :content="content"
    :placement="placement"
    :trigger="trigger"
    :disabled="disabled"
    :show-after="showAfter"
    :hide-after="hideAfter"
    :raw-content="rawContent"
    class="a-tooltip"
    popper-class="a-tooltip-popper"
  >
    <slot />
  </ElTooltip>
</template>

<style>
.a-tooltip-popper {
  background: var(--surface-3) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-default) !important;
  font-family: var(--font-sans) !important;
  font-size: var(--fs-body-sm) !important;
  padding: 6px 10px !important;
  border-radius: var(--radius-sm) !important;
  box-shadow: var(--shadow-md) !important;
}
.a-tooltip-popper .el-popper__arrow::before {
  background: var(--surface-3) !important;
  border-color: var(--border-default) !important;
}
</style>
