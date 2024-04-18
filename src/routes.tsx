import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "pages/home-page/HomePage";
import ProductList from "pages/products/product-list/ProductList";
import ProductDetail from "pages/products/product-detail/ProductDetail";

const AppRoutes = () => {
    return (

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductList />} />
                <Route path="/productos/:productId" element={<ProductDetail />} />
            </Routes>

    )
}

export default AppRoutes
