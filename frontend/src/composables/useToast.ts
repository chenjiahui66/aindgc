import { toast } from '@components/common/AToast'

export function useToast() {
  return {
    info: toast.info,
    success: toast.success,
    warning: toast.warning,
    error: toast.error,
    show: toast.show,
    closeAll: toast.closeAll
  }
}

export { toast }
