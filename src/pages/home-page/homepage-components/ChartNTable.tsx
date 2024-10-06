"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Card, Table, Popover } from "antd"
import { SmallDashOutlined } from '@ant-design/icons'
import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import * as ExpenseUtils from 'components/Scripts/ExpenseUtils'
import * as QuotationUtils from 'components/Scripts/QuotationUtils'
import { CuttingOrderData, Expense, Quotation } from 'components/Scripts/Interfaces'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ChartNTable: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CuttingOrderData[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{
    labels: string[];
    expenses: number[];
    advances: number[];
  }>({ labels: [], expenses: [], advances: [] })
  const [totalDifference, setTotalDifference] = useState(0)

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchData = async () => {
      await CuttingUtils.fetchAndSetOrders(setOrders)
      await ExpenseUtils.fetchAndSetExpenses(setExpenses)
      await QuotationUtils.fetchAndSetQuotations(setQuotations)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      const monthlyData: { [key: string]: { expenses: number, advances: number } } = {}
      let totalExpenses = 0
      let totalAdvances = 0

      expenses.forEach(expense => {
        const date = new Date(expense.dateExpense)
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { expenses: 0, advances: 0 }
        }
        const expenseValue = Number(expense.total)
        monthlyData[monthYear].expenses += expenseValue
        totalExpenses += expenseValue
      })

      quotations.forEach(quotation => {
        const date = new Date(quotation.dateReceipt)
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { expenses: 0, advances: 0 }
        }
        const advanceValue = parseFloat(quotation.advance.toString())
        if (!isNaN(advanceValue)) {
          monthlyData[monthYear].advances += advanceValue
          totalAdvances += advanceValue
        } else {
          console.error(`Invalid advance value: ${quotation.advance}`)
        }
      })

      const sortedMonths = Object.keys(monthlyData).sort()
      setChartData({
        labels: sortedMonths.map(date => {
          const [year, month] = date.split('-')
          return `${year}-${month.padStart(2, '0')}`
        }),
        expenses: sortedMonths.map(date => monthlyData[date].expenses),
        advances: sortedMonths.map(date => monthlyData[date].advances)
      })

      setTotalDifference(totalAdvances - totalExpenses)
    }
  }, [expenses, quotations, loading])

  const chartOptions: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparación de Gastos e Ingresos por Mes',
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
      }
    }
  }), [])

  const data = useMemo(() => ({
    labels: chartData.labels,
    datasets: [
      {
        label: 'Gastos',
        data: chartData.expenses,
        backgroundColor: 'rgba(220, 38, 38, 0.5)', 
      },
      {
        label: 'Ingresos',
        data: chartData.advances,
        backgroundColor: 'rgba(34, 197, 94, 0.5)', 
      },
    ],
  }), [chartData])

  const recentOrders = orders.slice(0, 5)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'quotationId',
      key: 'quotationId',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
      render: () => <span className="text-red-600">En proceso</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'dateReceipt',
      key: 'dateReceipt',
      render: (dateReceipt: string) => new Date(dateReceipt).toLocaleDateString()
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
      <div className="lg:col-span-8">
        <Card className="h-[calc(100vh-12rem)] shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Gráfico de Gastos e ingresos</h4>
              <div className="flex-grow">
                <Bar options={chartOptions} data={data} />
              </div>
              <div className={`text-right mt-4 text-lg font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Diferencia: {totalDifference.toFixed(2)}
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="lg:col-span-4">
        <Card 
          className="h-[calc(100vh-12rem)] shadow-md rounded-lg overflow-hidden"
          title={
            <div className="flex justify-between items-center py-2">
              <h4 className="text-lg font-semibold m-0 text-gray-800">Pedidos recientes</h4>
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <div className="py-1">
                    <div 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate('/finanzas/cuttingorders')}
                    >
                      Lista de pedidos
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Añadir pedidos</div>
                  </div>
                }
              >
                <SmallDashOutlined className="text-xl text-gray-500 cursor-pointer hover:text-black" />
              </Popover>
            </div>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto h-[calc(100%-4rem)]">
              <Table
                dataSource={recentOrders}
                columns={columns}
                scroll={{ y: 'calc(100vh - 20rem)' }}
                pagination={false}
                className="w-full"
                rowClassName="hover:bg-red-50"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ChartNTable