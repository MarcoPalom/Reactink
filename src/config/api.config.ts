// Configuración de la API
// Cambia esta URL según el entorno (desarrollo/producción)

// Para desarrollo local:
export const API_BASE_URL = 'http://localhost:3000/api'

// Para producción (descomentar cuando se despliegue):
// export const API_BASE_URL = 'http://62.72.51.60/api'

// WebSocket URL (para conexiones en tiempo real)
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws').replace('/api', '')

export default API_BASE_URL
