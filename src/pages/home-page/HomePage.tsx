import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import ActivitiesList from "./homepage-components/ActivitiesList";
import DesignArea from "./homepage-components/DesingArea";
import {useNavigate} from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'


const HomePage = () => {

    const navigate = useNavigate()
    useTokenRenewal(navigate)
    
    const userole = localStorage.getItem('userRole');

    // Convertimos a número para la comparación
    const roleNumber = Number(userole);
    
    return (

        <div>
      {roleNumber === 1 ? (
        // Si el rol es 1, mostramos el primer div con los componentes
        <div>
          <DashCount />
          <ChartNTable />
          <ActivitiesList />
        </div>
      ) : roleNumber === 4 ? (
        // Si el rol es 4, mostramos el segundo div con "holamundo"
        <DesignArea/>
      ) : (
        // Si el rol no es ni 1 ni 4, no mostramos nada o puedes agregar otro contenido si lo deseas
        null
      )}
    </div>

    )
}

export default HomePage
