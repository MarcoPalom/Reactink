import DashCount from "./homepage-components/DashCount";
import ChartNTable from "./homepage-components/ChartNTable";
import ActivitiesList from "./homepage-components/ActivitiesList";
import { Card, Table, Popover, Typography } from "antd";
import { SmallDashOutlined } from '@ant-design/icons'
import Icon from '@ant-design/icons/lib/components/Icon'
import { useAppProps } from 'antd/es/app/context'
import React from 'react'






const HomePage = () => {

    return (

        <div>

            <DashCount />

            <ChartNTable/>


            <ActivitiesList/>


        </div>
    )
}

export default HomePage
