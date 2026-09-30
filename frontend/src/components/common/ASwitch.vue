<script setup lang="ts">
import { ElSwitch } from 'element-plus'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  activeText?: string
  inactiveText?: string
  inlinePrompt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'change', v: boolean): void
}>()

const elSize = (props.size === 'sm' ? 'small' : props.size === 'lg' ? 'large' : 'default') as 'small' | 'default' | 'large'

// ElSwitch types its events as (val: string | number | boolean) even though
// the value is always boolean — accept the wide type and narrow here.
function onChange(val: string | number | boolean) {
  const v = Boolean(val)
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <ElSwitch
    :model-value="modelValue"
    :disabled="disabled"
    :size="elSize"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :inline-prompt="inlinePrompt"
    class="a-switch"
    @update:model-value="onChange"
    @change="onChange"
  />
</template>
