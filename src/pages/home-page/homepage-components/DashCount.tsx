import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
import { useState , useEffect } from 'react';




const DashCount = () =>{

    const [dashCountData, setDashCountData] = useState([20, 40, 60, 80]);

    useEffect(() => {
        //cargar los datos desde una base de datos 
    }, []);




return(
    <div className="flex flex-row gap-4 text-white w-full justify-between mb-6">
                <div className="bg-indigo-900 rounded-md flex justify-between p-5 w-96 h-24" >
                    <div className="">
                        <h4 className='text-2xl'>{dashCountData[0]}</h4>
                        <h5 className='text-sm'>Empleados</h5>
                    </div>

                    <UserOutlined className='text-6xl transform transition-all hover:scale-110 duration-500' />
                </div>

                <div className="bg-sky-400 rounded-md flex justify-between p-5 w-96 h-24" >
                    <div className="">
                        <h4 className='text-2xl'>{dashCountData[1]}</h4>
                        <h5 className='text-sm'>Clientes</h5>
                    </div>

                    <UsergroupAddOutlined className='text-6xl transform transition-all hover:scale-110 duration-500' />
                </div>

                <div className="bg-rose-600	 rounded-md flex justify-between p-5 w-96 h-24" >
                    <div className="">
                        <h4 className='text-2xl'>{dashCountData[2]}</h4>
                        <h5 className='text-sm'>Pedidos recibidos</h5>
                    </div>

                    <FaClipboardList className='text-6xl transform transition-all hover:scale-110 duration-500' />
                </div>

                <div className="bg-green-500 rounded-md flex justify-between p-5 w-96 h-24" >
                    <div className="">
                        <h4 className='text-2xl'>{dashCountData[3]}</h4>
                        <h5 className='text-sm'>Pedidos completados</h5>
                    </div>

                    <FaClipboardCheck className='text-6xl transform transition-all hover:scale-110 duration-500' />
                </div>

    </div>
)

}
export default DashCount;