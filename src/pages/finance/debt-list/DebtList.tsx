import { useState, useEffect } from 'react'
import {  Space, Table, Card, Input, Progress } from 'antd'
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
  const [searchText, setSearchText] = useState('')
  const filteredQuotations = DebtsUtils.filterQuotations(Quotations, searchText)
  const filteredQuotationsWithKeys =
    DebtsUtils.addKeysToQuotations(filteredQuotations)

  useTokenRenewal(navigate)

  useEffect(() => {
    DebtsUtils.fetchAndSetQuotations(setQuotations)
    DebtsUtils.fetchAndSetClients(setClients)
  }, [])

  const calculateDebtStatus = (Quotations: any) => {
    const { netAmount, advance, total } = Quotations

    if (!netAmount || !total) {
      return null
    }

    if (netAmount - total === 0) {
      return <span style={{ color: 'red' }}>En deuda</span>
    } else {
      const percentagePaid = ((advance / netAmount) * 100).toFixed(2)
      console.log(percentagePaid)
      return <Progress percent={parseFloat(percentagePaid)} status="normal" />
    }
  }

  const columns = [
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
          <div className="flex flex-row gap-1">
            <Search placeholder="Busqueda..." className="w-44" />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={() => {
              const headers = ['Folio', 'Cliente', 'Total', 'Avance', 'Restante', 'Estado']
              const data = filteredQuotationsWithKeys.map((q) => [
                q.id?.toString() || '',
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
