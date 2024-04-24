import { Card, Input, Select, Upload, Button, DatePicker } from 'antd'
import { useParams } from 'react-router-dom'
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


interface DataType {
    value: string;
    label: string;
}

const category: DataType[] = [
    {
        value: 'category1',
        label: 'OPCION 1',
    },
    {
        value: 'category2',
        label: 'OPCION 2',
    },
    {
        value: 'category3',
        label: 'OPCION 3',
    },

];




const ClientDetail = () =>{
    return(
        <>

        <h4 className='font-bold text-lg'>Personal</h4>
        <h6 className='text-sm mb-4'>Añadir Cliente</h6>

        <Card>

          

                <div className='gap-1 columns-2 mb-4'>

                    <div className='w-3/4 space-y-4 '>
                        <Input placeholder='Nombre'></Input>
                        <Input placeholder='Apellido'></Input>
                    </div>  
                    <div className='w-3/4 space-y-4'>
                        <Input placeholder='Email'></Input>
                        <Input placeholder='Telefono'></Input>
                    </div>     
                    
                </div>

            
                <Input
                className='mb-4'
                 placeholder='Organizacion'></Input>
            

            



            <div className='flex flex-row gap-4'>
                <Button className=' h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold p-4 items-center '>
                    Aceptar
                </Button>
                <Button className=' h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold p-4 items-center '>
                    Cancelar
                </Button>
            </div>

        </Card>

    </>

    )
}
export default ClientDetail;