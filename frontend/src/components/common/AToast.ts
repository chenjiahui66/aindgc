/**
 * AToast — global toast API wrapping ElMessage.
 * Usage:
 *   import { toast } from '@/components/common/AToast'
 *   toast.success('Saved')
 *   toast.error('Failed')
 */
import { ElMessage, type MessageOptions } from 'element-plus'

type ToastType = 'info' | 'success' | 'warning' | 'error'

const baseOptions: Partial<MessageOptions> = {
  duration: 3000,
  showClose: true,
  offset: 64,
  appendTo: 'body',
  customClass: 'a-toast'
}

function show(type: ToastType, message: string, options?: MessageOptions) {
  return ElMessage({
    ...baseOptions,
    ...options,
    message,
    type
  } as MessageOptions)
}

export const toast = {
  info:    (m: string, o?: MessageOptions) => show('info', m, o),
  success: (m: string, o?: MessageOptions) => show('success', m, o),
  warning: (m: string, o?: MessageOptions) => show('warning', m, o),
  error:   (m: string, o?: MessageOptions) => show('error', m, o),
  show:    (m: string, o?: MessageOptions) => show('info', m, o),
  closeAll: () => ElMessage.closeAll()
}

export default toast
