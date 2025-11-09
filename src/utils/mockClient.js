import axios from 'axios';
import { mockCategories } from '@/mock/resources';

const mockDelay = (result) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(result), 300);
  });

const mockInstance = axios.create();

mockInstance.defaults.adapter = (config) => {
  const { url, method, data } = config;

  if (method === 'get' && url === '/mock/categories') {
    return mockDelay({
      data: mockCategories,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (method === 'post' && url === '/mock/categories') {
    const payload = JSON.parse(data);
    return mockDelay({
      data: payload,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  return mockDelay({
    data: null,
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config
  });
};

export default mockInstance;

