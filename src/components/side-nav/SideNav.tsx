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
const ROLE_ADMIN = 1
const ROLE_FINANCIERO = 2
const ROLE_AUXILIAR = 3
const ROLE_DISENO = 4

const SideNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const userRole = Number(localStorage.getItem('userRole') || 0)

  // Admin (1), Financiero (2), Auxiliar (3) ven el sidenav (rol 4 NO debe verlo)
  const roleWithNav = [ROLE_ADMIN, ROLE_FINANCIERO, ROLE_AUXILIAR].includes(userRole)
  if (!roleWithNav) {
    return null
  }

  const allowedRoutesAdmin = ['/homepage', '/inventario', '/finanzas', '/personal', '/prod']

  const showSideNav = allowedRoutesAdmin.some((route) => location.pathname.startsWith(route))

  if (!showSideNav) {
    return null
  }

  // Menú completo: Admin y Financiero (tienen verifyAdminFinance + verifyAdministrationDepartment)
  const itemsAdminFinanciero: MenuProps['items'] = [
    getItem('Inicio', '/homepage', <DashboardOutlined />),
    getItem('Inventario', 'stock', <MailOutlined />, [
      getItem('Materiales', '/inventario/productos')
    ]),
    getItem('Finanzas', 'finance', <CodeSandboxOutlined />, [
      getItem('Cotizaciones', '/finanzas/cotizaciones'),
      getItem('Gastos', '/finanzas/gastos'),
      getItem('Deudas', '/finanzas/deudas'),
      getItem('Ordenes', '/finanzas/cuttingorders'),
      getItem('Diseños', '/finanzas/desinglist')
    ]),
    getItem('Personal', 'employees', <ShoppingCartOutlined />, [
      getItem('Empleados', '/personal/empleados'),
      getItem('Clientes', '/personal/clientes')
    ]),
    getItem('Producción', 'prod', <EyeOutlined />, [
      getItem('Estado de producción', '/produccion')
    ])
  ]

  // Auxiliar: verifyAdministrationDepartment + verifyAreas (sin Gastos)
  const itemsAuxiliar: MenuProps['items'] = [
    getItem('Inicio', '/homepage', <DashboardOutlined />),
    getItem('Inventario', 'stock', <MailOutlined />, [
      getItem('Materiales', '/inventario/productos')
    ]),
    getItem('Finanzas', 'finance', <CodeSandboxOutlined />, [
      getItem('Cotizaciones', '/finanzas/cotizaciones'),
      getItem('Ordenes', '/finanzas/cuttingorders'),
      getItem('Diseños', '/finanzas/desinglist')
    ]),
    getItem('Personal', 'employees', <ShoppingCartOutlined />, [
      getItem('Empleados', '/personal/empleados'),
      getItem('Clientes', '/personal/clientes')
    ]),
    getItem('Producción', 'prod', <EyeOutlined />, [
      getItem('Estado de producción', '/produccion')
    ])
  ]

  const items =
    userRole === ROLE_AUXILIAR
      ? itemsAuxiliar
      : itemsAdminFinanciero

  return (
    <div>
      <div className="block xl:hidden mt-3.5 ml-3.5 text-indigo-900 text-4xl">
        <img src={Logosmall} alt="inksport" className="h-5" />
      </div>

      <div className="w-20  xl:w-64  h-screen">
        <div className={`h-16 px-4 py-2 justify-start hidden xl:block`}>
          <img src={Logo} alt="Ink Sports" className="h-10 " />
        </div>
        <div>
          <Menu
            mode="inline"
            className="p-5 hidden xl:block"
            items={items}
            onClick={(e) => {
              navigate(e.key)
            }}
          />

          <Menu
            inlineCollapsed
            mode="inline"
            className="p-5 block xl:hidden"
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
