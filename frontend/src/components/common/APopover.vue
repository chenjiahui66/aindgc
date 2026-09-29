<script setup lang="ts">
import { ElPopover } from 'element-plus'

interface Props {
  title?: string
  content?: string
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  width?: string | number
  disabled?: boolean
  persistent?: boolean
}

withDefaults(defineProps<Props>(), {
  placement: 'bottom-start',
  trigger: 'click',
  width: 240
})
</script>

<template>
  <ElPopover
    :title="title"
    :width="width"
    :placement="placement"
    :trigger="trigger"
    :disabled="disabled"
    :persistent="persistent"
    class="a-popover"
    popper-class="a-popover-popper"
  >
    <template v-if="$slots.reference" #reference>
      <slot name="reference" />
    </template>
    <template v-else #reference>
      <slot />
    </template>
    <slot v-if="content" />
  </ElPopover>
</template>

<style>
.a-popover-popper {
  background: var(--bg-overlay) !important;
  border: 1px solid var(--border-default) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-lg) !important;
  padding: var(--space-3) !important;
}
</style>
