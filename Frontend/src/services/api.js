import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const getDevices = () => api.get('/devices');
export const getDeviceById = (id) => api.get(`/devices/${id}`);
export const createDevice = (data) => api.post('/devices', data);
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);

export default api;
