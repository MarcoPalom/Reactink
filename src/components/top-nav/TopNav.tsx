import React from 'react'
import { Avatar, Input, Popover } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'

const { Search } = Input

const TopNav = () => {
  return (
    <div className="h-16 px-5 flex flex-row items-center justify-end">
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
              <div className="text-red-500">Cerrar sesión</div>
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
