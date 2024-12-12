"use client"
import axios from 'axios';
import { NEXT_PUBLIC_API } from './consts';

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API,
});


const setupInterceptors = async (userAddress:string, disconnect: ()=> void, setEstablishConnection: (value:boolean) => void) => {
  console.log("setup-interceptor called")
  apiClient.interceptors.request.clear();
  apiClient.interceptors.response.clear();

  apiClient.interceptors.request.use((config) => {
    if (userAddress) {
      console.log(`signingKey_${userAddress.toLowerCase()}`, localStorage.getItem(`signingKey_${userAddress.toLowerCase()}`), "auth-logs")
      const authToken = localStorage.getItem(`Bearer_${userAddress.toLowerCase()}`);
     console.log(authToken, "authToken", userAddress, localStorage.getItem(`Bearer_${userAddress.toLowerCase()}`))
    // console.log(result, "result", userAddress)  
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUnauthorized = async (error: any) => {
    const { response, config } = error;
    if (response && response.status === 401 && config.method === 'post') {
      localStorage.removeItem(`signingKey_${userAddress}`);
      localStorage.removeItem(`signingKeyExpiry_${userAddress}`);
      localStorage.removeItem(`Bearer_${userAddress}`);
      // disconnect(); 
      setEstablishConnection(true);
    }
    return Promise.reject(error);
  };
  
  apiClient.interceptors.response.use((response) => response, handleUnauthorized);
};

// setupInterceptors();

export { apiClient, setupInterceptors };
