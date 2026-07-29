import { useState, useEffect } from 'react'
import {  Space, Table, Card, Input, Progress, Segmented } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { Quotation, Client } from '../../../components/Scripts/Interfaces'
import * as DebtsUtils from 'components/Scripts/DebtsUtils'
import { generatePDFTable } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'

const { Search } = Input

const DebtList = () => {
  const navigate = useNavigate()
  const [Quotations, setQuotations] = useState<Quotation[]>([])
  const [Clients, setClients] = useState<Client[]>([])
  const [cuttingOrders, setCuttingOrders] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'con_deuda' | 'liquidado'>(
    'con_deuda'
  )
  const filteredQuotations = DebtsUtils.filterQuotations(Quotations, searchText)
  const filteredByStatus = DebtsUtils.filterQuotationsByPaymentStatus(
    filteredQuotations,
    paymentStatus
  )
  const filteredQuotationsWithKeys =
    DebtsUtils.addKeysToQuotations(filteredByStatus)

  useTokenRenewal(navigate)

  useEffect(() => {
    DebtsUtils.fetchAndSetQuotations(setQuotations)
    DebtsUtils.fetchAndSetClients(setClients)
    DebtsUtils.fetchAndSetCuttingOrders(setCuttingOrders)
  }, [])

  const cuttingOrderMap = new Map<number, number>(
    cuttingOrders.map((order) => [order.quotationId, order.id])
  )

  const calculateDebtStatus = (Quotation: any) => {
    const advance = Quotation.advance ?? 0
    const total = Quotation.total ?? 0

    if (DebtsUtils.isLiquidated(Quotation)) {
      return <span style={{ color: 'green' }}>Liquidado</span>
    }

    const original = advance + total
    const percentagePaid =
      original > 0 ? ((advance / original) * 100).toFixed(2) : '0'
    return <Progress percent={parseFloat(percentagePaid)} status="normal" />
  }

  const columns = [
    {
      title: 'N° Cotización',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'N° Orden de Corte',
      key: 'cuttingOrderId',
      render: (_: any, record: any) => cuttingOrderMap.get(record.id) ?? '-'
    },
    {
      title: 'Cliente',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: string) => {
        const client = Clients.find((client) => client.id === clientId)
        return client ? client.name : 'Cliente no encontrado'
      }
    },
    {
      title: 'Ultimo avance',
      dataIndex: 'advance',
      key: 'advance'
    },
    {
      title: 'Total en deuda',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: 'Estado',
      dataIndex: 'address',
      key: 'address',
      render: (_: any, record: any) => calculateDebtStatus(record)
    }
  ]

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Finanzas</h4>
          <h6 className="text-sm">Lista de Deudas</h6>
        </div>
      </div>

      <Card>
        <Space
          className="mb-4 flex flex-row justify-between"
        >
          <div className="flex flex-row gap-3 items-center">
            <Search placeholder="Busqueda..." className="w-44" />
            <Segmented
              value={paymentStatus}
              onChange={(value) =>
                setPaymentStatus(value as 'con_deuda' | 'liquidado')
              }
              options={[
                { label: 'Con deuda', value: 'con_deuda' },
                { label: 'Liquidados', value: 'liquidado' }
              ]}
            />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={() => {
              const headers = ['N° Cotización', 'N° Orden de Corte', 'Cliente', 'Total', 'Avance', 'Restante', 'Estado']
              const data = filteredQuotationsWithKeys.map((q) => [
                q.id?.toString() || '',
                cuttingOrderMap.get(q.id)?.toString() ?? '-',
                `${q.client?.name || ''} ${q.client?.surname || ''}`,
                `$${q.netAmount || 0}`,
                `$${q.advance || 0}`,
                `$${(q.netAmount || 0) - (q.advance || 0)}`,
                q.advance >= q.netAmount ? 'Pagado' : 'Pendiente'
              ])
              generatePDFTable('Lista de Deudas', headers, data, 'deudas')
            }} />
          </div>
        </Space>
        <div id="PDFtable">
          <div className="mt-5 flex justify-between mb-5">
            <img src={Logo} alt="Ink Sports" className="h-10 " />
            <h1 className="text-end">
              {' '}
              Ciudad victoria, Tamaulipas a<TodayDate></TodayDate>{' '}
            </h1>
          </div>
          <Table
            className="w-full border-collapse border border-gray-200"
            columns={columns}
            dataSource = { filteredQuotationsWithKeys }
          />
        </div>
      </Card>
    </>
  )
}
export default DebtList
