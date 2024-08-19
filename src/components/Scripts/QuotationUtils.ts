import { message, Modal } from 'antd'
import {
  fetchQuotation,
  updateQuotation,
  addQuotation,
  addQuotationProduct,
  addQuotationProductMaquila,
  EditQuotationProduct,
  EditQuotationProductMaquila,
  addQuotationProductShirt,
  addCuttingOrder,
  addDesign
} from 'components/Scripts/Apicalls'
import {
  Quotation,
  QuotationProduct,
  QuotationProductMaquila,
  FormDataShirt,
  CuttingOrderData
} from 'components/Scripts/Interfaces'
import { FormInstance } from 'antd'
import { useState } from 'react';
import axios from 'axios'

const { confirm } = Modal

//utils

export const filterQuotations = (Quotations: any[], searchText: string) => {
  return searchText
    ? Quotations.filter((Quotation) =>
        Quotation.id.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : Quotations
}

export const addKeysToQuotations = (Quotations: any[]) => {
  return Quotations.map((Quotation, index) => ({
    ...Quotation,
    key: index.toString()
  }))
}

export const handleAdvanceChange = (
  value: number,
  setAdvance: (value: number) => void,
  EditForm: FormInstance,
  setTaxLocked: (locked: boolean) => void,
  calculateTotal: (EditForm: FormInstance) => number
) => {
  if (value !== null) {
    setAdvance(value)
    const newTotal = calculateTotal(EditForm)
    EditForm.setFieldsValue({ total: newTotal })
    setTaxLocked(true)
  }
}


export const disciplines = [
  'Futbol soccer',
  'Beisbol',
  'Tochito',
  'Voleibol',
  'Basquetball',
  'Ciclismo',
  'Carrera',
  'Pesca',
  'Entrenador',
  'Playera',
  'Entrenamiento'
]

export const cloths = [
  'Pepito',
  'Antoly',
  'Inter70',
  'Micropique',
  'MakyPlus',
  'Paris',
  'Super Licra',
  'Cardigan',
  'Atlos',
  'Licra',
  'Jumanji',
  'Manchester'
]

export const neckForms = [
  'Redondo',
  'Cuello V',
  'Tipo Polo',
  'Con Cierre',
  'Boton',
  'Tipo polo sublimado',
  'Cuello V sublimado'
]

export const neckTypes = ['Sublimado', 'Tela teñida', 'Cardigan']

export const sleeveForms = [
  'Corta',
  'Rangla',
  'Corta C/Puño',
  'Larga',
  'sin manga',
  'Rangla C/Puño'
]

export const sleeveTypes = ['Subilmado', 'Tela Teñida']

export const cuffs = ['SI', 'NO']

export const cuffsTypes = ['Subilmado', 'Tela Teñida']

export const sizes = [
  '6',
  '8',
  '12',
  '14',
  '16',
  '18',
  'CH',
  'M',
  'G',
  'XG',
  'XXG',
  'XXXG',
  '4XG'
]

export const shortLooks = ['SI', 'Laterales', 'Puño', 'NO']
export const sections = ['SI', 'NO']

export const genderMap: { [key: number]: string } = {
  1: 'H', 
  2: 'M', 
};
//handlers de cotizacion

export const handleView = async (
  id: string,
  setSelectedQuotation: any,
  setVisible: any
) => {
  try {
    const data = await fetchQuotation(id)
    setSelectedQuotation(data)
    setVisible(true)
  } catch (error) {
    console.error('Error fetching Quotation details:', error)
  }
}

export const handleSave = async (
  EditForm: FormInstance,
  editingQuotation: any,
  Quotations: any[],
  setQuotations: (quotations: any[]) => void,
  setVisibleEdit: (visible: boolean) => void,
  setTaxLocked: (locked: boolean) => void,
  dataSource: any[]
) => {
  try {
    const values = await EditForm.validateFields()

    if (values.dateReceipt) {
      values.dateReceipt = new Date(values.dateReceipt).toISOString()
    }
    if (values.expirationDate) {
      values.expirationDate = new Date(values.expirationDate).toISOString()
    }

    const updatedQuotation = await updateQuotation(editingQuotation.id, values)
    message.success('Cotización actualizada exitosamente')

    const updatedQuotations = Quotations.map((Quotation) =>
      Quotation.id === editingQuotation.id
        ? { ...Quotation, ...values }
        : Quotation
    )

    setQuotations(updatedQuotations)

    const hasQuotationProducts = dataSource.some((item) => 'tax' in item)
    const hasQuotationProductsMaquila = dataSource.some(
      (item) => 'price_meter' in item
    )

    if (hasQuotationProducts) {
      for (const item of dataSource) {
        if ('tax' in item) {
          const pivotDataProduct = {
            quotationId: editingQuotation.id,
            description: item.description,
            quantity: item.quantity,
            amount: item.amount,
            tax: item.tax,
            total: item.total
          }

          await EditQuotationProduct(item.id, pivotDataProduct)
        }
      }
    }

    if (hasQuotationProductsMaquila) {
      for (const item of dataSource) {
        if ('price_meter' in item) {
          const pivotDataProductMaquila = {
            quotationId: editingQuotation.id,
            description: item.description,
            quantity: item.quantity,
            meters_impression: item.meters_impression,
            price_unit: item.price_unit,
            price_meter: item.price_meter,
            amount: item.amount
          }

          await EditQuotationProductMaquila(item.id, pivotDataProductMaquila)
        }
      }
    }

    setTaxLocked(false)
    setVisibleEdit(false)
    EditForm.resetFields()
  } catch (error) {
    console.error('Error updating Quotation:', error)
    message.error('Error al actualizar la Cotización')
  }
}

export const handleAddSave = async (
  addForm: FormInstance,
  dataSource: any[],
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setDataSource: React.Dispatch<React.SetStateAction<any[]>>,
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>
) => {
  try {
    const values = await addForm.validateFields()
    const newQuotation = await addQuotation(values)
    const hasQuotationProducts = dataSource.some((item) => 'tax' in item)
    const hasQuotationProductsMaquila = dataSource.some(
      (item) => 'price_meter' in item
    )

    if (hasQuotationProducts) {
      for (const item of dataSource) {
        if ('tax' in item) {
          const pivotDataProduct: QuotationProduct = {
            description: item.description,
            quantity: item.quantity,
            amount: item.amount,
            tax: item.tax,
            total: item.total
          }

          await addQuotationProduct({
            ...pivotDataProduct,
            quotationId: newQuotation.id
          })
        }
      }
    } else if (hasQuotationProductsMaquila) {
      for (const item of dataSource) {
        if ('price_meter' in item) {
          const pivotDataProductMaquila: QuotationProductMaquila = {
            description: item.description,
            quantity: item.quantity,
            meters_impression: item.meters_impression,
            price_unit: item.price_unit,
            price_meter: item.price_meter,
            amount: item.amount
          }

          await addQuotationProductMaquila({
            ...pivotDataProductMaquila,
            quotationId: newQuotation.id
          })
        }
      }
    }

    setQuotations((prevQuotations) => [...prevQuotations, newQuotation])
    message.success('Cotización agregada exitosamente')
    setVisibleAdd(false)
    addForm.resetFields()
    setDataSource([])
  } catch (error: any) {
    console.error('Error adding Quotation:', error)
    message.error(
      error.response?.data.message || 'Error al agregar la Cotización'
    )
  }
}

export const handleDelete = (
  record: any,
  deletequotation: any,
  Quotations: any,
  setQuotations: any
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar la cotizacion?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      await deletequotation(record.id)
      const updatedQuotations = Quotations.filter(
        (Quotation: any) => Quotation.id !== record.id
      )
      setQuotations(updatedQuotations)
    }
  })
}

export const handleDeleteProduct = (
  record: any,
  deleteQuotationProduct: any,
  deleteQuotationProductMaquila: any,
  quotationProductsMaquila: any[],
  setQuotationProductsMaquila: any,
  quotationProducts: any[],
  setQuotationProducts: any
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar este producto?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        const emptyData = {}

        if ('tax' in record) {
          await deleteQuotationProduct(record.id, emptyData)

          const updatedProducts = quotationProducts.filter(
            (quotationProducts: any) => quotationProducts.id !== record.id
          )
          setQuotationProducts(updatedProducts)
        } else if ('price_meter' in record) {
          await deleteQuotationProductMaquila(record.id, emptyData)

          const updatedProducts = quotationProductsMaquila.filter(
            (quotationProductsMaquila: any) =>
              quotationProductsMaquila.id !== record.id
          )
          setQuotationProductsMaquila(updatedProducts)
        }

        message.success('Producto eliminado exitosamente')
      } catch (error) {
        message.error('Error al eliminar el producto')
      }
    }
  })
}

export const handleEdit = (
  record: any,
  setEditingQuotation: any,
  EditForm: any,
  setVisibleEdit: any
) => {
  try {
    setEditingQuotation(record)
    EditForm.setFieldsValue(record)
    setVisibleEdit(true)
  } catch (error) {
    console.error('Error al editar la Cotizacion:', error)
  }
}

//calculos
export const handleFieldChange = (
  value: any,
  key: string,
  column: string,
  dataSource: any[],
  setDataSource: any
) => {
  const newData = [...dataSource]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: value })

    if (column === 'tax' && newData[index].tax > 0) {
      newData[index].total =
        newData[index].amount *
        newData[index].quantity *
        (1 + newData[index].tax / 100)
    } else {
      newData[index].total = newData[index].amount * newData[index].quantity
    }

    setDataSource(newData)
  }
}

export const handleFieldChangeMaquila = (
  value: any,
  key: string,
  column: string,
  dataSource: any[],
  setDataSource: any
) => {
  const newData = [...dataSource]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: value })

    newData[index].price_meter = 120
    newData[index].meters_impression =
      parseFloat(newData[index].meters_impression) || 0
    newData[index].quantity = parseFloat(newData[index].quantity) || 0

    newData[index].price_unit =
      newData[index].price_meter * newData[index].meters_impression

    if (isNaN(newData[index].price_unit)) {
      newData[index].price_unit = 0
    }

    newData[index].amount = newData[index].price_unit * newData[index].quantity

    if (isNaN(newData[index].amount)) {
      newData[index].amount = 0
    }

    setDataSource(newData)
  }
}

export const calculateSubtotal = (dataSource: any[]) => {
  const newSubtotal = dataSource.reduce(
    (acc, item) => acc + parseFloat(item.total || 0),
    0
  )
  return newSubtotal
}

export const calculateSubtotalMaquila = (dataSource: any[]) => {
  const newSubtotal = dataSource.reduce(
    (acc, item) => acc + parseFloat(item.amount || 0),
    0
  )
  return newSubtotal
}

export const calculateTaxAndNetAmount = (addForm: any) => {
  const subtotal = addForm.getFieldValue('subtotal') || 0
  let taxPercentage = addForm.getFieldValue('tax') || 0

  if (isNaN(subtotal) || isNaN(taxPercentage)) {
    return 0
  }

  taxPercentage = parseFloat(taxPercentage)

  let newNetAmount = 0

  if (taxPercentage > 0) {
    const taxAmount = (subtotal * taxPercentage) / 100
    newNetAmount = subtotal + taxAmount
  } else if (taxPercentage < 1) {
    newNetAmount = subtotal
  }

  return newNetAmount
}

export const calculateTaxAndNetAmountEdit = (EditForm: any) => {
  let subtotal = EditForm.getFieldValue('subtotal') || 0
  let taxPercentage = EditForm.getFieldValue('tax') || 0

  if (isNaN(subtotal) || isNaN(taxPercentage)) {
    return 0
  }

  subtotal = parseFloat(subtotal)
  taxPercentage = parseFloat(taxPercentage)

  let newNetAmount = 0

  if (taxPercentage > 0) {
    const taxAmount = (subtotal * taxPercentage) / 100

    newNetAmount = subtotal + taxAmount
  } else if (taxPercentage < 1) {
    newNetAmount = subtotal
  }

  return newNetAmount
}

export const calculateTotal = (addForm: any) => {
  const netAmount = addForm.getFieldValue('netAmount') || 0
  const advance = addForm.getFieldValue('advance') || 0

  if (isNaN(netAmount) || isNaN(advance)) {
    return 0
  }
  const newTotal = netAmount - advance
  return newTotal
}

//Funciones Tabla añadir cotizacion botones

export const handleAddRow = (
  count: number,
  setCount: any,
  setDataSource: any,
  dataSource: any[]
) => {
  const newRow = {
    key: count,
    description: '',
    amount: 0,
    quantity: 0,
    total: 0
  }
  setDataSource([...dataSource, newRow])
  setCount(count + 1)
}

export const handleEmpty = (
  confirm: any,
  setDataSource: any,
  setTaxLocked: (locked: boolean) => void,
  EditForm: FormInstance
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres limpiar la tabla?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      setDataSource([])
      setTaxLocked(false)
      EditForm.resetFields()
      EditForm.setFieldsValue({ subtotal: 0 })
      EditForm.setFieldsValue({ netAmount: 0 })
      EditForm.setFieldsValue({ total: 0 })
      EditForm.setFieldsValue({ tax: 0 })
      EditForm.setFieldsValue({ advance: 0 })
    }
  })
}

export const handleFinish = (addForm: any, dataSource: any[]) => {
  const newSubtotal = calculateSubtotal(dataSource)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  addForm.setFieldsValue({ subtotal: newSubtotal })
  addForm.setFieldsValue({ netAmount: newNetAmount })
  addForm.setFieldsValue({ total: newTotal })
  addForm.setFieldsValue({ tax: 0 })
  addForm.setFieldsValue({ advance: 0 })
}

export const handleFinishMaquila = (addForm: any, dataSource: any[]) => {
  const newSubtotal = calculateSubtotalMaquila(dataSource)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  addForm.setFieldsValue({ subtotal: newSubtotal })
  addForm.setFieldsValue({ netAmount: newNetAmount })
  addForm.setFieldsValue({ total: newTotal })
  addForm.setFieldsValue({ tax: 0 })
  addForm.setFieldsValue({ advance: 0 })
}

//orden de corte

export const handleSelectChangeShirtShorts = (
  dataSourceShorts: any,
  setDataSourceShorts: any,
  value: any,
  key: any,
  column: any
) => {
  const newData = [...dataSourceShorts]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: value })
    setDataSourceShorts(newData)
  }
}

export const handleInputNumberChangeShorts = (
  dataSourceShorts: any,
  setDataSourceShorts: any,
  value: any,
  key: any,
  column: any
) => {
  const newData = [...dataSourceShorts]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: value })
    setDataSourceShorts(newData)
  }
}

export const handleInputChangeShorts = (
  dataSourceShorts: any,
  setDataSourceShorts: any,
  e: any,
  key: any,
  column: any
) => {
  const newData = [...dataSourceShorts]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: e.target.value })
    setDataSourceShorts(newData)
  }
}

export const handleGenderToggleShorts = (
  dataSourceShorts: any,
  setDataSourceShorts: any,
  key: any
) => {
  const newData = dataSourceShorts.map((item: any) => {
    if (item.key === key) {
      return { ...item, genero: item.genero === 'H' ? 'M' : 'H' }
    }
    return item
  })
  setDataSourceShorts(newData)
}

export const handleAddRowShorts = (
  count: number,
  setCount: any,
  setDataSourceShorts: any,
  dataSource: any[]
) => {
  const newRow = {
    key: count,
    description: '',
    amount: 0,
    quantity: 0,
    total: 0
  }
  setDataSourceShorts([...dataSource, newRow])
  setCount(count + 1)
}

export const handleEmptyShorts = (confirm: any, setDataSourceShorts: any) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres limpiar la tabla?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      setDataSourceShorts([])
    }
  })
}

//TEMPORALES CAMISAS

export const handleSelectChangeShirt = (
  dataSource: any,
  setDataSourceShorts: any,
  value: any,
  key: any,
  column: any
) => {
  const newData = [...dataSource]
  const index = newData.findIndex((item) => key === item.key)
  if (index > -1) {
    const item = newData[index]
    newData.splice(index, 1, { ...item, [column]: value })
    setDataSourceShorts(newData)
  }
}

export const handleInputNumberChangeShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  value: any,
  key: any,
  column: any
) => {
  const updatedShirts = shirts.map((shirt,index) =>
    index === key ? { ...shirt, [column]: value } : shirt
  );
  setShirts(updatedShirts);
};

export const calculateAndUpdateTotal = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  key: any,
  quantity: number
) => {
  const updatedShirts = shirts.map((shirt,index) => {
    if (index === key) {
      return { ...shirt, quantity };
    }
    return shirt;
  });
  setShirts(updatedShirts);
};

export const handleInputChangeShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  e: any,
  key: any,
  column: string,
  setIsObservationFilled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (column === 'observation') {
    const updatedShirts = shirts.map((shirt, index) =>
      index === key ? { ...shirt, [column]: e.target.value } : shirt
    );
    setShirts(updatedShirts);

    if (e.target.value.trim() !== '') {
      setIsObservationFilled(true);
    }
  }
};


export const handleGenderToggleShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  key: any 
) => {
  const updatedShirts = shirts.map((shirt,index) =>
    index === key ? { ...shirt, gender: shirt.gender === 1 ? 2 : 1  } : shirt
  );
  setShirts(updatedShirts);
};

export const isSaveButtonDisabled = (shirts: FormDataShirt[]): boolean => {
  return shirts.some(shirt => !shirt.observation || !shirt.observation.trim());
};


export const handleFormSubmitShirt = async (
  ShirtForm: FormInstance,
  setShirts: any,
  CuttingForm: FormInstance,
  setCuttingOrderDt: any,
  shirts: FormDataShirt[],
  CuttingOrderDt: any,
  productType: number | null,
  file: File | null, 
  setImageFileName: (fileName: string | null) => void
) => {
  
  // Intentar validar y procesar datos del formulario de camisetas
  try {
    const values = await ShirtForm.validateFields();
    const {
      frontClothColor,
      neckClothColor,
      sleeveClothColor,
      cuffClothColor,
      image,
      ...restValues
    } = values;

    // Si hay un archivo de imagen, intentar subirlo
    if (file) {
      try {
        const response = await uploadImage(file);
        setImageFileName(response); 
        message.success('Imagen subida exitosamente');
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError);
        message.error('Error al subir la imagen');
        return null;
      }
    }

    const formData: FormDataShirt = {
      ...restValues,
      productType: productType
    };
    
    console.log(formData);
    setShirts([...shirts, { ...formData }]);
    ShirtForm.resetFields();

  } catch (errorInfo) {
    console.error('Failed:', errorInfo);
  }


  try {
    const values = await CuttingForm.validateFields();
    const formDataCut: CuttingOrderData = {
      ...values
    };

    console.log(formDataCut);
    setCuttingOrderDt([...CuttingOrderDt, { ...formDataCut }]);
    
  } catch (errorInfo) {
    console.error('Failed:', errorInfo);
  }
};


export const useFormHandler = (materials: any[]) => {
  const [colors, setColors] = useState({
    frontClothColor: '',
    neckClothColor: '',
    sleeveClothColor: '',
    cuffClothColor: '',
  });

  const handleMaterialChange = (field: string, materialId: string, ShirtForm: FormInstance) => {
    const selectedMaterial = materials.find(material => material.id === materialId);
    if (selectedMaterial) {
      setColors(prevColors => ({
        ...prevColors,
        [field]: selectedMaterial.color,
      }));
      ShirtForm.setFieldsValue({
        [field]: selectedMaterial.color,
      });
    }
  };

  return {
    colors,
    handleMaterialChange,
  };
};

export const handleSubmitShirts = async (
  shirts: FormDataShirt[],
  CuttingOrderDt: CuttingOrderData[],
  quotationId: number,
  imageFileName: string | null 
) => {
  console.log(imageFileName)
  const Type: boolean = true;
  const DesignData = {
    quotationId,
    ...(imageFileName ? { design: imageFileName } : {}),
    typeProduct: Type
  };

  try {
    for (const shirt of shirts) {
      const shirtData = { ...shirt, quotationId };
      const response = await addQuotationProductShirt(shirtData);
      
      if (response.status=true) {
        message.success('Camiseta agregada con éxito');
      } else {
        message.error('Error al agregar camiseta');
      }
    }

    const designResponse = await addDesign(DesignData);
    if (designResponse.status=true) {
      message.success('Diseño agregado con éxito');

      if (CuttingOrderDt.length > 0) {
        const cuttingOrderResponse = await addCuttingOrder({ ...CuttingOrderDt[0], quotationId });

        if (cuttingOrderResponse.status=true) {
          message.success('Orden de corte generada con éxito');
        } else {
          message.error('Error al generar la orden de corte');
        }
      }
    } else {
      message.error('Error al agregar el diseño');
    }
  } catch (error) {
    console.error('Error al enviar datos de las camisetas, diseño o generar la orden de corte:', error);
    message.error('Ocurrió un error durante el proceso');
  }
};




const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      'http://localhost:3001/api/upload/single/quotation_shirt',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.fileName 
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    throw error
  }
}