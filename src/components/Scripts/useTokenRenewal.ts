import { useEffect } from 'react';
import axios from 'axios';

const useTokenRenewal = (navigate:any) => {
  useEffect(() => {
    const renewToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/');
        }

        const response = await axios.get(
          'http://localhost:3001/api/user/renew-token',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem('token', response.data.token);

        console.log('Token renovado con éxito:', response.data);
      } catch (error) {
        console.error('Error al renovar el token:', error);
        navigate('/');
      }
    };

    renewToken();
  }, [navigate]);
};

export default useTokenRenewal;