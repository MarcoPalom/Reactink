import { Card, Input, Button } from 'antd'


const { TextArea } = Input;

const CategoryDetail = () => {

    return (

        <>
            <h4 className='font-bold text-lg'>Inventario</h4>
            <h6 className='text-sm mb-4'>Añadir Categoria</h6>

            <Card>

                <div className='flex flex-row gap-4 justify between mb-4'>
                    <Input placeholder='Nombre de la categoria'></Input>


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
export default CategoryDetail;