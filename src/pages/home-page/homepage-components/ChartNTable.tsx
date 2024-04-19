import { Card, Table, Popover, Typography } from "antd";
import { SmallDashOutlined } from '@ant-design/icons'

const { Title } = Typography;

const ChartNTable = () => {
    const dataSource = [
        {
            key: '1',
            id: '1234',
            state: 'proceso',
            date: '12/10/02',
        },
        {
            key: '2',
            id: '1235',
            state: 'proceso',
            date: '12/10/02',
        },
        {
            key: '3',
            id: '1236',
            state: 'finalizado',
            date: '12/10/02',
        },


    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    return (
        <div className='flex flex-row gap-4 justify-between mb-6'>
            <Card
                className='w-7/12 h-96'





            />

            <Card className='w-2/5 h-96' title={<Title level={3}

                className="text-base flex flex-row items-center justify-between"

            >Pedidos agregados recientemente



                <Popover
                    placement="bottomRight"
                    trigger="click"
                    content={
                        <div>
                            <div>Lista de pedidos</div>
                            <div>Añadir pedidos</div>
                        </div>
                    }
                >
                    <SmallDashOutlined className="text-xl text-slate-500" />
                </Popover>


            </Title>}
            >


                <Table
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 190 }}
                />


            </Card>
        </div>
    )
}
export default ChartNTable;