import Logo from 'assets/img/logo.png'
import { Menu, MenuProps } from 'antd'
import {
  CodeSandboxOutlined,
  DashboardOutlined,
  EyeOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'

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

  const items: MenuProps['items'] = [
    getItem('Inicio', '/', <DashboardOutlined />),

    getItem('Inventario', 'stock', <MailOutlined />, [
      getItem('Lista de productos', '/inventario/productos'),
      getItem('agregar productos', '/inventario/agregar-producto'),
      getItem('Lista de categorías', '/inventario/categorias'),
      getItem('agregar categorías', '/inventario/agregar-categoria')
    ]),

    getItem('Finanzas', 'finance', <CodeSandboxOutlined />, [
      getItem('Lista de cotizaciones', '/finanzas/cotizaciones'),
      getItem('agregar cotizacion', '/finanzas/agregar-cotizacion'),
      getItem('Lista de ventas', '/finanzas/ventas'),
      getItem('Lista de gastos', '/finanzas/gastos'),
      getItem('agregar gasto', '/finanzas/agregar-gasto')
    ]),

    getItem('Personal', 'employees', <ShoppingCartOutlined />, [
      getItem('Lista de empleados', '/personal/empleados'),
      getItem('agregar empleado', '/personal/empleados-agregar'),
      getItem('Lista de clientes', '/personal/clientes'),
      getItem('agregar cliente', '/personal/clientes-agregar')
    ]),

    getItem('Producción', 'prod', <EyeOutlined />, [
      getItem('Estado de producción', 'prod-1')
    ])
  ]

  return (
    <div>
      <button className="block md:hidden mt-3.5 ml-3.5 text-indigo-900 text-4xl">
        <MenuUnfoldOutlined />
      </button>
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
