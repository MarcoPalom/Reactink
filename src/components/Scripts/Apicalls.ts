
import axios from 'axios'
import { Material,Quotation,FormDataShirtView, FormDataShortView } from 'components/Scripts/Interfaces'
import { API_BASE_URL } from 'config/api.config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})


export const fetchAllProducts = async (): Promise<FormDataShirtView[]> => {
  const [shirtResponse, shortResponse] = await Promise.all([
    axios.get(`${API_BASE_URL}/quotation-product-shirt`, getAuthHeaders()),
    axios.get(`${API_BASE_URL}/quotation-product-short`, getAuthHeaders())
  ])
  return [...shirtResponse.data, ...shortResponse.data]
}

export const fetchProductStatus = async (productId: number, productType: 'shirt' | 'short') => {
  // El endpoint statusAreas solo existe para shirts, no para shorts
  if (productType === 'short') {
    // Retornar valores por defecto para shorts (el backend no tiene esta ruta)
    return {
      cuttingArea: false,
      printingArea: false,
      sublimationArea: false,
      sewingArea: false,
      ironingArea: false,
      finishingArea: false,
    }
  }
  
  const response = await axios.get(`${API_BASE_URL}/quotation-product-${productType}/statusAreas/${productId}`, getAuthHeaders())
  return response.data
}

export const updateProductArea = async (productId: number, areaId: number, productType: 'shirt' | 'short') => {
  console.log({ productId });
  console.log({ areaId });
  
  // Shirts usa parámetros de ruta: /checkArea/:id/:area
  // Shorts usa query params: /checkArea/?id=X&area=Y
  const url = productType === 'shirt' 
    ? `${API_BASE_URL}/quotation-product-${productType}/checkArea/${productId}/${areaId}`
    : `${API_BASE_URL}/quotation-product-${productType}/checkArea/?id=${productId}&area=${areaId}`;
  
  const response = await axios.put(url, {}, getAuthHeaders())
  return response
}
// Funciones relacionadas con empleados

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

export const fetchEmployeeDetails = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/user/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const updateEmployee = async (id: string, values: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/user/update/${id}`,
    values,
    getAuthHeaders()
  )
  return response.data
}

export const addEmployee = async (employeeData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/user/register`,
    employeeData,
    getAuthHeaders()
  )
  return response.data
}


export const deleteEmployee = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/user/delete/${id}`, getAuthHeaders())
}

//funciones expenses

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expense/`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

export const fetchExpenseDetails = async (id: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/expense/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const updateExpense = async (id: number, values: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/expense/update/${id}`,
    values,
    getAuthHeaders()
  )
  return response.data
}

export const addExpense = async (employeeData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/expense/`,
    employeeData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteExpense = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/expense/delete/${id}`, getAuthHeaders())
}
//funciones relacionadas con diseños

export const fetchQuotationDesigns = async (page = 1, pageSize = 999) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/quotation-design/`,
      { ...getAuthHeaders(), params: { page, pageSize } }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching quotation-design:', error)
    throw error
  }
}

export const fetchQuotationDesign = async (id: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/quotation-design/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const updateQuotationDesign = async (id: number, values: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation-design/update/${id}`,
    values,
    getAuthHeaders()
  )
  return response.data
}

export const addQuotationDesign = async (data: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/quotation-design/`,
    data,
    getAuthHeaders()
  )
  return response.data
}

export const deleteQuotationDesign = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/quotation-design/delete/${id}`, getAuthHeaders())
}

export const uploadDesignFile = async (file: File): Promise<{ fileName: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(
    `${API_BASE_URL}/upload/single/quotation_design`,
    formData,
    {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}
// Funciones relacionadas con cotizaciones

export const fetchQuotation = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/quotation/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const fetchQuotations = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/quotation/`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error fetching quotations:', error)
    throw error
  }
}

export const updateQuotation = async (id: number, values: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation/update/${id}`,
    values,
    getAuthHeaders()
  )
  return response.data
}

export const addQuotation = async (quotationData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/quotation/`,
    quotationData,
    getAuthHeaders()
  )
  return response.data
}

export const fetchQuotationProducts = async (quotationId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/quotation-product/?quotationid=${quotationId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation products:', error);
    throw error; 
  }
};

export const fetchQuotationProductsMaquila = async (quotationId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/quotation-product-maquila/?quotationid=${quotationId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation products:', error);
    throw error; 
  }
};

export const addQuotationProduct = async (pivotDataProduct: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/quotation-product/`,
    pivotDataProduct,
    getAuthHeaders()
  )
  return response.data
}

export const addQuotationProductMaquila = async (
  pivotDataProductMaquila: any
) => {
  const response = await axios.post(
    `${API_BASE_URL}/quotation-product-maquila/`,
    pivotDataProductMaquila,
    getAuthHeaders()
  )
  return response.data
}

export const EditQuotationProduct = async (
  id: number | undefined,
  pivotDataProduct: any
) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation-product/update/${id}`,
    pivotDataProduct,
    getAuthHeaders()
  )
  return response.data
}

export const EditQuotationProductMaquila = async (
  id: number | undefined,
  pivotDataProductMaquila: any
) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation-product-maquila/update/${id}`,
    pivotDataProductMaquila,
    getAuthHeaders()
  )
  return response.data
}

export const deleteQuotationProduct = async (
  id: string,
  pivotDataProduct: any
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    data: pivotDataProduct
  }
  const response = await axios.delete(
    `${API_BASE_URL}/quotation-product/delete/${id}`,
    config
  )
  return response.data
}

export const deleteQuotationProductMaquila = async (
  id: string,
  pivotDataProductMaquila: any
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    data: pivotDataProductMaquila
  }
  const response = await axios.delete(
    `${API_BASE_URL}/quotation-product-maquila/delete/${id}`,
    config
  )
  return response.data
}

export const deleteQuotation = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/quotation/delete/${id}`, getAuthHeaders())
}

// Funciones relacionadas con clientes

export const fetchClients = async () => {
  const response = await axios.get(`${API_BASE_URL}/client/`, getAuthHeaders())
  return response.data
}

export const fetchClientDetails = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/client/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const updateClient = async (id: string, values: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/client/update/${id}`,
    values,
    getAuthHeaders()
  )
  return response.data
}

export const addClient = async (clientData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/client/`,
    clientData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteClient = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/client/delete/${id}`, getAuthHeaders())
}

// Funciones relacionadas con materiales

export const fetchMaterialName = async (
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>
) => {
  try {
    const response = await axios.get<Material[]>(
      `${API_BASE_URL}/material/`,
      getAuthHeaders()
    )
    setMaterials(response.data)
  } catch (error) {
    console.error('Error fetching material data:', error)
  }
}

export const addSupplier = async (newSupplier: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/supplier/`,
    newSupplier,
    getAuthHeaders()
  )
  return response.data
}

export const addCategory = async (categoryData: { name: string }) => {
  const response = await axios.post(
    `${API_BASE_URL}/category/`,
    categoryData,
    getAuthHeaders()
  )
  return response.data
}

export const fetchMaterial = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/material/${id}`,
    getAuthHeaders()
  )
  return response.data
}
export const updateMaterial = async (id: number, materialData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/material/update/${id}`,
    materialData,
    getAuthHeaders()
  )
  return response.data
}

export const addMaterial = async (materialData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/material/`,
    materialData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteMaterial = async (id: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/material/delete/${id}`,
    getAuthHeaders()
  )
  return response.data
}
export const addMaterialSize = async (materialSizeData: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/material-size/`,
    materialSizeData,
    getAuthHeaders()
  )
  return response.data
}

export const updateMaterialSize = async (
  id: number,
  materialSizeData: { materialId?: number; consumption?: number; performance?: number; size?: string }
) => {
  const response = await axios.put(
    `${API_BASE_URL}/material-size/update/${id}`,
    materialSizeData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteMaterialSize = async (id: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/material-size/delete/${id}`,
    getAuthHeaders()
  )
  return response.data
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/category/`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

export const fetchSuppliers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier/`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}


//ordenes de corte 

export const addQuotationProductShirt = async (
  shirtData: any,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/quotation-product-shirt/`,
      shirtData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding quotation product shirt:', error);
    throw error;
  }
};

export const addQuotationProductShort = async (
  shortData: any,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/quotation-product-short/`,
      shortData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding quotation product shirt:', error);
    throw error;
  }
};



export const addDesign = async (
  DesignData: any,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/quotation-design/`,
      DesignData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding design:', error);
    throw error;
  }
};

export const addCuttingOrder = async (
  cuttingOrderData: any,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cutting-order/`,
      cuttingOrderData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding cutting order:', error);
    throw error;
  }
};

export const fetchOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/cutting-order/`, getAuthHeaders())
  return response.data
}

// Función para verificar si ya existe una orden de corte para una cotización
export const checkCuttingOrderExists = async (quotationId: number): Promise<{ exists: boolean; orderId?: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cutting-order/`, getAuthHeaders())
    const orders = response.data
    
    // Buscar si existe una orden de corte con el quotationId dado
    const existingOrder = orders.find((order: any) => order.quotationId === quotationId)
    
    if (existingOrder) {
      return { exists: true, orderId: existingOrder.id }
    }
    return { exists: false }
  } catch (error) {
    console.error('Error checking cutting order:', error)
    return { exists: false }
  }
}

export const fetchCuttingOrderDetails = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/cutting-order/${id}`, getAuthHeaders())
  return response.data
}

export const updateCuttingOrder = async (id: number, cuttingOrderData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/cutting-order/update/${id}`,
    cuttingOrderData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteCuttingOrder = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/cutting-order/delete/${id}`, getAuthHeaders())
}

// Funciones para actualizar productos de playera y short
export const updateQuotationProductShirt = async (id: number, shirtData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation-product-shirt/update/${id}`,
    shirtData,
    getAuthHeaders()
  )
  return response.data
}

export const updateQuotationProductShort = async (id: number, shortData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/quotation-product-short/update/${id}`,
    shortData,
    getAuthHeaders()
  )
  return response.data
}

export const fetchSizes = async (materialId: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/material-size/${materialId}`, 
    getAuthHeaders()
  );
  return response.data;
};

//cambioo
export const fetchOrder = async (id: number): Promise<(FormDataShirtView | FormDataShortView)[]> => {
  try {
    console.log(`Fetching order with id: ${id}`);
    const response = await axios.get(
      `${API_BASE_URL}/cutting-order/${id}`,
      getAuthHeaders()
    );
    console.log('Raw API response:', response.data);
    console.log('Quotation data:', response.data.quotation);
    console.log('Shirt products:', response.data.quotation.quotationProductShirts);
    console.log('Short products:', response.data.quotation.quotationProductShorts);
    
    const products = [
      ...response.data.quotation.quotationProductShirts, 
      ...response.data.quotation.quotationProductShorts
    ];
    console.log('Combined products:', products);
    
    return products;
  } catch (error) {
    console.error('Error fetching cutting order:', error);
    throw error;
  }
};

export const fetchMaterials = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/material/`,
    getAuthHeaders()
  )
  return response.data
}


export const fetchQuotationOrder = async (id: string): Promise<Quotation[]>  =>  {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/cutting-order/${id}`,
      getAuthHeaders()
    );
    return response.data.quotation
  } catch (error) {
    console.error('Error fetching cutting order:', error);
    throw error;
  }
};

export const fetchImage = async (imageName: string, imageExtension: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/image/${imageExtension}/${imageName}`,
    {...getAuthHeaders(), responseType:'blob'}
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employee image:', error);
    throw error; 
  }
};



