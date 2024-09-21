import {
  fetchOrders,
  fetchOrder,
  fetchQuotationOrder,
  fetchMaterials,
  fetchQuotations,
  fetchImage,
  addQuotationProductShirt,
  addQuotationProductShort,
  addCuttingOrder,
  addDesign
} from 'components/Scripts/Apicalls'
import {
  CuttingOrderData,
  FormDataShirtView,
  Quotation,
  Material,
  quotationDesigns,
  FormDataShirt,
  FormDataShort
} from 'components/Scripts/Interfaces'
import { message } from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { FormInstance } from 'antd'

export const fetchAndSetOrders = async (
  setOrders: React.Dispatch<React.SetStateAction<CuttingOrderData[]>>
) => {
  try {
    const response = await fetchOrders()
    setOrders(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const fetchAndSetQuotations = async (
  setDesigns: React.Dispatch<React.SetStateAction<quotationDesigns[]>>
) => {
  try {
    const response = await fetchQuotations()
    const allDesigns = response
      .map((quotation: any) => quotation.quotationDesigns)
      .flat()

    setDesigns(allDesigns)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const fetchAndSetMaterials = async (
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>
) => {
  try {
    const response = await fetchMaterials()
    setMaterials(response)
  } catch (error) {
    console.error('Error fetching and setting materials:', error)
  }
}


export const handleView = async (
  id: number,
  setQuotationProducts: (products: FormDataShirtView[]) => void,
  setVisible: (visible: boolean) => void,
  setCuttingOrder: (order: Quotation[]) => void
) => {
  try {
    const products = await fetchOrder(id)
    const cuttingOrder = await fetchQuotationOrder(id.toString())
    setQuotationProducts(products)
    setCuttingOrder(cuttingOrder)
    setVisible(true)
  } catch (error) {
    console.error('Error handling view:', error)
  }
}

export const filterOrders = (
  Orders: CuttingOrderData[],
  searchText: string
): CuttingOrderData[] => {
  return searchText
    ? Orders.filter((Orders) =>
        Object.values(Orders).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : Orders
}

export const addKeysToOrders = (
  Orders: CuttingOrderData[]
): (CuttingOrderData & { key: string })[] => {
  return Orders.map((Order, index) => ({
    ...Order,
    key: index.toString()
  }))
}

//Utils de crear orden de corte

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
  const updatedShirts = shirts.map((shirt, index) =>
    index === key ? { ...shirt, [column]: value } : shirt
  )
  setShirts(updatedShirts)
}

export const handleInputNumberChangeShorts = (
  shorts: FormDataShort[],
  setShorts: React.Dispatch<React.SetStateAction<FormDataShort[]>>,
  value: any,
  key: any,
  column: any
) => {
  const updatedShorts = shorts.map((short, index) =>
    index === key ? { ...short, [column]: value } : short
  )
  setShorts(updatedShorts)
}

export const calculateAndUpdateTotalShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  key: any,
  quantity: number
) => {
  const updatedShirts = shirts.map((shirt, index) => {
    if (index === key) {
      return { ...shirt, quantity }
    }
    return shirt
  })
  setShirts(updatedShirts)
}

export const calculateAndUpdateTotalShorts = (
  shorts: FormDataShort[],
  setShorts: React.Dispatch<React.SetStateAction<FormDataShort[]>>,
  key: any,
  quantity: number
) => {
  const updatedShorts = shorts.map((short, index) => {
    if (index === key) {
      return { ...short, quantity }
    }
    return short
  })
  setShorts(updatedShorts)
}

export const handleInputChangeShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  e: any,
  key: any,
  column: string
) => {
  if (column === 'observation') {
    const updatedShirts = shirts.map((shirt, index) =>
      index === key ? { ...shirt, [column]: e.target.value } : shirt
    )
    setShirts(updatedShirts)
  }
}

export const handleInputChangeShorts = (
  shorts: FormDataShort[],
  setShorts: React.Dispatch<React.SetStateAction<FormDataShort[]>>,
  e: any,
  key: any,
  column: string
) => {
  if (column === 'observation') {
    const updatedShorts = shorts.map((short, index) =>
      index === key ? { ...short, [column]: e.target.value } : short
    )
    setShorts(updatedShorts)
  }
}

export const handleGenderToggleShirts = (
  shirts: FormDataShirt[],
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>,
  key: any
) => {
  const updatedShirts = shirts.map((shirt, index) =>
    index === key ? { ...shirt, gender: shirt.gender === 1 ? 2 : 1 } : shirt
  )
  setShirts(updatedShirts)
}

export const handleGenderToggleShorts = (
  shorts: FormDataShort[],
  setShorts: React.Dispatch<React.SetStateAction<FormDataShort[]>>,
  key: any
) => {
  const updatedShorts = shorts.map((short, index) =>
    index === key ? { ...short, gender: short.gender === 1 ? 2 : 1 } : short
  )
  setShorts(updatedShorts)
}

export const isSaveButtonDisabled = (shirts: FormDataShirt[]): boolean => {
  return shirts.some(
    (shirt) =>
      !shirt.observation?.trim() ||
      !shirt.quantity ||
      !shirt.gender ||
      !shirt.size?.trim()
  )
}

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
  try {
    const values = await ShirtForm.validateFields()
    const {
      frontClothColor,
      neckClothColor,
      sleeveClothColor,
      cuffClothColor,
      image,
      ...restValues
    } = values

    if (file) {
      try {
        const response = await uploadImageShirt(file)
        setImageFileName(response)
        message.success('Imagen subida exitosamente')
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        message.error('Error al subir la imagen')
        return null
      }
    }

    const formData: FormDataShirt = {
      ...restValues,
      productType: productType
    }
    setShirts([...shirts, { ...formData }])
    console.log(shirts)
    ShirtForm.resetFields()
  } catch (errorInfo) {
    console.error('Failed:', errorInfo)
  }

  try {
    const values = await CuttingForm.validateFields()
    const formDataCut: CuttingOrderData = {
      ...values
    }

    setCuttingOrderDt([...CuttingOrderDt, { ...formDataCut }])
  } catch (errorInfo) {
    console.error('Failed:', errorInfo)
  }
}

export const handleFormSubmitShort = async (
  ShortForm: FormInstance,
  setShorts: any,
  CuttingForm: FormInstance,
  setCuttingOrderDt: any,
  shorts: FormDataShort[],
  CuttingOrderDt: any,
  productTypeShort: number | null,
  file: File | null,
  setImageFileName: (fileName: string | null) => void
) => {
  try {
    const values = await ShortForm.validateFields()
    const { clothShortColor, clothViewColor, image, ...restValues } = values

    if (file) {
      try {
        const response = await uploadImageShort(file)
        setImageFileName(response)
        message.success('Imagen subida exitosamente')
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        message.error('Error al subir la imagen')
        return null
      }
    }

    const formData: FormDataShirt = {
      ...restValues
    }

    setShorts([...shorts, { ...formData }])
    ShortForm.resetFields()
  } catch (errorInfo) {
    console.error('Failed:', errorInfo)
  }

  try {
    const values = await CuttingForm.validateFields()
    const formDataCut: CuttingOrderData = {
      ...values
    }

    setCuttingOrderDt([...CuttingOrderDt, { ...formDataCut }])
  } catch (errorInfo) {
    console.error('Failed:', errorInfo)
  }
}

export const useFormHandler = (materials: any[]) => {
  const [colors, setColors] = useState({
    frontClothColor: '',
    neckClothColor: '',
    sleeveClothColor: '',
    cuffClothColor: ''
  })

  const handleMaterialChange = (
    field: string,
    materialId: string,
    ShirtForm: FormInstance
  ) => {
    const selectedMaterial = materials.find(
      (material) => material.id === materialId
    )
    if (selectedMaterial) {
      setColors((prevColors) => ({
        ...prevColors,
        [field]: selectedMaterial.color
      }))
      ShirtForm.setFieldsValue({
        [field]: selectedMaterial.color
      })
    }
  }
  return {
    colors,
    handleMaterialChange
  }
}

export const useFormHandlerShort = (materials: any[]) => {
  const [colorsShorts, setColorsShorts] = useState({
    clothShortColor: '',
    clothViewColor: ''
  })

  const handleMaterialChangeShorts = (
    field: string,
    materialId: string,
    ShirtForm: FormInstance
  ) => {
    const selectedMaterial = materials.find(
      (material) => material.id === materialId
    )
    if (selectedMaterial) {
      setColorsShorts((prevColors) => ({
        ...prevColors,
        [field]: selectedMaterial.color
      }))
      ShirtForm.setFieldsValue({
        [field]: selectedMaterial.color
      })
    }
  }
  return {
    colorsShorts,
    handleMaterialChangeShorts
  }
}

export const handleSubmitShirts = async (
  shirts: FormDataShirt[],
  CuttingOrderDt: CuttingOrderData[],
  quotationId: number,
  imageFileName: string | null
) => {
  console.log(imageFileName)
  const Type: boolean = true
  const DesignData = {
    quotationId,
    ...(imageFileName ? { designFront: imageFileName } : {}),
  }

  try {
    for (const shirt of shirts) {
      const shirtData = { ...shirt, quotationId }
      const response = await addQuotationProductShirt(shirtData)

      if ((response.status = true)) {
        message.success('Camiseta agregada con éxito')
      } else {
        message.error('Error al agregar camiseta')
      }
    }

    const designResponse = await addDesign(DesignData)
    if ((designResponse.status = true)) {
      message.success('Diseño agregado con éxito')

      if (CuttingOrderDt.length > 0) {
        const cuttingOrderResponse = await addCuttingOrder({
          ...CuttingOrderDt[0],
          quotationId
        })

        if ((cuttingOrderResponse.status = true)) {
          message.success('Orden de corte generada con éxito')
        } else {
          message.error('Error al generar la orden de corte')
        }
      }
    } else {
      message.error('Error al agregar el diseño')
    }
  } catch (error) {
    console.error(
      'Error al enviar datos de las camisetas, diseño o generar la orden de corte:',
      error
    )
    message.error('Ocurrió un error durante el proceso')
  }
}

export const handleSubmitShorts = async (
  shorts: FormDataShort[],
  CuttingOrderDt: CuttingOrderData[],
  quotationId: number,
  imageFileName: string | null
) => {
  console.log(imageFileName)
  const Type: boolean = true
  const DesignData = {
    quotationId,
    ...(imageFileName ? { design: imageFileName } : {}),
  }

  try {
    for (const short of shorts) {
      const shortData = { ...short, quotationId }
      const response = await addQuotationProductShort(shortData)

      if ((response.status = true)) {
        message.success('Camiseta agregada con éxito')
      } else {
        message.error('Error al agregar camiseta')
      }
    }

    const designResponse = await addDesign(DesignData)
    if ((designResponse.status = true)) {
      message.success('Diseño agregado con éxito')

      if (CuttingOrderDt.length > 0) {
        const cuttingOrderResponse = await addCuttingOrder({
          ...CuttingOrderDt[0],
          quotationId
        })

        if ((cuttingOrderResponse.status = true)) {
          message.success('Orden de corte generada con éxito')
        } else {
          message.error('Error al generar la orden de corte')
        }
      }
    } else {
      message.error('Error al agregar el diseño')
    }
  } catch (error) {
    console.error(
      'Error al enviar datos de las camisetas, diseño o generar la orden de corte:',
      error
    )
    message.error('Ocurrió un error durante el proceso')
  }
}

export const handleViewDetailsShirts = (
  record: any,
  setSelectedShirt: React.Dispatch<React.SetStateAction<FormDataShirt | null>>,
  SetisModalShirtsTempVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedShirt(record)
  SetisModalShirtsTempVisible(true)
}

export const handleViewDetailsShorts = (
  record: any,
  setSelectedShort: React.Dispatch<React.SetStateAction<FormDataShort | null>>,
  SetisModalShortsTempVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedShort(record)
  SetisModalShortsTempVisible(true)
}

export const handleCutSubmitShirts = async (
  selectedQuotation: { id: number } | null,
  shirts: FormDataShirt[],
  CuttingOrderDt: CuttingOrderData[],
  imageFileName: string | null
) => {
  console.log(shirts)
  if (selectedQuotation) {
    await handleSubmitShirts(
      shirts,
      CuttingOrderDt,
      selectedQuotation.id,
      imageFileName
    )
  } else {
    console.error('No quotation selected')
  }
}

export const handleCutSubmitShorts = async (
  selectedQuotation: { id: number } | null,
  shorts: FormDataShort[],
  CuttingOrderDt: CuttingOrderData[],
  imageFileName: string | null
) => {
  if (selectedQuotation) {
    await handleSubmitShorts(
      shorts,
      CuttingOrderDt,
      selectedQuotation.id,
      imageFileName
    )
  } else {
    console.error('No quotation selected')
  }
}

export const handleDuplicateOrderShirts = (
  shirtToDuplicate: any,
  setShirts: React.Dispatch<React.SetStateAction<FormDataShirt[]>>
) => {
  const { key, ...restShirt } = shirtToDuplicate
  const newShirt = { ...restShirt }

  console.log(newShirt)
  setShirts((prevShirts) => [...prevShirts, newShirt])
}
export const handleDuplicateOrderShorts = (
  shortToDuplicate: FormDataShort,
  setShorts: React.Dispatch<React.SetStateAction<FormDataShort[]>>
) => {
  const newShort = { ...shortToDuplicate, key: Date.now() }
  setShorts((prevShorts) => [...prevShorts, newShort])
}

const uploadImageShirt = async (file: File): Promise<string> => {
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

const uploadImageShort = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      'http://localhost:3001/api/upload/single/quotation_short',
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
