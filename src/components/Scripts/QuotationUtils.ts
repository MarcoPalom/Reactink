import { message, Modal } from 'antd'
import {
  deleteQuotation,
  deleteQuotationProduct,
  deleteQuotationProductMaquila,
  fetchQuotation,
  fetchQuotations,
  updateQuotation,
  addQuotation,
  addQuotationProduct,
  addQuotationProductMaquila,
  EditQuotationProduct,
  EditQuotationProductMaquila,
  fetchClients,
  fetchQuotationProducts,
  fetchQuotationProductsMaquila
} from 'components/Scripts/Apicalls'
import {
  Quotation,
  QuotationProduct,
  QuotationProductMaquila,
  Client
} from 'components/Scripts/Interfaces'
import { FormInstance } from 'antd'

const { confirm } = Modal

//Fetchers

export const fetchAndSetQuotations = async (
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>
) => {
  try {
    const response = await fetchQuotations()
    setQuotations(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const fetchAndSetClients = async (
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
) => {
  try {
    const response = await fetchClients()
    setClients(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const fetchAndSetQuotationProducts = async (
  selectedQuotation: Quotation | null,
  setQuotationProducts: (products: QuotationProduct[]) => void
) => {
  try {
    if (selectedQuotation) {
      const response = await fetchQuotationProducts(selectedQuotation.id)
      const filteredProducts = filterProductsByQuotationId(
        response,
        selectedQuotation.id
      )
      setQuotationProducts(filteredProducts)
    } else {
      setQuotationProducts([])
    }
  } catch (error) {
    console.error('Error fetching quotation products:', error)
  }
}

export const fetchAndSetQuotationProductsMaquila = async (
  selectedQuotation: Quotation | null,
  setQuotationProductsMaquila: (products: QuotationProductMaquila[]) => void
) => {
  try {
    if (selectedQuotation) {
      const response = await fetchQuotationProductsMaquila(selectedQuotation.id)
      const filteredProducts = filterProductsMaquilaByQuotationId(
        response,
        selectedQuotation.id
      )
      setQuotationProductsMaquila(filteredProducts)
    } else {
      setQuotationProductsMaquila([])
    }
  } catch (error) {
    console.error('Error fetching quotation products:', error)
  }
}

//HANDLERS//

//check
export const handleEdit = async (
  record: any,
  setEditingQuotation: (editingQuotation: Quotation) => void,
  EditForm: FormInstance,
  setVisibleEdit: (VisibleEdit: boolean) => void,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >
) => {
  try {
    const fullRecord = await fetchQuotation(record.id.toString())

    const formattedRecord = {
      ...fullRecord,
      dateReceipt: fullRecord.dateReceipt ? fullRecord.dateReceipt.split('T')[0] : null,
      expirationDate: fullRecord.expirationDate ? fullRecord.expirationDate.split('T')[0] : null
    }

    const maquilaProducts = formattedRecord.quotation_product_maquila || formattedRecord.quotationProductMaquila
    if (Array.isArray(maquilaProducts) && maquilaProducts.length > 0) {
      const maquilaWithKeys = maquilaProducts.map(
        (p: any, i: number) => ({ ...p, key: i })
      )
      setDataSourceProductsMaquila(maquilaWithKeys)
    }

    const products = formattedRecord.quotation_product || formattedRecord.quotationProduct
    if (Array.isArray(products) && products.length > 0) {
      const productsWithKeys = products.map(
        (p: any, i: number) => ({ ...p, key: i })
      )
      setDataSourceProducts(productsWithKeys)
    }
    setEditingQuotation(formattedRecord)
    EditForm.setFieldsValue(formattedRecord)
    setVisibleEdit(true)
  } catch (error) {
    console.error('Error al editar la Cotizacion:', error)
  }
}

export const handleView = async (
  id: string,
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>,
  setVisible: (visible: boolean) => void
) => {
  try {
    const data = await fetchQuotation(id)

    setSelectedQuotation(data)
    setVisible(true)
  } catch (error) {
    console.error('Error fetching Quotation details:', error)
  }
}

//check
export const handleSave = async (
  EditForm: FormInstance,
  editingQuotation: Quotation,
  Quotations: Quotation[],
  setQuotations: (quotations: Quotation[]) => void,
  setVisibleEdit: (visible: boolean) => void,
  setTaxLocked: (locked: boolean) => void,
  dataSourceProducts: QuotationProduct[],
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >
) => {
  try {
    const values = await EditForm.validateFields()

    if (values.dateReceipt) {
      values.dateReceipt = new Date(values.dateReceipt).toISOString()
    }
    if (values.expirationDate) {
      values.expirationDate = new Date(values.expirationDate).toISOString()
    }

    await updateQuotation(editingQuotation.id, values)
    message.success('Cotización actualizada exitosamente')

    const updatedQuotations = Quotations.map((Quotation) =>
      Quotation.id === editingQuotation.id
        ? { ...Quotation, ...values }
        : Quotation
    )

    setQuotations(updatedQuotations)

    for (const item of dataSourceProductsMaquila) {
      const pivotDataProductMaquila = {
        quotationId: editingQuotation.id,
        description: item.description,
        quantity: item.quantity,
        meters_impression: item.meters_impression,
        price_unit: item.price_unit,
        price_meter: item.price_meter,
        amount: item.amount
      }
      if (item.id) {
        await EditQuotationProductMaquila(item.id, pivotDataProductMaquila)
      } else {
        await addQuotationProductMaquila(pivotDataProductMaquila)
      }
    }

    for (const item of dataSourceProducts) {
      const pivotDataProduct = {
        quotationId: editingQuotation.id,
        description: item.description,
        quantity: item.quantity,
        amount: item.amount,
        tax: item.tax,
        total: item.total
      }
      if (item.id) {
        await EditQuotationProduct(item.id, pivotDataProduct)
      } else {
        await addQuotationProduct(pivotDataProduct)
      }
    }
    setDataSourceProducts([])
    setDataSourceProductsMaquila([])
    setTaxLocked(false)
    setVisibleEdit(false)
    EditForm.resetFields()
  } catch (error) {
    console.error('Error updating Quotation:', error)
    message.error('Error al actualizar la Cotización')
  }
}

//check
export const handleAddSave = async (
  addForm: FormInstance,
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>,
  dataSourceProducts: QuotationProduct[],
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >
) => {
  try {
    const values = await addForm.validateFields()
    const newQuotation = await addQuotation(values)

    if (dataSourceProductsMaquila.length > 0) {
      for (const item of dataSourceProductsMaquila) {
        const pivotDataProductMaquila = {
          quotationId: newQuotation.id,
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

    if (dataSourceProducts.length > 0) {
      for (const item of dataSourceProducts) {
        const pivotDataProduct = {
          quotationId: newQuotation.id,
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

    setQuotations((prevQuotations) => [...prevQuotations, newQuotation])
    message.success('Cotización agregada exitosamente')
    setVisibleAdd(false)
    addForm.resetFields()
    setDataSourceProductsMaquila([])
    setDataSourceProducts([])
  } catch (error: any) {
    console.error('Error adding Quotation:', error)
    message.error(
      error.response?.data.message || 'Error al agregar la Cotización'
    )
  }
}

//check
export const handleDelete = (
  record: any,
  Quotations: Quotation[],
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar la cotizacion?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      await deleteQuotation(record.id)
      const updatedQuotations = Quotations.filter(
        (Quotation: Quotation) => Quotation.id !== record.id
      )
      setQuotations(updatedQuotations)
    }
  })
}

//check
export const handleDeleteProduct = (
  record: any,
  quotationProductsMaquila: QuotationProductMaquila[],
  setQuotationProductsMaquila: (products: QuotationProductMaquila[]) => void,
  quotationProducts: QuotationProduct[],
  setQuotationProducts: (products: QuotationProduct[]) => void
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
            (quotationProducts: QuotationProduct) =>
              quotationProducts.id !== record.id
          )

          setQuotationProducts(updatedProducts)
        } else if ('price_meter' in record) {
          await deleteQuotationProductMaquila(record.id, emptyData)

          const updatedProducts = quotationProductsMaquila.filter(
            (quotationProductsMaquila: QuotationProductMaquila) =>
              quotationProductsMaquila.id !== record.id
          )

          setQuotationProductsMaquila(updatedProducts)
        }

        message.success('Producto eliminado exitosamente')
      } catch (error) {
        message.error('Error al eliminar el producto')
        console.log(error)
      }
    }
  })
}

export const handleDeleteProductEdit = (
  record: any,
  dataSourceProducts: QuotationProduct[],
  setDataSourceProducts: React.Dispatch<React.SetStateAction<QuotationProduct[]>>,
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setDataSourceProductsMaquila: React.Dispatch<React.SetStateAction<QuotationProductMaquila[]>>
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar este producto?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        if (record.id) {
          const emptyData = {}
          if ('tax' in record) {
            await deleteQuotationProduct(record.id, emptyData)
          } else if ('price_meter' in record) {
            await deleteQuotationProductMaquila(record.id, emptyData)
          }
        }
        if ('tax' in record) {
          const updated = dataSourceProducts.filter((p) => p.key !== record.key)
          setDataSourceProducts(updated)
        } else if ('price_meter' in record) {
          const updated = dataSourceProductsMaquila.filter((p) => p.key !== record.key)
          setDataSourceProductsMaquila(updated)
        }
        message.success('Producto eliminado exitosamente')
      } catch (error) {
        message.error('Error al eliminar el producto')
        console.log(error)
      }
    }
  })
}

export const handleCloseEdit = (
  EditForm: FormInstance,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setTaxLocked: React.Dispatch<React.SetStateAction<boolean>>,
  setSaveLocked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  EditForm.resetFields()
  setDataSourceProducts([])
  setDataSourceProductsMaquila([])
  setVisibleEdit(false)
  setTaxLocked(false)
  setSaveLocked(false)
}

export const handleAddCancel = (
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>,
  addForm: FormInstance,
  setTaxLocked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setDataSourceProducts([])
  setDataSourceProductsMaquila([])
  setVisibleAdd(false)
  addForm.resetFields()
  setTaxLocked(false)
}

export const handleSaveClick = async (
  EditForm: FormInstance,
  editingQuotation: Quotation | null,
  Quotations: Quotation[],
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>,
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setTaxLocked: React.Dispatch<React.SetStateAction<boolean>>,
  dataSourceProducts: QuotationProduct[],
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >
) => {
  if (editingQuotation) {
    await handleSave(
      EditForm,
      editingQuotation,
      Quotations,
      setQuotations,
      setVisibleEdit,
      setTaxLocked,
      dataSourceProducts,
      dataSourceProductsMaquila,
      setDataSourceProductsMaquila,
      setDataSourceProducts
    )
  } else {
    console.error('No hay una cotización en edición')
    message.error('Error al guardar la Cotización')
    return
  }
}

export const handleAddSaveClick = async (
  addForm: FormInstance,
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>,
  dataSourceProducts: QuotationProduct[],
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >
) => {
  await handleAddSave(
    addForm,
    setVisibleAdd,
    setQuotations,
    dataSourceProducts,
    dataSourceProductsMaquila,
    setDataSourceProductsMaquila,
    setDataSourceProducts
  )
}

export const handleEditClick = async (
  record: any,
  setEditingQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>,
  EditForm: FormInstance,
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >
) => {
  handleEdit(
    record,
    setEditingQuotation,
    EditForm,
    setVisibleEdit,
    setDataSourceProducts,
    setDataSourceProductsMaquila
  )
}

export const handleDeleteProductsClick = (
  record: any,
  quotationProductsMaquila: QuotationProductMaquila[],
  setQuotationProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  quotationProducts: QuotationProduct[],
  setQuotationProducts: React.Dispatch<React.SetStateAction<QuotationProduct[]>>
) => {
  handleDeleteProduct(
    record,
    quotationProductsMaquila,
    setQuotationProductsMaquila,
    quotationProducts,
    setQuotationProducts
  )
}

export const handleViewClick = async (
  id: string,
  setSelectedQuotation: React.Dispatch<React.SetStateAction<any>>,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  await handleView(id, setSelectedQuotation, setVisible)
}

export const handleDeleteClick = (
  record: any,
  Quotations: Quotation[],
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>
) => {
  handleDelete(record, Quotations, setQuotations);
};

export const toggleShirtForm = (
  isShirtFormVisible: boolean,
  setIsShirtFormVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setProductType: React.Dispatch<React.SetStateAction<number | null>>
) => {
  setIsShirtFormVisible(!isShirtFormVisible);
  setProductType(isShirtFormVisible ? null : 1);
};

export const toggleShortForm = (
  isShortFormVisible: boolean,
  setIsShortFormVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setProductTypeShort: React.Dispatch<React.SetStateAction<number | null>>
) => {
  setIsShortFormVisible(!isShortFormVisible);
  setProductTypeShort(isShortFormVisible ? null : 1);
};


//CALCULOS//

//check
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

//check
export const handleFieldChange = (
  value: any,
  key: number,
  column: string,
  dataSourceProducts: any[],
  setDataSourceProducts: React.Dispatch<React.SetStateAction<QuotationProduct[]>>,
  setSaveLocked: (locked: boolean) => void
) => {
  const newData = [...dataSourceProducts];
  const index = newData.findIndex((item) => key === item.key);
  if (index > -1) {
    const item = newData[index];
    newData.splice(index, 1, { ...item, [column]: value });

    if (column === 'tax' && newData[index].tax > 0) {
      newData[index].total =
        newData[index].amount * newData[index].quantity * (1 + newData[index].tax / 100);
    } else {
      newData[index].total = newData[index].amount * newData[index].quantity;
    }

    setDataSourceProducts(newData);
    setSaveLocked(true);
  }
};

export const handleFieldChangeEdit = (
  value: any,
  productId: number,
  column: string,
  dataSourceProducts: any[],
  setDataSourceProducts: React.Dispatch<React.SetStateAction<QuotationProduct[]>>,
  setSaveLocked: (locked: boolean) => void
) => {
  const newData = [...dataSourceProducts];
  const index = newData.findIndex((item) => item.id === productId);

  if (index > -1) {
    const item = newData[index];
    newData.splice(index, 1, { ...item, [column]: value });

    if (column === 'tax' && newData[index].tax > 0) {
      newData[index].total =
        newData[index].amount * newData[index].quantity * (1 + newData[index].tax / 100);
    } else {
      newData[index].total = newData[index].amount * newData[index].quantity;
    }

    setDataSourceProducts(newData);
    setSaveLocked(true);
  } else {
    console.error('No se encontró el producto con ID:', productId);
  }
};

//check
export const handleFieldChangeMaquila = (
  value: any,
  key: string,
  column: string,
  dataSourceProductsMaquila: any[],
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setSaveLocked: (locked: boolean) => void
) => {
  const newData = [...dataSourceProductsMaquila]
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

    setDataSourceProductsMaquila(newData)
    setSaveLocked(true)
  }
}

//check
export const calculateSubtotal = (dataSourceProducts: QuotationProduct[]) => {
  const newSubtotal = dataSourceProducts.reduce(
    (acc, item) => acc + (parseFloat(String(item.total)) || 0),
    0
  )
  return newSubtotal
}
//check
export const calculateSubtotalMaquila = (
  dataSourceProductsMaquila: QuotationProductMaquila[]
) => {
  const newSubtotal = dataSourceProductsMaquila.reduce(
    (acc, item) => acc + (parseFloat(String(item.amount)) || 0),
    0
  )
  return newSubtotal
}

//check
export const calculateTaxAndNetAmount = (addForm: FormInstance) => {
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

//check
export const calculateTaxAndNetAmountEdit = (EditForm: FormInstance) => {
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

//check
export const calculateTotal = (addForm: FormInstance) => {
  const netAmount = addForm.getFieldValue('netAmount') || 0
  const advance = addForm.getFieldValue('advance') || 0

  if (isNaN(netAmount) || isNaN(advance)) {
    return 0
  }
  const newTotal = netAmount - advance
  return newTotal
}

//FUNCIONES TABLA AÑADIR COTIZACION BOTONES//

//check
export const handleAddRowProducts = (
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  dataSourceProducts: QuotationProduct[]
) => {
  const newRow = {
    key: count,
    description: '',
    amount: 0,
    quantity: 0,
    total: 0,
    quotationId: 0
  }
  setDataSourceProducts([...dataSourceProducts, newRow])
  setCount(count + 1)
}

//check
export const handleAddRowMaquila = (
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  dataSourceProductsMaquila: QuotationProductMaquila[]
) => {
  const newRow = {
    key: count,
    description: '',
    amount: 0,
    quantity: 0,
    price_unit: 0,
    quotationId: 0
  }
  setDataSourceProductsMaquila([...dataSourceProductsMaquila, newRow])
  setCount(count + 1)
}

//check
export const handleEmpty = (
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  setDataSourceProducts: React.Dispatch<
    React.SetStateAction<QuotationProduct[]>
  >,
  setTaxLocked: (locked: boolean) => void,
  setSaveLocked: (locked: boolean) => void,
  EditForm: FormInstance
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres limpiar la tabla?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      setDataSourceProductsMaquila([])
      setDataSourceProducts([])
      EditForm.resetFields()
      EditForm.setFieldsValue({ subtotal: 0 })
      EditForm.setFieldsValue({ netAmount: 0 })
      EditForm.setFieldsValue({ total: 0 })
      EditForm.setFieldsValue({ tax: 0 })
      EditForm.setFieldsValue({ advance: 0 })
      setTaxLocked(false)
      setSaveLocked(true)
    }
  })
}

//check
export const handleAddRowProductMaquila = (
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  setDataSourceProductsMaquila: React.Dispatch<
    React.SetStateAction<QuotationProductMaquila[]>
  >,
  dataSourceProductsMaquila: QuotationProductMaquila[]
) => {
  let idBeg = 0
  let quotationId = 0

  if (
    dataSourceProductsMaquila.length > 0 &&
    dataSourceProductsMaquila[0].id !== undefined
  ) {
    idBeg = dataSourceProductsMaquila[0].id
    quotationId = dataSourceProductsMaquila[0].quotationId
  }

  const newRow = {
    key: count,
    id: idBeg,
    quotationId: quotationId,
    description: '',
    quantity: 0,
    meters_impression: 0,
    price_unit: 0,
    price_meter: 0,
    amount: 0
  }

  setDataSourceProductsMaquila([...dataSourceProductsMaquila, newRow])
  setCount(count + 1)
}

//check
export const handleFinish = (
  addForm: FormInstance,
  dataSourceProducts: QuotationProduct[]
) => {
  const newSubtotal = calculateSubtotal(dataSourceProducts)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  addForm.setFieldsValue({ subtotal: newSubtotal })
  addForm.setFieldsValue({ netAmount: newNetAmount })
  addForm.setFieldsValue({ total: newTotal })
  addForm.setFieldsValue({ tax: 0 })
  addForm.setFieldsValue({ advance: 0 })
}

//check
export const handleFinishMaquila = (
  addForm: FormInstance,
  dataSourceProductsMaquila: QuotationProductMaquila[]
) => {
  const newSubtotal = calculateSubtotalMaquila(dataSourceProductsMaquila)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  addForm.setFieldsValue({ subtotal: newSubtotal })
  addForm.setFieldsValue({ netAmount: newNetAmount })
  addForm.setFieldsValue({ total: newTotal })
  addForm.setFieldsValue({ tax: 0 })
  addForm.setFieldsValue({ advance: 0 })
}

//check
export const handleFinishEdit = (
  EditForm: FormInstance,
  dataSourceProducts: QuotationProduct[],
  setSaveLocked: (locked: boolean) => void
) => {
  const newSubtotal = calculateSubtotal(dataSourceProducts)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  EditForm.setFieldsValue({ subtotal: newSubtotal })
  EditForm.setFieldsValue({ netAmount: newNetAmount })
  EditForm.setFieldsValue({ total: newTotal })
  EditForm.setFieldsValue({ tax: 0 })
  EditForm.setFieldsValue({ advance: 0 })
  setSaveLocked(false)
}

//check
export const handleFinishMaquilaEdit = (
  EditForm: FormInstance,
  dataSourceProductsMaquila: QuotationProductMaquila[],
  setSaveLocked: (locked: boolean) => void
) => {
  const newSubtotal = calculateSubtotalMaquila(dataSourceProductsMaquila)
  const newNetAmount = newSubtotal
  const newTotal = newSubtotal
  EditForm.setFieldsValue({ subtotal: newSubtotal })
  EditForm.setFieldsValue({ netAmount: newNetAmount })
  EditForm.setFieldsValue({ total: newTotal })
  EditForm.setFieldsValue({ tax: 0 })
  EditForm.setFieldsValue({ advance: 0 })
  setSaveLocked(false)
}

//UTILS// all check

const filterProductsByQuotationId = (
  products: QuotationProduct[],
  quotationId: number
) => {
  return products.filter(
    (product: QuotationProduct) => product.quotationId === quotationId
  )
}
const filterProductsMaquilaByQuotationId = (
  products: QuotationProductMaquila[],
  quotationId: number
) => {
  return products.filter(
    (product: QuotationProductMaquila) => product.quotationId === quotationId
  )
}

export const filterQuotations = (
  Quotations: Quotation[],
  searchText: string
) => {
  return searchText
    ? Quotations.filter((Quotation) =>
        Quotation.id.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : Quotations
}

export const addKeysToQuotations = (Quotations: Quotation[]) => {
  return Quotations.map((Quotation, index) => ({
    ...Quotation,
    key: index.toString()
  }))
}
