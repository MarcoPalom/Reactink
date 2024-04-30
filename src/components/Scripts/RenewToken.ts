import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RenewToken: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const renewToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/')
        }

        await axios.get('http://localhost:3000/api/user/renew-token', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

       
      } catch (error) {
        console.error('Error al renovar el token:', error);
        navigate('/login');
      }
    };

    renewToken();
  }, [navigate]); 

  return null;
};

export default RenewToken;