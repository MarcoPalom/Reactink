import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import DesingList from 'pages/finance/desing-list/DesingList';
import CuttingArea from "./CuttingArea";
import PrintingArea from "./PrintingArea"
import SublimateArea from "./SublimateArea";
import SewingArea from "./SewingArea"
import {useNavigate} from 'react-router-dom'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import IroningAreaList from "./IroningArea";
import FinishingAreaList from "./FinishingArea";
import DesignArea from "./DesingArea";

const HomePage = () => {
    const navigate = useNavigate()
    useTokenRenewal(navigate)
    
    const userole = localStorage.getItem('userRole');
    const roleNumber = Number(userole);
    
    return (
        <div>
            {roleNumber === 1 || roleNumber === 2 || roleNumber === 3 ? (
                <div>
                    <DashCount />
                    <ChartNTable />
                </div>
            ) : roleNumber === 4 ? (
                <DesingList />
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
            ) : roleNumber === 11 ? (
                <DesingList />
            ) : (
                null
            )}
        </div>
    )
}

export default HomePage