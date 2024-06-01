import axios from 'axios';

export const createProduct = (productData) => {
  const isFormData = productData instanceof FormData;
  return axios.post(`/api/products/`, productData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
    }
  });
};

export const getProducts = () => {
  return axios.get(`/api/products/`);
};

export const addStock = (productId, data) => {
  return axios.post(`/api/products/${productId}/add_stock/`, data);
};

export const removeStock = (productId, data) => {
  return axios.post(`/api/products/${productId}/remove_stock/`, data);
};

export const updateProduct = (productId, newData) => {
  return axios.put(`/api/products/${productId}/`, newData);
};

export const deleteProduct = (productId) => {
  return axios.delete(`/api/products/${productId}/`);
};
