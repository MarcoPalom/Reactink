import React from 'react'
import { Avatar, Input, Popover } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd/es/radio'

const { Search } = Input

const TopNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

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
    <div className="h-16 px-5 flex flex-row items-center justify-end shadow-lg">
      <div className="flex items-center gap-5">
        <div>
          <Search placeholder="Busqueda..." className="w-44" />
        </div>
        <div>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <div>
                <div>Notificacion 1</div>
                <div>Notificacion 2</div>
                <div>Notificacion 3</div>
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
               >Cerrar sesión</Button>
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