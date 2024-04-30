import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import ActivitiesList from "./homepage-components/ActivitiesList";
import {useNavigate} from 'react-router-dom'


import React, { useState, useEffect } from 'react';
import axios from 'axios';



const HomePage = () => {

    const navigate = useNavigate()

    useEffect(() => {

        const renewToken = async () => {
          try {
            const token = localStorage.getItem('token');
    
            if (!token) {
              navigate('/');
            }
            const response = await axios.get('http://localhost:3000/api/user/renew-token', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            localStorage.setItem('token', response.data.token);
    
            console.log('Token renovado con éxito:', response.data);
          } catch (error) {
            console.error('Error al renovar el token:', error);
            navigate('/');
          }
        };
    
        renewToken();
      } , []);
    
      
    

    return (


        <div>

            <DashCount />

            <ChartNTable/>


            <ActivitiesList/>


        </div>
    )
}

export default HomePage
