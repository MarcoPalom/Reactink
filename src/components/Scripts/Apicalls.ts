import axios from 'axios';

//cotizaciones
const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

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

export const deleteQuotation = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/quotation/delete/${id}`, getAuthHeaders());
};

export {}