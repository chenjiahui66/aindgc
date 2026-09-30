<script setup lang="ts">
import { computed } from 'vue'
import { ElInput } from 'element-plus'
import AIcon from './AIcon.vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'tel'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  id?: string
  maxlength?: number
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  type: 'text'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'blur', evt: FocusEvent): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'enter', evt: KeyboardEvent): void
  (e: 'clear'): void
}>()

const elSize = computed(() => {
  if (props.size === 'sm') return 'small'
  if (props.size === 'lg') return 'large'
  return 'default'
})

function onInput(v: string | number) {
  emit('update:modelValue', v)
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="a-input-wrap" :class="[`s-${size}`, { block }]">
    <ElInput
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :size="elSize as 'small' | 'default' | 'large'"
      :id="id"
      :maxlength="maxlength"
      :show-word-limit="showCount && !!maxlength"
      :class="['a-input', { 'has-prefix': !!prefixIcon, 'has-suffix': !!suffixIcon }]"
      @update:model-value="onInput"
      @blur="(e: FocusEvent) => emit('blur', e)"
      @focus="(e: FocusEvent) => emit('focus', e)"
      @keyup.enter="(e: KeyboardEvent) => emit('enter', e)"
      @clear="onClear"
    >
      <template v-if="prefixIcon" #prefix>
        <AIcon :name="prefixIcon" :size="16" />
      </template>
      <template v-if="suffixIcon" #suffix>
        <AIcon :name="suffixIcon" :size="16" />
      </template>
    </ElInput>
  </div>
</template>

<style scoped>
/* Full-width by default: AInput is used inside vertical Stack forms where the
   input must line up with the label above it, not shrink to content. */
.a-input-wrap {
  display: flex;
  align-items: center;
  width: 100%;
}
.a-input-wrap :deep(.el-input) {
  width: 100%;
}
</style>
