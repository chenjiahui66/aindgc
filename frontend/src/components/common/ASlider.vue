<script setup lang="ts">
import { ElSlider } from 'element-plus'

interface Props {
  modelValue?: number | number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  range?: boolean
  showInput?: boolean
  showStops?: boolean
  showTooltip?: boolean
  marks?: Record<number, string>
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  showTooltip: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: number | number[]): void
  (e: 'change', v: number | number[]): void
  (e: 'input', v: number | number[]): void
}>()

function onInput(v: number | number[]) {
  emit('update:modelValue', v)
  emit('input', v)
}
function onChange(v: number | number[]) {
  emit('change', v)
}
</script>

<template>
  <ElSlider
    :model-value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :range="range"
    :show-input="showInput"
    :show-stops="showStops"
    :show-tooltip="showTooltip"
    :marks="marks"
    class="a-slider"
    @update:model-value="onInput"
    @change="onChange"
  />
</template>
