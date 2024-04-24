import { Card, Input, Select, Upload,Button } from 'antd'
import { useParams } from 'react-router-dom'
import { InboxOutlined } from '@ant-design/icons';


const { TextArea } = Input;
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


const ProductDetail = () => {

  return (
    <>

      <h4 className='font-bold text-lg'>Inventario</h4>
      <h6 className='text-sm mb-4'>Añadir producto</h6>

      <Card>

        <div className='flex flex-row gap-4 justify-between mb-4'>
          <Input placeholder='Nombre'></Input>
          <Input placeholder='Cantidad'></Input>
          <Input placeholder='Precio'></Input>
          <Select
            showSearch
            placeholder="Seleciona una categoria"
            options={category}
          />
        </div>
        <div className='flex flex-row items-center mb-4'>
          <TextArea rows={4} placeholder='descripcion' />
        </div>

        <div className='flex flex-row justify-center mb-4'>
          <Dragger >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Da click o arrastra un archivo a esta area para subirlo</p>
            <p className="ant-upload-hint">
              Soporte solo para imagenes
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

export default ProductDetail
