import { Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from 'assets/img/logo.png'
import login from 'assets/img/login.jpg'
import axios from 'axios'


const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  /*const emergencylog = () =>{
    navigate('/homepage')
  }
    */

  

   const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:3001/api/user/login',
        formData,
      )
  
      console.log('Respuesta del servidor:', response.data)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        navigate('/homepage')
      } else {
        console.error('No se recibió un token en la respuesta del servidor')
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  return (
    <div className="flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-2/4 flex flex-col justify-center items-center">
        <img src={Logo} alt="Ink Sports" className="h-10 mb-4" />
        <h3>Iniciar sesión</h3>
        <h4>Por favor inicia sesión en tu cuenta.</h4>

        <div className="mt-6 w-full max-w-xs">
          <Input 
            placeholder="Email" 
            className="mb-4"
            name="email"
            onChange={handleChange} />

          <Input.Password 
            placeholder="Contraseña" 
            name="password"
            onChange={handleChange}/>
        </div>

        <Button
          className="h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold mt-6"
          onClick={handleSubmit}
        >
          Entrar
        </Button>

       {/* <Button
          className="h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold mt-6"
          onClick={emergencylog}
        >
          Entrar emergencia
  </Button>*/}
  
      </div>
      <div className="md:w-2/4 md:block hidden">
        <img
          className="w-full h-screen object-cover"
          src={login}
          alt="Imagen de inicio de sesión"
        />
      </div>
    </div>
  )
}

export default Login
