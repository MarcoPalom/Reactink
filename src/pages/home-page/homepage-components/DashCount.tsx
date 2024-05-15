import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { FaClipboardCheck, FaClipboardList } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'

const DashCount = () => {
  const [dashCountData, setDashCountData] = useState([4])
  const navigate = useNavigate()

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const employeeResponse = await axios.get('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const totalEmployees = employeeResponse.data.length;
  
        const clientResponse = await axios.get('http://localhost:3001/api/client', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const totalClients = clientResponse.data.length;

        setDashCountData([totalEmployees, totalClients, 10, 10]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 text-white w-full mb-5 justify-between">
      <div className="bg-indigo-900 rounded-md flex justify-between p-5 w-full md:max-w-xs lg:w-1/4 h-24">
        <div>
          <h4 className="text-2xl">{dashCountData[0]}</h4>
          <h5 className="text-sm">Empleados</h5>
        </div>
        <UserOutlined className="text-6xl transform transition-all hover:scale-110 duration-500" />
      </div>

      <div className="bg-sky-400 rounded-md flex justify-between p-5 md:max-w-xs lg:w-1/4 h-24 ">
        <div>
          <h4 className="text-2xl">{dashCountData[1]}</h4>
          <h5 className="text-sm">Clientes</h5>
        </div>
        <UsergroupAddOutlined className="text-6xl transform transition-all hover:scale-110 duration-500" />
      </div>

      <div className="bg-rose-600 rounded-md flex justify-between p-5 md:max-w-xs lg:w-1/4 h-24 ">
        <div>
          <h4 className="text-2xl">{dashCountData[2]}</h4>
          <h5 className="text-sm">Pedidos recibidos</h5>
        </div>
        <FaClipboardList className="text-6xl transform transition-all hover:scale-110 duration-500" />
      </div>

      <div className="bg-green-500 rounded-md flex justify-between p-5 md:max-w-xs lg:w-1/4 h-24">
        <div>
          <h4 className="text-2xl">{dashCountData[3]}</h4>
          <h5 className="text-sm">Pedidos completados</h5>
        </div>
        <FaClipboardCheck className="text-6xl transform transition-all hover:scale-110 duration-500" />
      </div>
    </div>
  )
}
export default DashCount
