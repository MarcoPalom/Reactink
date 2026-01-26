import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from 'config/api.config';

const useTokenRenewal = (navigate:any) => {
  useEffect(() => {
    const renewToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/');
        }

        const response = await axios.get(
          `${API_BASE_URL}/user/renew-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user);
      } catch (error) {
        console.error('Error al renovar el token:', error);
        navigate('/');
      }
      
    };

    renewToken();
  }, [navigate]);
};

export default useTokenRenewal;