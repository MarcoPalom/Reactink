import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Funciones relacionadas con empleados
export const fetchEmployeeDetails = async (id:string) => {
  const response = await axios.get(`${API_BASE_URL}/user/${id}`, getAuthHeaders());
  return response.data;
};
export const updateEmployee = async (id:string, values:any) => {
  const response = await axios.put(`${API_BASE_URL}/user/update/${id}`, values, getAuthHeaders());
  return response.data;
};

export const addEmployee = async (employeeData:any) => {
    const response = await axios.post(`${API_BASE_URL}/user/register`, employeeData, getAuthHeaders());
    return response.data;
};

export const deleteEmployee = async (id:string) => {
    await axios.delete(`${API_BASE_URL}/user/delete/${id}`, getAuthHeaders());
};

// Funciones relacionadas con cotizaciones

export const fetchQuotation = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/quotation/${id}`, getAuthHeaders());
  return response.data;
};

export const updateQuotation = async (id: string, values: any) => {
  const response = await axios.put(`${API_BASE_URL}/quotation/update/${id}`, values, getAuthHeaders());
  return response.data;
};

export const addQuotation = async (quotationData: any) => {
  const response = await axios.post(`${API_BASE_URL}/quotation/`, quotationData, getAuthHeaders());
  return response.data;
};

export const addQuotationProduct = async (pivotDataProduct: any) => {
  const response = await axios.post(`${API_BASE_URL}/quotation-product/`, pivotDataProduct, getAuthHeaders());
  return response.data;
};

export const addQuotationProductMaquila = async (pivotDataProductMaquila: any) => {
  const response = await axios.post(`${API_BASE_URL}/quotation-product-maquila/`, pivotDataProductMaquila, getAuthHeaders());
  return response.data;
};

export const EditQuotationProduct = async (id: string , pivotDataProduct: any) => {
  const response = await axios.put(`${API_BASE_URL}/quotation-product/update/${id}`, pivotDataProduct, getAuthHeaders());
  return response.data;
};

export const EditQuotationProductMaquila = async (id: string , pivotDataProductMaquila: any) => {
  const response = await axios.put(`${API_BASE_URL}/quotation-product-maquila/update/${id}`, pivotDataProductMaquila, getAuthHeaders());
  return response.data;
};

export const deleteQuotationProduct = async (id: string, pivotDataProduct: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: pivotDataProduct
  };
  const response = await axios.delete(`${API_BASE_URL}/quotation-product/delete/${id}`, config);
  return response.data;
};

export const deleteQuotationProductMaquila = async (id: string, pivotDataProductMaquila: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: pivotDataProductMaquila
  };
  const response = await axios.delete(`${API_BASE_URL}/quotation-product-maquila/delete/${id}`, config);
  return response.data;
};


export const deleteQuotation = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/quotation/delete/${id}`, getAuthHeaders());
};

export const fetchClients = async () => {
  const response = await axios.get(`${API_BASE_URL}/client/`, getAuthHeaders());
  return response.data;
};

export const fetchClientDetails = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/client/${id}`, getAuthHeaders());
  return response.data;
};

export const updateClient = async (id: string, values: any) => {
  const response = await axios.put(`${API_BASE_URL}/client/update/${id}`, values, getAuthHeaders());
  return response.data;
};

export const addClient = async (clientData: any) => {
  const response = await axios.post(`${API_BASE_URL}/client/`, clientData, getAuthHeaders());
  return response.data;
};

export const deleteClient = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/client/delete/${id}`, getAuthHeaders());
};

export {}