import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import ActivitiesList from "./homepage-components/ActivitiesList";
import DesignArea from "./homepage-components/DesingArea";
import CuttingArea from "./homepage-components/CuttingArea";
import {useNavigate} from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'


const HomePage = () => {

    const navigate = useNavigate()
    useTokenRenewal(navigate)
    
    const userole = localStorage.getItem('userRole');
    const roleNumber = Number(userole);
    
    return (

        <div>
      {roleNumber === 1 ? (
        <div>
          <DashCount />
          <ChartNTable />
          <ActivitiesList />
        </div>
      ) : roleNumber === 4 ? (
        <DesignArea/>
      ) : roleNumber === 5?(
        <CuttingArea/>
      ):(
        null
      )}
    </div>

    )
}

export default HomePage
