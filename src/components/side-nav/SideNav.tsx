import Logo from 'assets/img/logo.png'
import Logosmall from 'assets/img/logo-small.png'
import { Menu, MenuProps } from 'antd'
import {
  CodeSandboxOutlined,
  DashboardOutlined,
  EyeOutlined,
  MailOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}
const SideNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

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

  const items: MenuProps['items'] = [
    getItem('Inicio', '/homepage', <DashboardOutlined />),

    getItem('Inventario', 'stock', <MailOutlined />, [
      getItem('Materiales', '/inventario/productos'),
    ]),

    getItem('Finanzas', 'finance', <CodeSandboxOutlined />, [
      getItem('Cotizaciones', '/finanzas/cotizaciones'),
      getItem('Lista de ventas', '/finanzas/ventas'),
      getItem('Lista de gastos', '/finanzas/gastos'),
      getItem('Agregar gasto', '/finanzas/agregar-gasto')
    ]),

    getItem('Personal', 'employees', <ShoppingCartOutlined />, [
      getItem('Empleados', '/personal/empleados'),
      getItem('Clientes', '/personal/clientes'),
 
    ]),

    getItem('Producción', 'prod', <EyeOutlined />, [
      getItem('Estado de producción', 'prod-1')
    ])
  ]

  return (
    <div>
      <div className="block md:hidden mt-3.5 ml-3.5 text-indigo-900 text-4xl">
        <img src={Logosmall} alt="inksport" className="h-5" />
      </div>

      <div className="w-20  md:w-64  h-screen">
        <div className={`h-16 px-4 py-2 justify-start hidden md:block`}>
          <img src={Logo} alt="Ink Sports" className="h-10 " />
        </div>
        <div>
          <Menu
            mode="inline"
            className="p-5 hidden md:block"
            items={items}
            onClick={(e) => {
              navigate(e.key)
            }}
          />

          <Menu
            inlineCollapsed
            mode="inline"
            className="p-5 block md:hidden"
            items={items}
            onClick={(e) => {
              navigate(e.key)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SideNav
