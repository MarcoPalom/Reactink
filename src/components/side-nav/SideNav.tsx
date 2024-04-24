import Logo from 'assets/img/logo.png'
import { Menu, MenuProps, Button } from "antd";
import { CodeSandboxOutlined, DashboardOutlined, EyeOutlined, MailOutlined, ShoppingCartOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        getItem('Inicio', '/', <DashboardOutlined />),

        getItem('Inventario', 'stock', <MailOutlined />, [
            getItem('Lista de productos', '/inventario/productos'),
            getItem('agregar productos', '/inventario/agregar-producto'),
            getItem('Lista de categorías', '/inventario/categorias'),
            getItem('agregar categorías', '/inventario/agregar-categoria'),
        ]),

        getItem('Finanzas', 'finance', <CodeSandboxOutlined />, [
            getItem('Lista de cotizaciones', '/finanzas/cotizaciones'),
            getItem('agregar cotizacion', '/finanzas/agregar-cotizacion'),
            getItem('Lista de ventas', '/finanzas/ventas'),
            getItem('Lista de gastos', '/finanzas/gastos'),
            getItem('agregar gasto', '/finanzas/agregar-gasto'),
        ]),

        getItem('Personal', 'employees', <ShoppingCartOutlined />, [
            getItem('Lista de empleados', '/personal/empleados'),
            getItem('agregar empleado', '/personal/empleados-agregar'),
            getItem('Lista de clientes', '/personal/clientes'),
            getItem('agregar cliente', '/personal/clientes-agregar'),
        ]),

        getItem('Producción', 'prod', <EyeOutlined />, [
            getItem('Estado de producción', 'prod-1'),
        ]),
    ];


    return (

        <div>

            <button className="block sm:hidden mt-3.5 ml-3.5 text-indigo-900 text-4xl" onClick={toggleVisibility}>
                {isVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className={`w-${isVisible ? 'screen' : '16rem'} h-${isVisible ? 'screen' : 'auto'} ${isVisible ? 'block' : 'hidden sm:block'}`}>
                <div className={`flex h-16 px-4 py-2 ${isVisible ? 'justify-center' : 'justify-start'}`}>
                    <img src={Logo} alt="Ink Sports" className='h-10 ' />
                </div>
                <div>
                    <Menu
                        mode="inline"
                        className='p-5 text-center'
                        items={items}
                        onClick={(e) => {
                            navigate(e.key)
                            setIsVisible(false);
                        }}
                    />
                </div>
            </div>
        </div>


    )
}

export default SideNav
