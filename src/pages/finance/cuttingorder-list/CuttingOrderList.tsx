import { useState, useEffect } from 'react'
import {  Space, Table, Card, Input, Button } from 'antd'
import { FilePdfOutlined,DatabaseOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import { generatePDF } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import { CuttingOrderData,FormDataShirt } from 'components/Scripts/Interfaces'

const { Search } = Input

const CuttingOrderList = () => {
  const navigate = useNavigate()
  const [Orders, setOrders] = useState<CuttingOrderData[]>([])
  const [quotationProducts, setQuotationProducts] = useState<FormDataShirt[]>([]);
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const filteredOrders = CuttingUtils.filterOrders(Orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
  }, [])


  const columns = [
    {
      title: 'Folio Cotizacion',
      dataIndex: 'quotationId',
      key: 'quotationId',
    },
    {
      title: 'Fecha de recibido',
      dataIndex: 'dateReceipt',
      key: 'dateReceipt',
      render: (dateReceipt: string) =>
        new Date(dateReceipt).toLocaleDateString()
    },
    {
      title: 'Fecha de entrega',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) =>
        new Date(dueDate).toLocaleDateString()
    },
    {
        title: 'Accion',
        dataIndex: 'Accion',
        key: 'Accion',
        render: (text: any, record: any) => (
            <Space size="middle">
              <Button
                icon={<DatabaseOutlined className="text-green-700" />}
                onClick={()=>CuttingUtils.handleView(record.id,setQuotationProducts,setVisible)}
              />
            </Space>
          )
      },
  ]

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Finanzas</h4>
          <h6 className="text-sm">Ordenes de corte</h6>
        </div>
      </div>

      <Card>
        <Space
          style={{ marginBottom: 16 }}
          className="flex flex-row justify-between"
        >
          <div className="flex flex-row gap-1">
            <Search placeholder="Busqueda..." className="w-44" />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={generatePDF} />
          </div>
        </Space>
        <div id="PDFtable">
          <div className="mt-5 flex justify-between mb-5">
            <img src={Logo} alt="Ink Sports" className="h-10 " />
            <span className="text-end">
              {' '}
              Ciudad victoria, Tamaulipas a<TodayDate></TodayDate>{' '}
            </span>
          </div>
          <Table
            className="w-full border-collapse border border-gray-200"
            columns={columns}
            dataSource = { filteredOrdersWithKeys }
          />
        </div>
      </Card>
    </>
  )
}
export default CuttingOrderList
