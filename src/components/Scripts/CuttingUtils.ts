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
  addDesign,
  updateCuttingOrder,
  deleteCuttingOrder,
  fetchCuttingOrderDetails,
  updateQuotationProductShirt,
  updateQuotationProductShort,
  updateQuotationDesign,
  checkCuttingOrderExists,
  fetchSizes
} from 'components/Scripts/Apicalls'
import { API_BASE_URL } from 'config/api.config'
import {
  CuttingOrderData,
  FormDataShirtView,
  Quotation,
  Material,
  quotationDesigns,
  FormDataShirt,
  FormDataShort,
  FormDataShortView
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
  setQuotationProducts: (products: (FormDataShirtView | FormDataShortView)[]) => void,
  setVisible: (visible: boolean) => void,
  setCuttingOrder: (order: Quotation[]) => void,
  setDesignImage?: (imageUrl: string | null) => void,
  setCurrentDesign?: (design: any) => void
): Promise<(FormDataShirtView | FormDataShortView)[]> => {
  try {
    const products = await fetchOrder(id);
    console.log("breakpoint cutt procuctos", products)
    const cuttingOrder = await fetchQuotationOrder(id.toString());
    setQuotationProducts(products);
    setCuttingOrder(cuttingOrder);
    
    // Obtener la imagen del diseño si existe
    if (cuttingOrder) {
      const quotationData = cuttingOrder as any;
      if (quotationData.quotationDesigns && quotationData.quotationDesigns.length > 0) {
        const design = quotationData.quotationDesigns[0];
        
        // Guardar el diseño actual para edición
        if (setCurrentDesign) {
          setCurrentDesign(design);
        }
        
        // Priorizar: designFront (playeras) > designShort > design > imageReference > logo
        if (setDesignImage) {
          if (design.designFront) {
            // Las imágenes de playeras se guardan en quotation_shirt
            setDesignImage(`${API_BASE_URL}/image/quotation_shirt/${design.designFront}`);
          } else if (design.designShort || design.design) {
            // Las imágenes de shorts se guardan en quotation_short
            const shortImage = design.designShort || design.design;
            setDesignImage(`${API_BASE_URL}/image/quotation_short/${shortImage}`);
          } else if (design.imageReference) {
            setDesignImage(`${API_BASE_URL}/image/quotation_design/${design.imageReference}`);
          } else if (design.logo) {
            setDesignImage(`${API_BASE_URL}/image/quotation_design/${design.logo}`);
          } else {
            setDesignImage(null);
          }
        }
      } else {
        if (setDesignImage) setDesignImage(null);
        if (setCurrentDesign) setCurrentDesign(null);
      }
    }
    
    setVisible(true);
    return products; // Devolver los productos para uso inmediato
  } catch (error) {
    console.error('Error handling view:', error);
    return [];
  }
};

// Función para abrir el modal de edición
export const handleEdit = async (
  record: CuttingOrderData,
  setEditingOrder: (order: CuttingOrderData) => void,
  editForm: FormInstance,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    setEditingOrder(record);
    // Formatear las fechas para el input type="date"
    const formattedRecord = {
      ...record,
      dateReceipt: record.dateReceipt ? new Date(record.dateReceipt).toISOString().split('T')[0] : '',
      dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : ''
    };
    editForm.setFieldsValue(formattedRecord);
    setVisibleEdit(true);
  } catch (error) {
    console.error('Error al preparar la edición:', error);
    message.error('Error al cargar los datos de la orden');
  }
};

// Función para guardar los cambios de edición
export const handleSave = async (
  editForm: FormInstance,
  editingOrder: CuttingOrderData | null,
  orders: CuttingOrderData[],
  setOrders: (orders: CuttingOrderData[]) => void,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    const values = await editForm.validateFields();
    
    if (editingOrder) {
      const updatedData = {
        dateReceipt: values.dateReceipt,
        dueDate: values.dueDate
      };
      
      await updateCuttingOrder(editingOrder.id, updatedData);
      message.success('Orden de corte actualizada exitosamente');

      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id
          ? { ...order, ...updatedData }
          : order
      );

      setOrders(updatedOrders);
    } else {
      message.error('No hay orden para actualizar');
    }
  } catch (error) {
    console.error('Error al actualizar la orden de corte:', error);
    message.error('Error al actualizar la orden de corte');
  } finally {
    setVisibleEdit(false);
    editForm.resetFields();
  }
};

// Función para cerrar el modal de edición
export const handleCloseEdit = (
  editForm: FormInstance,
  setVisibleEdit: (visible: boolean) => void
) => {
  editForm.resetFields();
  setVisibleEdit(false);
};

// Función para eliminar una orden de corte
export const handleDelete = (
  record: CuttingOrderData,
  orders: CuttingOrderData[],
  setOrders: (orders: CuttingOrderData[]) => void
) => {
  import('antd').then(({ Modal }) => {
    Modal.confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres eliminar la orden de corte #${record.id} (Cotización: ${record.quotationId})?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteCuttingOrder(record.id)
          .then(() => {
            message.success('Orden de corte eliminada exitosamente');
            const updatedOrders = orders.filter((order) => order.id !== record.id);
            setOrders(updatedOrders);
          })
          .catch((error) => {
            console.error('Error deleting cutting order:', error);
            message.error('Error al eliminar la orden de corte');
          });
      }
    });
  });
};

// Función para abrir el modal de edición de un producto (playera o short)
export const handleEditProduct = (
  product: FormDataShirtView | FormDataShortView,
  isShirt: boolean,
  setEditingProduct: (product: FormDataShirtView | FormDataShortView | null) => void,
  setIsEditingShirt: (isShirt: boolean) => void,
  editProductForm: FormInstance,
  setVisibleEditProduct: (visible: boolean) => void
) => {
  setEditingProduct(product);
  setIsEditingShirt(isShirt);
  editProductForm.setFieldsValue(product);
  setVisibleEditProduct(true);
};

// Función para guardar cambios de un producto (playera o short)
export const handleSaveProduct = async (
  editProductForm: FormInstance,
  editingProduct: FormDataShirtView | FormDataShortView | null,
  isEditingShirt: boolean,
  quotationProducts: (FormDataShirtView | FormDataShortView)[],
  setQuotationProducts: (products: (FormDataShirtView | FormDataShortView)[]) => void,
  setVisibleEditProduct: (visible: boolean) => void
) => {
  try {
    const values = await editProductForm.validateFields();

    if (editingProduct) {
      let updatedData: any;

      if (isEditingShirt) {
        const shirtProduct = editingProduct as FormDataShirtView;
        // Construir solo los campos que el backend acepta para playera
        updatedData = {
          quotationId: Number(shirtProduct.quotationId),
          productType: Number(shirtProduct.productType) || 1,
          discipline: values.discipline || shirtProduct.discipline,
          clothFrontShirtId: values.clothFrontShirtId ? Number(values.clothFrontShirtId) : shirtProduct.clothFrontShirtId,
          clothBackShirtId: values.clothBackShirtId ? Number(values.clothBackShirtId) : shirtProduct.clothBackShirtId,
          clothSleeveId: values.clothSleeveId ? Number(values.clothSleeveId) : shirtProduct.clothSleeveId,
          clothNecklineId: values.clothNecklineId ? Number(values.clothNecklineId) : shirtProduct.clothNecklineId,
          clothCuffId: values.clothCuffId ? Number(values.clothCuffId) : shirtProduct.clothCuffId,
          neckline: values.neckline || shirtProduct.neckline || null,
          typeNeckline: values.typeNeckline || shirtProduct.typeNeckline || null,
          sleeveType: values.sleeveType || shirtProduct.sleeveType || null,
          sleeveShape: values.sleeveShape || shirtProduct.sleeveShape || null,
          cuff: values.cuff || shirtProduct.cuff || null,
          typeCuff: values.typeCuff || shirtProduct.typeCuff || null,
          dtfShirt: values.dtfShirt || shirtProduct.dtfShirt || null,
          tShirtSection: shirtProduct.tShirtSection,
          size: values.size || shirtProduct.size,
          quantity: Number(values.quantity),
          gender: Number(values.gender),
          observation: values.observation || shirtProduct.observation || null,
        };

        console.log('Sending shirt data:', updatedData);
        await updateQuotationProductShirt(editingProduct.id, updatedData);
        message.success('Playera actualizada exitosamente');
      } else {
        const shortProduct = editingProduct as FormDataShortView;
        // Construir solo los campos que el backend acepta para short
        updatedData = {
          quotationId: Number(shortProduct.quotationId),
          productType: Number(shortProduct.productType) || 2,
          discipline: values.discipline || shortProduct.discipline,
          clothShortId: values.clothShortId ? Number(values.clothShortId) : shortProduct.clothShortId,
          viewShort: values.viewShort || shortProduct.viewShort || null,
          shortSection: values.shortSection || shortProduct.shortSection || null,
          dtfShort: values.dtfShort || shortProduct.dtfShort || null,
          size: values.size || shortProduct.size,
          quantity: Number(values.quantity),
          gender: Number(values.gender),
          observation: values.observation || shortProduct.observation || null,
        };

        console.log('Sending short data:', updatedData);
        await updateQuotationProductShort(editingProduct.id, updatedData);
        message.success('Short actualizado exitosamente');
      }

      // Actualizar la lista local de productos
      const updatedProducts = quotationProducts.map((p) =>
        p.id === editingProduct.id ? { ...p, ...values } : p
      );
      setQuotationProducts(updatedProducts);
    } else {
      message.error('No hay producto para actualizar');
    }
  } catch (error: any) {
    console.error('Error al actualizar el producto:', error);
    const errorMsg = error.response?.data?.error || 'Error al actualizar el producto';
    message.error(errorMsg);
  } finally {
    setVisibleEditProduct(false);
    editProductForm.resetFields();
  }
};

// Función para cerrar el modal de edición de producto
export const handleCloseEditProduct = (
  editProductForm: FormInstance,
  setVisibleEditProduct: (visible: boolean) => void
) => {
  editProductForm.resetFields();
  setVisibleEditProduct(false);
};

// Función para subir y actualizar la imagen de la orden de corte
export const handleUploadOrderImage = async (
  file: File,
  isShirt: boolean,
  currentDesign: any,
  quotationId: number,
  setImage: (imageUrl: string | null) => void,
  setCurrentDesign: (design: any) => void,
  setUploading: (uploading: boolean) => void
) => {
  setUploading(true);
  
  try {
    // Subir la imagen según el tipo (playera o short)
    const uploadType = isShirt ? 'quotation_shirt' : 'quotation_short';
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await axios.post(
      `${API_BASE_URL}/upload/single/${uploadType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const fileName = uploadResponse.data.fileName;

    // Preparar los datos del diseño
    const designField = isShirt ? 'designFront' : 'designShort';
    const designData = {
      quotationId,
      [designField]: fileName
    };

    if (currentDesign && currentDesign.id) {
      // Actualizar el diseño existente
      await updateQuotationDesign(currentDesign.id, designData);
      message.success('Imagen actualizada exitosamente');
      
      // Actualizar el diseño local
      setCurrentDesign({ ...currentDesign, [designField]: fileName });
    } else {
      // Crear nuevo diseño
      const newDesign = await addDesign(designData);
      message.success('Imagen agregada exitosamente');
      setCurrentDesign(newDesign);
    }

    // Actualizar la URL de la imagen mostrada
    setImage(`${API_BASE_URL}/image/${uploadType}/${fileName}`);

  } catch (error: any) {
    console.error('Error al subir la imagen:', error);
    const errorMsg = error.response?.data?.error || 'Error al subir la imagen';
    message.error(errorMsg);
  } finally {
    setUploading(false);
  }
};

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
  _file?: File | null,
  _setImageFileName?: (fileName: string | null) => void
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

    // La imagen se sube en el paso final (Lista e imagen), no aquí
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
  _file?: File | null,
  _setImageFileName?: (fileName: string | null) => void
) => {
  try {
    const values = await ShortForm.validateFields()
    const { clothShortColor, clothViewColor, image, ...restValues } = values

    // La imagen se sube en el paso final (Lista e imagen), no aquí
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

// Función para validar y limpiar datos de playera antes de enviar
const validateAndCleanShirtData = (shirt: FormDataShirt, quotationId: number): { isValid: boolean; data: any; error?: string } => {
  // Validar campos requeridos
  if (!quotationId || isNaN(Number(quotationId))) {
    return { isValid: false, data: null, error: 'Falta el ID de cotización' };
  }
  
  if (!shirt.discipline || typeof shirt.discipline !== 'string' || shirt.discipline.trim() === '') {
    return { isValid: false, data: null, error: 'Falta la disciplina' };
  }
  
  if (!shirt.size || typeof shirt.size !== 'string' || shirt.size.trim() === '') {
    return { isValid: false, data: null, error: 'Falta la talla' };
  }
  
  if (!shirt.quantity || isNaN(Number(shirt.quantity)) || Number(shirt.quantity) <= 0) {
    return { isValid: false, data: null, error: 'La cantidad debe ser un número válido mayor a 0' };
  }
  
  if (!shirt.gender || isNaN(Number(shirt.gender))) {
    return { isValid: false, data: null, error: 'Falta el género' };
  }

  // Función helper para convertir IDs a número o null
  const toNumberOrNull = (value: any): number | null => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  // Función helper para convertir strings vacíos a null
  const toStringOrNull = (value: any): string | null => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }
    return String(value);
  };

  // Construir objeto limpio con tipos correctos (tShirtType requerido por BD)
  const cleanData: any = {
    quotationId: Number(quotationId),
    productType: Number(shirt.productType) || 1,
    tShirtType: 1, // Requerido por BD en orden de corte
    discipline: shirt.discipline.trim(),
    size: shirt.size.trim(),
    quantity: Number(shirt.quantity),
    gender: Number(shirt.gender),
  };

  // Campos opcionales de IDs (números o null)
  const clothFrontShirtId = toNumberOrNull(shirt.clothFrontShirtId);
  if (clothFrontShirtId !== null) cleanData.clothFrontShirtId = clothFrontShirtId;

  const clothBackShirtId = toNumberOrNull(shirt.clothBackShirtId);
  if (clothBackShirtId !== null) cleanData.clothBackShirtId = clothBackShirtId;

  const clothNecklineId = toNumberOrNull(shirt.clothNecklineId);
  if (clothNecklineId !== null) cleanData.clothNecklineId = clothNecklineId;

  const clothSleeveId = toNumberOrNull(shirt.clothSleeveId);
  if (clothSleeveId !== null) cleanData.clothSleeveId = clothSleeveId;

  const clothCuffId = toNumberOrNull(shirt.clothCuffId);
  if (clothCuffId !== null) cleanData.clothCuffId = clothCuffId;

  // Campos opcionales de strings (strings o null)
  const neckline = toStringOrNull(shirt.neckline);
  if (neckline !== null) cleanData.neckline = neckline;

  const typeNeckline = toStringOrNull(shirt.typeNeckline);
  if (typeNeckline !== null) cleanData.typeNeckline = typeNeckline;

  const sleeveShape = toStringOrNull(shirt.sleeveShape);
  if (sleeveShape !== null) cleanData.sleeveShape = sleeveShape;

  const sleeveType = toStringOrNull(shirt.sleeveType);
  if (sleeveType !== null) cleanData.sleeveType = sleeveType;

  const cuff = toStringOrNull(shirt.cuff);
  if (cuff !== null) cleanData.cuff = cuff;

  const typeCuff = toStringOrNull(shirt.typeCuff);
  if (typeCuff !== null) cleanData.typeCuff = typeCuff;

  const dtfShirt = toStringOrNull(shirt.dtfShirt);
  if (dtfShirt !== null) cleanData.dtfShirt = dtfShirt;

  const observation = toStringOrNull(shirt.observation);
  if (observation !== null) cleanData.observation = observation;

  // Campo booleano opcional
  if (typeof shirt.tShirtSection === 'boolean') {
    cleanData.tShirtSection = shirt.tShirtSection;
  }

  return { isValid: true, data: cleanData };
};

// Función para validar que los materiales tengan el tamaño configurado
const validateMaterialSizes = async (
  shirt: FormDataShirt,
  size: string
): Promise<{ isValid: boolean; error?: string }> => {
  const materialFields = [
    { id: shirt.clothFrontShirtId, name: 'Tela Frente' },
    { id: shirt.clothBackShirtId, name: 'Tela Espalda' },
    { id: shirt.clothNecklineId, name: 'Tela Cuello' },
    { id: shirt.clothSleeveId, name: 'Tela Manga' },
    { id: shirt.clothCuffId, name: 'Tela Puño' },
  ];

  for (const field of materialFields) {
    if (field.id && Number(field.id) > 0) {
      try {
        const sizes = await fetchSizes(Number(field.id));
        // Verificar si el tamaño está configurado para este material
        const sizeExists = sizes.some((s: any) => s.size === size);
        if (!sizeExists) {
          return { 
            isValid: false, 
            error: `El material "${field.name}" (ID: ${field.id}) no tiene configurado el tamaño "${size}". Por favor, configure el tamaño en el inventario de materiales o seleccione otro material.` 
          };
        }
      } catch (error) {
        console.error(`Error validating material ${field.name}:`, error);
        return { 
          isValid: false, 
          error: `Error al validar el material "${field.name}". Verifique que el material exista.` 
        };
      }
    }
  }

  return { isValid: true };
};

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

  // Validar que haya playeras para enviar
  if (!shirts || shirts.length === 0) {
    message.error('No hay playeras para enviar');
    return;
  }

  // Validar quotationId
  if (!quotationId || isNaN(Number(quotationId))) {
    message.error('ID de cotización inválido');
    return;
  }

  try {
    for (const shirt of shirts) {
      // Validar y limpiar datos antes de enviar
      const validation = validateAndCleanShirtData(shirt, quotationId);
      
      if (!validation.isValid) {
        message.error(validation.error || 'Error de validación en playera');
        console.error('Validation error:', validation.error, shirt);
        return;
      }

      // Validar que los materiales tengan el tamaño configurado
      const materialValidation = await validateMaterialSizes(shirt, shirt.size);
      if (!materialValidation.isValid) {
        message.error(materialValidation.error || 'Error de validación de materiales');
        console.error('Material validation error:', materialValidation.error);
        return;
      }
      
      console.log('Sending clean shirt data:', validation.data);
      const response = await addQuotationProductShirt(validation.data)

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
        // Verificar si ya existe una orden de corte para esta cotización
        const existingOrder = await checkCuttingOrderExists(quotationId)
        
        if (existingOrder.exists) {
          // Si ya existe, actualizar en lugar de crear
          message.info('Ya existe una orden de corte para esta cotización. Actualizando...')
          try {
            const updateResponse = await updateCuttingOrder(existingOrder.orderId!, {
              ...CuttingOrderDt[0],
              quotationId
            })
            if (updateResponse) {
              message.success('Orden de corte actualizada con éxito')
            }
          } catch (updateError) {
            console.error('Error al actualizar orden de corte:', updateError)
            message.error('Error al actualizar la orden de corte existente')
          }
        } else {
          // Si no existe, crear una nueva
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

// Función para validar y limpiar datos de short antes de enviar
const validateAndCleanShortData = (short: FormDataShort, quotationId: number): { isValid: boolean; data: any; error?: string } => {
  // Validar campos requeridos
  if (!quotationId || isNaN(Number(quotationId))) {
    return { isValid: false, data: null, error: 'Falta el ID de cotización' };
  }
  
  if (!short.discipline || typeof short.discipline !== 'string' || short.discipline.trim() === '') {
    return { isValid: false, data: null, error: 'Falta la disciplina' };
  }
  
  if (!short.size || typeof short.size !== 'string' || short.size.trim() === '') {
    return { isValid: false, data: null, error: 'Falta la talla' };
  }
  
  if (!short.quantity || isNaN(Number(short.quantity)) || Number(short.quantity) <= 0) {
    return { isValid: false, data: null, error: 'La cantidad debe ser un número válido mayor a 0' };
  }
  
  if (!short.gender || isNaN(Number(short.gender))) {
    return { isValid: false, data: null, error: 'Falta el género' };
  }

  // Función helper para convertir IDs a número o null
  const toNumberOrNull = (value: any): number | null => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  // Función helper para convertir strings vacíos a null
  const toStringOrNull = (value: any): string | null => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }
    return String(value);
  };

  // Construir objeto limpio con tipos correctos
  const cleanData: any = {
    quotationId: Number(quotationId),
    productType: Number(short.productType) || 2,
    discipline: short.discipline.trim(),
    size: short.size.trim(),
    quantity: Number(short.quantity),
    gender: Number(short.gender),
  };

  // Campos opcionales de IDs (números o null)
  const clothShortId = toNumberOrNull(short.clothShortId);
  if (clothShortId !== null) cleanData.clothShortId = clothShortId;

  const clothViewId = toNumberOrNull(short.clothViewId);
  if (clothViewId !== null) cleanData.clothViewId = clothViewId;

  // Campos opcionales de strings (strings o null)
  const viewShort = toStringOrNull(short.viewShort);
  if (viewShort !== null) cleanData.viewShort = viewShort;

  const dtfShort = toStringOrNull(short.dtfShort);
  if (dtfShort !== null) cleanData.dtfShort = dtfShort;

  const shortSection = toStringOrNull(short.shortSection);
  if (shortSection !== null) cleanData.shortSection = shortSection;

  const observation = toStringOrNull(short.observation);
  if (observation !== null) cleanData.observation = observation;

  return { isValid: true, data: cleanData };
};

// Función para validar que los materiales de shorts tengan el tamaño configurado
const validateMaterialSizesShort = async (
  short: FormDataShort,
  size: string
): Promise<{ isValid: boolean; error?: string }> => {
  const materialFields = [
    { id: short.clothShortId, name: 'Tela Short' },
    { id: short.clothViewId, name: 'Tela Vista' },
  ];

  for (const field of materialFields) {
    if (field.id && Number(field.id) > 0) {
      try {
        const sizes = await fetchSizes(Number(field.id));
        // Verificar si el tamaño está configurado para este material
        const sizeExists = sizes.some((s: any) => s.size === size);
        if (!sizeExists) {
          return { 
            isValid: false, 
            error: `El material "${field.name}" (ID: ${field.id}) no tiene configurado el tamaño "${size}". Por favor, configure el tamaño en el inventario de materiales o seleccione otro material.` 
          };
        }
      } catch (error) {
        console.error(`Error validating material ${field.name}:`, error);
        return { 
          isValid: false, 
          error: `Error al validar el material "${field.name}". Verifique que el material exista.` 
        };
      }
    }
  }

  return { isValid: true };
};

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

  // Validar que haya shorts para enviar
  if (!shorts || shorts.length === 0) {
    message.error('No hay shorts para enviar');
    return;
  }

  // Validar quotationId
  if (!quotationId || isNaN(Number(quotationId))) {
    message.error('ID de cotización inválido');
    return;
  }

  try {
    for (const short of shorts) {
      // Validar y limpiar datos antes de enviar
      const validation = validateAndCleanShortData(short, quotationId);
      
      if (!validation.isValid) {
        message.error(validation.error || 'Error de validación en short');
        console.error('Validation error:', validation.error, short);
        return;
      }

      // Validar que los materiales tengan el tamaño configurado
      const materialValidation = await validateMaterialSizesShort(short, short.size);
      if (!materialValidation.isValid) {
        message.error(materialValidation.error || 'Error de validación de materiales');
        console.error('Material validation error:', materialValidation.error);
        return;
      }
      
      console.log('Sending clean short data:', validation.data);
      const response = await addQuotationProductShort(validation.data)

      if ((response.status = true)) {
        message.success('Short agregado con éxito')
      } else {
        message.error('Error al agregar short')
      }
    }

    const designResponse = await addDesign(DesignData)
    if ((designResponse.status = true)) {
      message.success('Diseño agregado con éxito')

      if (CuttingOrderDt.length > 0) {
        // Verificar si ya existe una orden de corte para esta cotización
        const existingOrder = await checkCuttingOrderExists(quotationId)
        
        if (existingOrder.exists) {
          // Si ya existe, actualizar en lugar de crear
          message.info('Ya existe una orden de corte para esta cotización. Actualizando...')
          try {
            const updateResponse = await updateCuttingOrder(existingOrder.orderId!, {
              ...CuttingOrderDt[0],
              quotationId
            })
            if (updateResponse) {
              message.success('Orden de corte actualizada con éxito')
            }
          } catch (updateError) {
            console.error('Error al actualizar orden de corte:', updateError)
            message.error('Error al actualizar la orden de corte existente')
          }
        } else {
          // Si no existe, crear una nueva
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
      }
    } else {
      message.error('Error al agregar el diseño')
    }
  } catch (error) {
    console.error(
      'Error al enviar datos de los shorts, diseño o generar la orden de corte:',
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

/** Sube la imagen de diseño para playera; usar en el paso final antes de enviar. */
export const uploadImageShirt = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload/single/quotation_shirt`,
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

/** Sube la imagen de diseño para short; usar en el paso final antes de enviar. */
export const uploadImageShort = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload/single/quotation_short`,
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
