// Configuración de la API
// Backend debe estar en 3000; front en 3001. CORS en el backend permite localhost:3001.

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

// Para producción, definir REACT_APP_API_URL (ej: http://tu-servidor.com/api)

// WebSocket URL (para conexiones en tiempo real)
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws').replace('/api', '')

export default API_BASE_URL
