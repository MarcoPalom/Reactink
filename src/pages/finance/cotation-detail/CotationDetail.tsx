import { Card, Input, Select, Upload, Button,DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons';


const { RangePicker } = DatePicker;


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


const CotationDetail = () => {
    return (
        <>
            <h4 className='font-bold text-lg'>Finanzas</h4>
            <h6 className='text-sm mb-4'>Añadir Cotizacion</h6>

            <Card>

                <div className='flex flex-row gap-4 mb-4 justify-center' >

                    <div className='flex flex-row gap-3'>
                    <Select
                        showSearch
                        placeholder="Seleciona una categoria"
                        options={category}
                    />
                    <Button className=' h-5 w-5 bg-indigo-900 rounded-md text-white text-base p-4 font-bold items-center justify-around text-center'>
                        <PlusOutlined/>
                    </Button>


                    </div>

                    <RangePicker
                    />

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
export default CotationDetail;