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




const EmployeDetail = () => {

    return (
        <>

            <h4 className='font-bold text-lg'>Personal</h4>
            <h6 className='text-sm mb-4'>Añadir Empleado</h6>

            <Card>

                <div className='flex flex-row gap-4'>

                    <div className='gap-1 columns-2  mb-4'>

                        <div className='w-3/4 space-y-4'>
                            <Input placeholder='Nombre'></Input>
                            <Input placeholder='Apellido'></Input>
                            <Input placeholder='Email'></Input>
                            <Input.Password placeholder='Contraseña' />
                            <Input.Password placeholder='Repetir contraseña' />
                        </div>

                        <div className='w-3/4 space-y-4'>
                            <Select
                                className="w-full"
                                showSearch
                                placeholder="rol"
                                options={category}
                            />
                            <Input placeholder='Salario'></Input>
                            <Input placeholder='Telefono'></Input>
                            <Input placeholder='Direccion'></Input>
                            <DatePicker
                                className='w-full'
                                placeholder='Fecha de aceptacion' />
                        </div>
                    </div>

                    <Dragger >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Foto</p>
                        <p className="ant-upload-hint">
                            Da click o arrastra un archivo a esta area para subirlo
                        </p>
                    </Dragger>
                </div>



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
export default EmployeDetail;