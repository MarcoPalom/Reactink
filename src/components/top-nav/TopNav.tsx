import { Avatar, Popover } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd/es/radio'
import logo from 'assets/img/logo.png'


const TopNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const userole = localStorage.getItem('userRole');

  const allowedRoutes = [
    '/homepage',
    '/inventario',
    '/finanzas',
    '/personal',
    '/prod'
  ]

  const showSideNav = allowedRoutes.some((route) =>
    location.pathname.startsWith(route)
  )

  if (!showSideNav) {
    return null
  }


  const logout = () => {
    navigate('/')
  }

  return (
    <div className="h-16 px-5 flex flex-row items-center justify-between shadow-lg">
    {userole !== '1' && (  // Cambia la comparación según el tipo de dato en localStorage
      <div className="flex-1 flex justify-center">
        <img src={logo} alt="Logo" className="h-10" /> {/* Ajusta la altura según necesites */}
      </div>
    )}
    
    <div className="flex items-center gap-5">
      <div>
        <Popover
          placement="bottomRight"
          trigger="click"
          content={
            <div>
              <div>Notificación 1</div>
              <div>Notificación 2</div>
              <div>Notificación 3</div>
            </div>
          }
        >
          <BellOutlined className="text-xl text-slate-500" />
        </Popover>
      </div>
      <Popover
        placement="bottomRight"
        trigger="click"
        content={
          <div>
            <div>Mi perfil</div>
            <div>Configuraciones</div>
            <Button
              className="text-red-500"
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </div>
        }
      >
        <Avatar icon={<UserOutlined />} />
      </Popover>
    </div>
  </div>
  )
}

export default TopNav