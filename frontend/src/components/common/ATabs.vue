<script setup lang="ts">
import { ElTabs, ElTabPane } from 'element-plus'

interface Tab {
  label: string
  name: string | number
  disabled?: boolean
  lazy?: boolean
}

interface Props {
  modelValue?: string | number
  tabs: Tab[]
  type?: 'card' | 'border-card' | 'line'
  align?: 'left' | 'center' | 'right'
  block?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'line',
  align: 'left'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'tab-click', payload: { name: string | number; tab: Tab }): void
}>()

function onTabClick(name: string | number) {
  emit('update:modelValue', name)
}
</script>

<template>
  <ElTabs
    :model-value="modelValue"
    :type="type"
    :class="['a-tabs', `align-${align}`, { block }]"
    @update:model-value="onTabClick"
    @tab-click="(p: { paneName: string | number }) => emit('tab-click', { name: p.paneName, tab: tabs.find(t => t.name === p.paneName) || { label: '', name: p.paneName } })"
  >
    <ElTabPane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
      :disabled="tab.disabled"
      :lazy="tab.lazy"
    >
      <slot :name="`tab-${tab.name}`" />
    </ElTabPane>
  </ElTabs>
</template>

<style scoped>
.align-center :deep(.el-tabs__nav-wrap)::after { background: transparent; }
.align-center :deep(.el-tabs__header) { justify-content: center; }
.align-right  :deep(.el-tabs__header) { justify-content: flex-end; }
.block :deep(.el-tabs) { width: 100%; }
</style>
