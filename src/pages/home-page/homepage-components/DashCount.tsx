import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { FaClipboardCheck, FaClipboardList } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { API_BASE_URL } from 'config/api.config'
import { fetchOrders, fetchAllProducts } from 'components/Scripts/Apicalls'

// Una orden está completada cuando todos sus productos tienen las 6 áreas
// de avance terminadas (los flags son numéricos 0/1, el truthy-check funciona).
const isProductDone = (p: any) =>
  !!(p.cuttingArea && p.printingArea && p.sublimationArea &&
     p.sewingArea && p.ironingArea && p.finishingArea)

export default function DashCount() {
  const [dashCountData, setDashCountData] = useState<number[]>([0, 0, 0, 0])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const employeeResponse = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const totalEmployees = employeeResponse.data.length;
  
        const clientResponse = await axios.get(`${API_BASE_URL}/client`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const totalClients = clientResponse.data.length;

        // Pedidos recibidos = total de órdenes de corte
        const orders = await fetchOrders();
        const totalOrders = Array.isArray(orders) ? orders.length : 0;

        // Pedidos completados = órdenes donde todos sus productos tienen
        // las 6 áreas terminadas. Agrupamos los productos por quotationId.
        const products = await fetchAllProducts();
        const byQuotation = new Map<number, any[]>();
        products.forEach((p: any) => {
          const group = byQuotation.get(p.quotationId) || [];
          group.push(p);
          byQuotation.set(p.quotationId, group);
        });

        const completedOrders = (Array.isArray(orders) ? orders : []).filter((o: any) => {
          const group = byQuotation.get(o.quotationId);
          return !!group && group.length > 0 && group.every(isProductDone);
        }).length;

        await new Promise(resolve => setTimeout(resolve, 1000));

        setDashCountData([totalEmployees, totalClients, totalOrders, completedOrders]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const renderCard = (index: number, title: string, icon: JSX.Element, bgColor: string) => (
    <div 
      key={index}
      className={`${bgColor} rounded-md flex justify-between p-5 w-full md:max-w-xs lg:w-1/4 h-24
                  transition-all duration-500 ease-in-out
                  hover:scale-105
                  ${loading ? 'animate-pulse' : 'animate-fadeInUp'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div>
        <h4 className="text-2xl">{loading ? '-' : dashCountData[index]}</h4>
        <h5 className="text-sm">{title}</h5>
      </div>
      <div className="text-6xl transform transition-all hover:scale-110 duration-500">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 text-white w-full mb-5 justify-between">
      {renderCard(0, "Empleados", <UserOutlined />, "bg-indigo-900")}
      {renderCard(1, "Clientes", <UsergroupAddOutlined />, "bg-sky-400")}
      {renderCard(2, "Pedidos recibidos", <FaClipboardList />, "bg-rose-600")}
      {renderCard(3, "Pedidos completados", <FaClipboardCheck />, "bg-green-500")}
    </div>
  )
}