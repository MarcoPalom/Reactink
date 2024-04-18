import Logo from 'assets/img/logo.png'
import {Menu, MenuProps} from "antd";
import {CodeSandboxOutlined, DashboardOutlined, EyeOutlined, MailOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import React from "react";
import {useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem => {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}
const SideNav = () => {
    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        getItem('Inicio', '/', <DashboardOutlined/>),

        getItem('Inventario', 'stock', <MailOutlined/>, [
            getItem('Lista de productos', '/productos'),
            getItem('Añadir productos', '/productos/5131153'),
            getItem('Lista de categorías', 'stock-3'),
            getItem('Añadir categorías', 'stock-4'),
        ]),

        getItem('Finanzas', 'finance', <CodeSandboxOutlined/>, [
            getItem('Lista de cotizaciones', 'finance-1'),
            getItem('Añadir cotizacion', 'finance-2'),
            getItem('Lista de ventas', 'finance-3'),
            getItem('Lista de gastos', 'finance-4'),
            getItem('Añadir gasto', 'finance-5'),
        ]),

        getItem('Personal', 'employees', <ShoppingCartOutlined/>, [
            getItem('Lista de empleados', 'employees-1'),
            getItem('Añadir empleado', 'employees-2'),
            getItem('Lista de clientes', 'employees-3'),
            getItem('Añadir cliente', 'employees-4'),
        ]),

        getItem('Producción', 'prod', <EyeOutlined/>, [
            getItem('Estado de producción', 'prod-1'),
        ]),
    ];


    return (
        <div className='w-[16rem]'>
            <div className='h-16 px-4 py-2'>
                <img src={Logo} alt="Ink Sports" className='h-10'/>
            </div>
            <div>
                <Menu
                    mode="inline"
                    items={items}
                    onClick={(e) => {
                        navigate(e.key)
                    }}
                />
            </div>
        </div>
    )
}

export default SideNav
