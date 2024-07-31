
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "pages/home-page/HomePage";
import ProductList from "pages/products/product-list/ProductList";
import CotationList from 'pages/finance/cotation-list/CotationList';
import ExpenseList from 'pages/finance/expense-list/ExpenseList';
import SaleList from 'pages/finance/sale-list/SaleList';
import ClientList from 'pages/personal/client-list/ClientList';
import EmployeList from 'pages/personal/employe-list/EmployeList';
import Login from 'pages/Login';
import Production from 'pages/Production/Production';
import DebtList from 'pages/finance/debt-list/DebtList';
import CuttingOrderList from 'pages/finance/cuttingorder-list/CuttingOrderList';

const AppRoutes = () => {
    return (

            <Routes>
                 <Route path="/" element={<Login />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/inventario/productos" element={<ProductList />} />
                <Route path='/finanzas/cotizaciones' element={<CotationList/>}/>
                <Route path='/finanzas/ventas' element={<SaleList/>}/>
                <Route path='/finanzas/gastos' element={<ExpenseList/>}/>
                <Route path='/finanzas/deudas' element={<DebtList/>}/>
                <Route path='/finanzas/cuttingorders' element={<CuttingOrderList/>}/>
                <Route path='/personal/empleados' element={<EmployeList/>}/>
                <Route path='/personal/clientes' element={<ClientList/>}/>
                <Route path='/produccion' element={<Production/>}/>
            </Routes>

    )

  }

export default AppRoutes
