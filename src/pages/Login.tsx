import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Form } from 'antd'
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import axios from 'axios'
import Logo from 'assets/img/logo.png'
import login from 'assets/img/login.jpg'

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/user/login',
        values
      )

      console.log('Respuesta del servidor:', response.data)

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userRole', response.data.user.role.toString())
        navigate('/homepage')
      } else {
        console.error('No se recibió un token o un usuario en la respuesta del servidor')
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 flex items-center justify-center p-8 h-1/2 md:h-full">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
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
                className="w-full h-10 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="md:w-1/2 bg-cover bg-center hidden md:block h-1/2 md:h-full">
        <img src={login} alt="Imagen de inicio de sesión" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}