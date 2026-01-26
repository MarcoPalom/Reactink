import { message } from 'antd'

// Configuración global de los mensajes
message.config({
  top: 20,
  duration: 3,
  maxCount: 3,
})

// Tipos de toast
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface ToastOptions {
  duration?: number
  key?: string
}

// Función principal para mostrar toasts
const showToast = (type: ToastType, content: string, options?: ToastOptions) => {
  const config = {
    content,
    duration: options?.duration ?? 3,
    key: options?.key,
  }

  switch (type) {
    case 'success':
      return message.success(config)
    case 'error':
      return message.error(config)
    case 'warning':
      return message.warning(config)
    case 'info':
      return message.info(config)
    case 'loading':
      return message.loading(config)
    default:
      return message.info(config)
  }
}

// Funciones específicas para cada tipo
export const toast = {
  success: (content: string, options?: ToastOptions) => showToast('success', content, options),
  error: (content: string, options?: ToastOptions) => showToast('error', content, options),
  warning: (content: string, options?: ToastOptions) => showToast('warning', content, options),
  info: (content: string, options?: ToastOptions) => showToast('info', content, options),
  loading: (content: string, options?: ToastOptions) => showToast('loading', content, options),
  destroy: () => message.destroy(),
}

// Mensajes predefinidos para autenticación
export const authToast = {
  loginSuccess: () => toast.success('¡Bienvenido! Inicio de sesión exitoso'),
  loginError: () => toast.error('Credenciales incorrectas. Verifica tu email y contraseña'),
  loginNetworkError: () => toast.error('Error de conexión. Intenta nuevamente'),
  logout: () => toast.info('Sesión cerrada correctamente'),
  sessionExpired: () => toast.warning('Tu sesión ha expirado. Inicia sesión nuevamente'),
  unauthorized: () => toast.error('No tienes permisos para realizar esta acción'),
}

// Mensajes predefinidos para operaciones CRUD
export const crudToast = {
  createSuccess: (entity: string) => toast.success(`${entity} creado correctamente`),
  createError: (entity: string) => toast.error(`Error al crear ${entity}`),
  updateSuccess: (entity: string) => toast.success(`${entity} actualizado correctamente`),
  updateError: (entity: string) => toast.error(`Error al actualizar ${entity}`),
  deleteSuccess: (entity: string) => toast.success(`${entity} eliminado correctamente`),
  deleteError: (entity: string) => toast.error(`Error al eliminar ${entity}`),
  loadError: (entity: string) => toast.error(`Error al cargar ${entity}`),
}

// Mensajes predefinidos para validaciones
export const validationToast = {
  requiredFields: () => toast.warning('Por favor completa todos los campos requeridos'),
  invalidEmail: () => toast.warning('El formato del email no es válido'),
  invalidPassword: () => toast.warning('La contraseña debe tener al menos 6 caracteres'),
}

export default toast
