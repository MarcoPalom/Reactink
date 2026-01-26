import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import DesignArea from "./DesingArea";
import CuttingArea from "./CuttingArea";
import PrintingArea from "./PrintingArea"
import SublimateArea from "./SublimateArea";
import SewingArea from "./SewingArea"
import {useNavigate} from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import IroningAreaList from "./IroningArea";
import FinishingAreaList from "./FinishingArea";

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
                </div>
            ) : roleNumber === 4 ? (
                <DesignArea/>
            ) : roleNumber === 5 ? (
                <CuttingArea/>
            ) : roleNumber === 6 ? (
                <PrintingArea/>
            ) : roleNumber === 7 ? (
                <SublimateArea/>
            ) : roleNumber === 8 ? (
                <SewingArea/>
            ) : roleNumber === 9 ? (
                <IroningAreaList/>
            ) : roleNumber === 10 ? (
                <FinishingAreaList/>
            ) : (
                null
            )}
        </div>
    )
}

export default HomePage