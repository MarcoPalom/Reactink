import React, { useState, useEffect } from 'react'
import { Card, Drawer, Checkbox } from 'antd'
import { RightOutlined, LeftOutlined, ScissorOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import {
  CuttingOrderData,
  Quotation,
  FormDataShirtView,
  Material,
  quotationDesigns
} from 'components/Scripts/Interfaces'

const SublimateArea: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CuttingOrderData[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [designs, setDesigns] = useState<quotationDesigns[]>([])
  const [quotationProducts, setQuotationProducts] = useState<FormDataShirtView[]>([])
  const [cuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
    CuttingUtils.fetchAndSetMaterials(setMaterials)
    CuttingUtils.fetchAndSetQuotations(setDesigns)
  }, [])

  const filteredOrders = CuttingUtils.filterOrders(orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)

  const handleValidationChange = (key: number, checked: boolean) => {
    console.log(`Item with key ${key} validated: ${checked}`)
  }

  const handleViewOrderDetails = (id: number) => {
    CuttingUtils.handleView(id, setQuotationProducts, setVisible, setCuttingOrder)
  }

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % filteredOrdersWithKeys.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + filteredOrdersWithKeys.length) % filteredOrdersWithKeys.length)
  }

  const ResponsiveTable: React.FC<{ dataSource: any[] }> = ({ dataSource }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talla</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataSource.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.observation}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox onChange={(e) => handleValidationChange(item.key, e.target.checked)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const ResponsiveCardList: React.FC<{ dataSource: any[] }> = ({ dataSource }) => {
    return (
      <div className="space-y-4">
        {dataSource.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <div className="space-y-2">
              <p><strong>Talla:</strong> {item.size}</p>
              <p><strong>Cantidad:</strong> {item.quantity}</p>
              <p><strong>Observación:</strong> {item.observation}</p>
              <div>
                <strong>Validar:</strong>
                <Checkbox onChange={(e) => handleValidationChange(item.key, e.target.checked)} className="ml-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Área de Corte</h1>
      
      <div className="mt-10 relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out animate-fadeIn"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {filteredOrdersWithKeys.map((order) => (
              <div key={order.key} className="w-full flex-shrink-0 relative px-4">
                <Card 
                  className="w-full max-w-md mx-auto p-6 cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={() => handleViewOrderDetails(order.id)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-pulse" />
                      <div className="flex items-center justify-center bg-red-500 rounded-full p-4">
                        <ScissorOutlined className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-semibold">
                        Folio Cotización: {order.quotationId}
                      </h3>
                      <p className="text-sm">
                        <strong>Fecha de recibido:</strong>{' '}
                        {new Date(order.dateReceipt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <strong>Fecha de entrega:</strong>{' '}
                        {new Date(order.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    <strong>Estado:</strong>{' '}
                    <span className="text-green-500">En proceso de corte</span>
                  </p>
                  <p className="text-sm">
                    <strong>Prioridad:</strong>{' '}
                    <span className="text-yellow-500">Alta</span>
                  </p>
                </Card>
                <button
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                >
                  <LeftOutlined className="text-xl" />
                </button>
                <button
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                >
                  <RightOutlined className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          {filteredOrdersWithKeys.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                currentSlide === index ? 'bg-red-500' : 'bg-red-300'
              }`}
            />
          ))}
        </div>
      </div>

      <Drawer
        title="Detalles de la orden"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={600}
      >
        {quotationProducts && quotationProducts.length > 0 && (
          <div>
            {quotationProducts.map((product, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold mb-4">Tallas y Cantidades</h3>
                <div className="hidden md:block">
                  <ResponsiveTable
                    dataSource={[
                      {
                        key: index,
                        size: product.size,
                        quantity: product.quantity,
                        observation: product.observation,
                      },
                    ]}
                  />
                </div>
                <div className="md:hidden">
                  <ResponsiveCardList
                    dataSource={[
                      {
                        key: index,
                        size: product.size,
                        quantity: product.quantity,
                        observation: product.observation,
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default SublimateArea