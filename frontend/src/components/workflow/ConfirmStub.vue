<script setup lang="ts">
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import AModal from '@components/common/AModal.vue'

interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<template>
  <AModal :model-value="true" :title="title" size="sm" @update:model-value="(v: boolean) => { if (!v) emit('cancel') }">
    <p style="color: var(--text-secondary); line-height: var(--lh-relaxed);">{{ message }}</p>
    <template #footer>
      <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
        <AButton variant="ghost" size="sm" @click="emit('cancel')">{{ cancelText }}</AButton>
        <AButton variant="danger" size="sm" @click="emit('confirm')">
          {{ confirmText }}
        </AButton>
      </div>
    </template>
  </AModal>
</template>
