import { Card, Input, Button,DatePicker } from 'antd'


interface DataType {
  value: string;
  label: string;
}



const  ExpenseDetail    = () =>{

    return(
       
        <>

        <h4 className='font-bold text-lg'>Finanzas</h4>
        <h6 className='text-sm mb-4'>Añadir Gasto</h6>
  
        <Card>
  
          <div className='flex flex-row gap-4 justify-between mb-4'>
            <Input placeholder='Concepto'></Input>
            <Input placeholder='Total'></Input>
            <DatePicker className='w-96' placeholder='Seleciona una fecha'/>
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
export default  ExpenseDetail   ;