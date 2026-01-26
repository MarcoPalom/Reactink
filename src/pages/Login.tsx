import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Form } from 'antd'
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import axios from 'axios'
import Logo from 'assets/img/logo.png'
import login from 'assets/img/login.jpg'
import { authToast, toast } from 'components/Scripts/ToastUtils'
import { API_BASE_URL } from 'config/api.config'

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        values
      )

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userRole', response.data.user.role.toString())
        authToast.loginSuccess()
        navigate('/homepage')
      } else {
        authToast.loginError()
      }
    } catch (error: any) {
      if (error.response) {
        // Error de respuesta del servidor (401, 403, etc.)
        if (error.response.status === 401 || error.response.status === 403) {
          authToast.loginError()
        } else {
          toast.error(error.response.data?.message || 'Error en el servidor')
        }
      } else if (error.request) {
        // Error de red (sin respuesta)
        authToast.loginNetworkError()
      } else {
        toast.error('Error inesperado. Intenta nuevamente')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden fixed inset-0">
      <div className="w-full md:w-1/2 flex items-center justify-center h-full bg-white">
        <div className="w-full h-full md:h-auto md:max-w-md bg-white md:shadow-lg md:rounded-lg px-6 py-8 sm:p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Ink Sports" className="h-10" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-red-600">Iniciar sesión</h2>
          <p className="text-center text-gray-600 mb-6">
            Por favor inicia sesión en tu cuenta
          </p>
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Por favor ingresa tu email' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                size="large"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Contraseña"
                size="large"
                className="rounded-md"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-10 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
              >
                {loading ? 'Iniciando sesión...' : 'Entrar'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <img src={login} alt="Imagen de inicio de sesión" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}