
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "pages/home-page/HomePage";
import ProductList from "pages/products/product-list/ProductList";
import ProductDetail from "pages/products/product-detail/ProductDetail";
import CategoryList from "pages/products/category-list/CategoryList";
import CategoryDetail from 'pages/products/category-detail/CategoryDetail';
import CotationList from 'pages/finance/cotation-list/CotationList';
import CotationDetail from 'pages/finance/cotation-detail/CotationDetail';
import ExpenseList from 'pages/finance/expense-list/ExpenseList';
import SaleList from 'pages/finance/sale-list/SaleList';
import ExpenseDetail from 'pages/finance/expense-detail/ExpenseDetail';
import ClientList from 'pages/personal/client-list/ClientList';
import EmployeList from 'pages/personal/employe-list/EmployeList';
import Login from 'pages/Login';

const AppRoutes = () => {
    return (

            <Routes>
                 <Route path="/" element={<Login />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/inventario/productos" element={<ProductList />} />
                <Route path="/inventario/agregar-producto" element={<ProductDetail />} />
                <Route path="/inventario/categorias" element={<CategoryList />} />
                <Route path='/inventario/agregar-categoria' element={<CategoryDetail/>}/>
                <Route path='/finanzas/cotizaciones' element={<CotationList/>}/>
                <Route path='/finanzas/agregar-cotizacion' element={<CotationDetail/>}/>
                <Route path='/finanzas/ventas' element={<SaleList/>}/>
                <Route path='/finanzas/gastos' element={<ExpenseList/>}/>
                <Route path='/finanzas/agregar-gasto' element={<ExpenseDetail/>}/>
                <Route path='/personal/empleados' element={<EmployeList/>}/>
                <Route path='/personal/clientes' element={<ClientList/>}/>
            </Routes>

    )

  }

export default AppRoutes
