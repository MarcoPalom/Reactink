import { useState, useEffect } from 'react'
import { Card, Input, Table, Drawer, Carousel, Checkbox } from 'antd'
import { RightOutlined, LeftOutlined, ScissorOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import Logo from 'assets/img/logo.png'
import Missing from 'assets/img/noUserPhoto.jpg'
import {
  CuttingOrderData,
  Quotation,
  FormDataShirtView,
  Material,
  quotationDesigns
} from 'components/Scripts/Interfaces'

const { Search } = Input

const CuttingOrderList = () => {
  const navigate = useNavigate()
  const [Orders, setOrders] = useState<CuttingOrderData[]>([])
  const [Materials, setMaterials] = useState<Material[]>([])
  const [Designs, setDesigns] = useState<quotationDesigns[]>([])
  const [quotationProducts, setQuotationProducts] = useState<
    FormDataShirtView[]
  >([])
  const [cuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText] = useState('')
  const filteredOrders = CuttingUtils.filterOrders(Orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)
  const [image, setImage] = useState<string | null>(null)

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
    CuttingUtils.fetchAndSetMaterials(setMaterials)
    CuttingUtils.fetchAndSetQuotations(setDesigns)
  }, [])

  const nextArrow = (
    <div className="absolute right-0 z-10 cursor-pointer">
      <RightOutlined className="text-gray-600 bg-black rounded-full p-2" />
    </div>
  )

  const prevArrow = (
    <div className="absolute left-0 z-10 cursor-pointer">
      <LeftOutlined className="text-gray-600 bg-black rounded-full p-2" />
    </div>
  )

  const materialMap = new Map(
    Materials.map((material) => [material.id, material.name])
  )

  const getMaterialName = (id: number) => {
    return materialMap.get(id) || 'Unknown'
  }

  const handleValidationChange = (key: number, checked: boolean) => {
    console.log(`Item with key ${key} validated: ${checked}`)
  }

  function combineProducts(products: FormDataShirtView[]): FormDataShirtView[] {
    const combinedProducts: FormDataShirtView[] = []

    products.forEach((product) => {
      const existingProduct = combinedProducts.find(
        (p) =>
          p.quotationId === product.quotationId &&
          p.clothBackShirtId === product.clothBackShirtId &&
          p.clothSleeveId === product.clothSleeveId &&
          p.clothNecklineId === product.clothNecklineId &&
          p.clothFrontShirtId === product.clothFrontShirtId &&
          p.clothCuffId === product.clothCuffId &&
          p.cuff === product.cuff &&
          p.typeCuff === product.typeCuff &&
          p.neckline === product.neckline &&
          p.typeNeckline === product.typeNeckline &&
          p.sleeveType === product.sleeveType &&
          p.sleeveShape === product.sleeveShape &&
          p.discipline === product.discipline
      )

      if (existingProduct) {
        existingProduct.size += `, ${product.size}`
        existingProduct.quantity += `, ${product.quantity}`
        existingProduct.observation += `, ${product.observation}`
      } else {
        combinedProducts.push({ ...product })
      }
    })

    return combinedProducts
  }

  const combinedProducts = combineProducts(quotationProducts)

  const columnsData = [
    {
      title: 'Talla',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Observación',
      dataIndex: 'observation',
      key: 'observation'
    },
    {
      title: 'Validar',
      key: 'validate',
      render: (_: any, record: any) => (
        <Checkbox
          onChange={(e: any) =>
            handleValidationChange(record.key, e.target.checked)
          }
        />
      )
    }
  ]

  const handleViewOrderDetails = (id: number) => {
    CuttingUtils.handleView(
      id,
      setQuotationProducts,
      setVisible,
      setCuttingOrder
    )
  }

  return (
    <>
      <div>
      <div className="flex justify-center mt-10">
        <Carousel
         className='w-96'
          dots={false}
          arrows
          nextArrow={nextArrow}
          prevArrow={prevArrow}
        >
          {filteredOrdersWithKeys.map((order) => (
            <div
              key={order.key}
              onClick={() => handleViewOrderDetails(order.id)}
              className="cursor-pointer"
            >
           
                <Card className="w-96 p-4 transition-transform transform hover:scale-105 shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-pulse" />
                      <div className="flex items-center justify-center bg-red-500 rounded-full p-2 transition-transform transform hover:scale-110">
                        <ScissorOutlined className="text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm">
                    <strong>Folio Cotización:</strong> {order.quotationId}
                  </h3>
                  <p className="text-xs">
                    <strong>Fecha de recibido:</strong>{' '}
                    {new Date(order.dateReceipt).toLocaleDateString()}
                  </p>
                  <p className="text-xs">
                    <strong>Fecha de entrega:</strong>{' '}
                    {new Date(order.dueDate).toLocaleDateString()}
                  </p>
                </Card>
            
            </div>
          ))}
        </Carousel>
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
          <Card className="p-4">
            <div>
              <div className="flex justify-center mb-2">
                <img src={Logo} alt="Ink Sports" className="h-8" />
              </div>

              {combinedProducts.map((product, index) => {
                const isSingleProduct =
                  product.size && !product.size.includes(', ')

                const dataSource = isSingleProduct
                  ? [
                      {
                        key: 0,
                        size: product.size,
                        quantity: product.quantity,
                        observation: product.observation
                      }
                    ]
                  : product.size.split(', ').map((size, idx) => ({
                      key: idx,
                      size,
                      quantity: product.quantity.split(', ')[idx],
                      observation: product.observation.split(', ')[idx]
                    }))
                return (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-4">
                      <p>
                        <strong>Cotización Folio:</strong> {product.quotationId}
                      </p>
                      <p>
                        <strong>Cliente:</strong>
                      </p>
                    </div>

                    <h3 className="flex justify-center text-lg leading-6 font-medium text-gray-900 mb-4">
                      Orden de corte
                    </h3>

                    <div className="flex mb-4">
                      <div className="flex justify-center">
                        {image ? (
                          <img className="w-64 h-44" src={image} alt="Image" />
                        ) : (
                          <img
                            className="w-64 h-44"
                            src={Missing}
                            alt="missing image"
                          />
                        )}
                      </div>
                      <div className="w-3/4 pl-4">
                        <div className="text-center text-sm text-gray-500 space-y-2">
                          <p>
                            <strong>Disciplina:</strong> {product.discipline}
                          </p>
                          <p>
                            <strong>Tela espalda:</strong>{' '}
                            {getMaterialName(product.clothBackShirtId)}
                          </p>
                          <p>
                            <strong>Tela Manga:</strong>{' '}
                            {getMaterialName(product.clothSleeveId)}
                          </p>
                          <p>
                            <strong>Tela cuello:</strong>{' '}
                            {getMaterialName(product.clothNecklineId)}
                          </p>
                          <p>
                            <strong>Tela frente:</strong>{' '}
                            {getMaterialName(product.clothFrontShirtId)}
                          </p>
                          <p>
                            <strong>Cuff:</strong> {product.cuff}
                          </p>
                          <p>
                            <strong>Tipo Cuff:</strong> {product.typeCuff}
                          </p>
                          <p>
                            <strong>Cuello:</strong> {product.neckline}
                          </p>
                          <p>
                            <strong>Tipo Cuello:</strong> {product.typeNeckline}
                          </p>
                          <p>
                            <strong>Tipo de Manga:</strong> {product.sleeveType}
                          </p>
                          <p>
                            <strong>Forma de Manga:</strong>{' '}
                            {product.sleeveShape}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Table
                        className="w-full border-collapse border border-gray-200"
                        columns={columnsData}
                        dataSource={dataSource}
                        tableLayout="fixed"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </Drawer>
    </>
  )
}

export default CuttingOrderList
