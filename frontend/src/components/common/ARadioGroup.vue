<script setup lang="ts" generic="T extends string | number | boolean">
import { ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'

interface Option {
  label: string
  value: T
  disabled?: boolean
}

interface Props {
  modelValue?: T
  options: Option[]
  buttonStyle?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: T): void
  (e: 'change', v: T): void
}>()

const elSize = (props.size === 'sm' ? 'small' : props.size === 'lg' ? 'large' : 'default') as 'small' | 'default' | 'large'

function onChange(v: T) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <ElRadioGroup
    :model-value="modelValue as unknown as string | number | boolean | undefined"
    :disabled="disabled"
    :size="elSize"
    :class="{ block, 'a-radio-group': true }"
    @update:model-value="(v: unknown) => onChange(v as T)"
    @change="(v: unknown) => onChange(v as T)"
  >
    <template v-if="buttonStyle">
      <ElRadioButton
        v-for="opt in options"
        :key="String(opt.value)"
        :value="opt.value as unknown as string | number | boolean"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </ElRadioButton>
    </template>
    <template v-else>
      <ElRadio
        v-for="opt in options"
        :key="String(opt.value)"
        :value="opt.value as unknown as string | number | boolean"
        :disabled="opt.disabled"
        :border="false"
      >
        {{ opt.label }}
      </ElRadio>
    </template>
  </ElRadioGroup>
</template>

<style scoped>
.block :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
