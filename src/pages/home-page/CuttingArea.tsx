import React, { useState, useEffect } from 'react'
import { Card, Drawer, Button, Modal, message, Spin } from 'antd'
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
  FormDataShortView,
  Material,
  quotationDesigns
} from 'components/Scripts/Interfaces'
import {
  fetchOrders,
  fetchMaterials,
  fetchQuotations,
  fetchAllProducts,
  fetchProductStatus,
  updateProductArea
} from 'components/Scripts/Apicalls'

const CuttingArea: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CuttingOrderData[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [designs, setDesigns] = useState<quotationDesigns[]>([])
  const [quotationProducts, setQuotationProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [filteredQuotationProducts, setFilteredQuotationProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [cuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<FormDataShirtView | FormDataShortView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [completedQuotationIds, setCompletedQuotationIds] = useState<number[]>([])

  useTokenRenewal(navigate)
  const CURRENT_AREA = 1

  const isShortProduct = (product: FormDataShirtView | FormDataShortView): product is FormDataShortView => {
    return 'shortSection' in product
  }

  const fetchData = async () => {
    try {
      const [ordersData, materialsData, quotationsData] = await Promise.all([
        fetchOrders(),
        fetchMaterials(),
        fetchQuotations()
      ])
      setOrders(ordersData)
      setMaterials(materialsData)
      setDesigns(quotationsData)
      console.log('Fetched data:', { orders: ordersData, materials: materialsData, quotations: quotationsData })
    } catch (error) {
      console.error('Error fetching data:', error)
      message.error('Error al cargar los datos. Por favor, intente de nuevo.')
    }
  }

  const fetchAllProductsData = async () => {
    try {
      setIsLoading(true)
      const products = await fetchAllProducts()
      setAllProducts(products)
      console.log('Fetched all products:', products)
    } catch (error) {
      console.error('Error fetching all products:', error)
      message.error('Error al cargar los productos. Por favor, intente de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkCuttingAreaStatus = async () => {
    try {
      const productsByQuotation = allProducts.reduce((acc, product) => {
        if (!acc[product.quotationId]) {
          acc[product.quotationId] = []
        }
        acc[product.quotationId].push(product)
        return acc
      }, {} as Record<number, (FormDataShirtView | FormDataShortView)[]>)

      const completedQuotations: number[] = []

      for (const [quotationId, products] of Object.entries(productsByQuotation)) {
        const allProductsComplete = await Promise.all(
          products.map(async (product) => {
            const status = await fetchProductStatus(product.id, isShortProduct(product) ? 'short' : 'shirt')
            return status.cuttingArea
          })
        )

        if (allProductsComplete.every(status => status === true)) {
          completedQuotations.push(Number(quotationId))
        }
      }

      setCompletedQuotationIds(completedQuotations)
      console.log('Completed quotation IDs:', completedQuotations)
    } catch (error) {
      console.error('Error checking cutting area status:', error)
      message.error('Error al verificar el estado de las áreas de corte. Por favor, intente de nuevo.')
    }
  }

  useEffect(() => {
    fetchData()
    fetchAllProductsData()
  }, [])

  useEffect(() => {
    if (allProducts.length > 0 && orders.length > 0) {
      checkCuttingAreaStatus()
    }
  }, [allProducts, orders])

  const filteredOrders = CuttingUtils.filterOrders(orders, searchText)
    .filter(order => !completedQuotationIds.includes(order.quotationId))
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)

  const materialMap = new Map(materials.map((material) => [material.id, material.name]))

  const getMaterialName = (id: number) => {
    return materialMap.get(id) || 'Unknown'
  }

  const handleValidate = (record: FormDataShirtView | FormDataShortView) => {
    setSelectedProduct(record)
    setIsModalVisible(true)
  }

  const handleConfirm = async () => {
    if (!selectedProduct) return

    try {
      const productType = isShortProduct(selectedProduct) ? 'short' : 'shirt'
      const response = await updateProductArea(selectedProduct.id, CURRENT_AREA, productType)

      if (response.status === 200) {
        message.success("Artículo validado exitosamente")
        fetchData()
        setIsModalVisible(false)
        setSelectedProduct(null)
        const updatedFilteredProducts = await Promise.all(
          filteredQuotationProducts.map(async (product) => {
            const status = await fetchProductStatus(product.id, isShortProduct(product) ? 'short' : 'shirt')
            return { ...product, isCuttingAreaComplete: status.cuttingArea }
          })
        )
        setFilteredQuotationProducts(updatedFilteredProducts.filter(product => !product.isCuttingAreaComplete))
        checkCuttingAreaStatus()
      } else {
        throw new Error('Unexpected response status')
      }
    } catch (error) {
      console.error('Error validating item:', error)
      message.error("No se pudo validar el artículo. Por favor, intente de nuevo.")
    }
  }

  const handleViewOrderDetails = async (id: number) => {
    try {
      setIsLoading(true)
      console.log('Fetching order details for id:', id)
      await CuttingUtils.handleView(id, setQuotationProducts, setVisible, setCuttingOrder)
      console.log('Quotation products after handleView:', quotationProducts)
      const productsWithStatus = await Promise.all(
        quotationProducts.map(async (product) => {
          const status = await fetchProductStatus(product.id, isShortProduct(product) ? 'short' : 'shirt')
          return { ...product, isCuttingAreaComplete: status.cuttingArea }
        })
      )
      console.log('Products with status:', productsWithStatus)
      setFilteredQuotationProducts(productsWithStatus.filter(product => !product.isCuttingAreaComplete))
      console.log('Filtered quotation products:', filteredQuotationProducts)
      setVisible(true)
    } catch (error) {
      console.error('Error viewing order details:', error)
      message.error("No se pudieron cargar los detalles de la orden. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % filteredOrdersWithKeys.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + filteredOrdersWithKeys.length) % filteredOrdersWithKeys.length)
  }

  const ResponsiveTable: React.FC<{ dataSource: (FormDataShirtView | FormDataShortView)[] }> = ({ dataSource }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talla</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataSource.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{isShortProduct(item) ? 'Short' : 'Camisa'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.observation}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button onClick={() => handleValidate(item)}>Validar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const ResponsiveCardList: React.FC<{ dataSource: (FormDataShirtView | FormDataShortView)[] }> = ({ dataSource }) => {
    return (
      <div className="space-y-4">
        {dataSource.map((item) => (
          <Card key={item.id} className="shadow-sm">
            <div className="space-y-2">
              <p><strong>Tipo:</strong> {isShortProduct(item) ? 'Short' : 'Camisa'}</p>
              <p><strong>Talla:</strong> {item.size}</p>
              <p><strong>Cantidad:</strong> {item.quantity}</p>
              <p><strong>Observación:</strong> {item.observation}</p>
              <div>
                <Button onClick={() => handleValidate(item)}>Validar</Button>
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
                </Card>
                <button
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevSlide()
                  }}
                >
                  <LeftOutlined className="text-xl" />
                </button>
                <button
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    
                    e.stopPropagation()
                    nextSlide()
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : filteredQuotationProducts && filteredQuotationProducts.length > 0 ? (
          <Card className="p-4">
            <div>
              <div className="flex justify-center mb-2">
                <img src={Logo} alt="Ink Sports" className="h-8" />
              </div>

              {filteredQuotationProducts.map((product, index) => {
                console.log('Rendering product:', product)
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

                    <div className="flex flex-col md:flex-row mb-4">
                      <div className="flex justify-center md:w-1/3">
                        {image ? (
                          <img className="w-64 h-44 object-cover" src={image} alt="Product" />
                        ) : (
                          <img
                            className="w-64 h-44 object-cover"
                            src={Missing}
                            alt="missing image"
                          />
                        )}
                      </div>
                      <div className="md:w-2/3 mt-4 md:mt-0 md:pl-4">
                        <div className="text-sm text-gray-500 space-y-2">
                          <p>
                            <strong>Tipo:</strong> {isShortProduct(product) ? 'Short' : 'Camisa'}
                          </p>
                          <p>
                            <strong>Disciplina:</strong> {product.discipline}
                          </p>
                          {isShortProduct(product) ? (
                            <>
                              <p>
                                <strong>Tela Short:</strong>{' '}
                                {getMaterialName(product.clothShortId)}
                              </p>
                              <p>
                                <strong>Vista Short:</strong> {product.viewShort}
                              </p>
                              <p>
                                <strong>Sección Short:</strong> {product.shortSection}
                              </p>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <ResponsiveTable
                        dataSource={[product]}
                      />
                    </div>
                    <div className="md:hidden">
                      <ResponsiveCardList
                        dataSource={[product]}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>No hay productos para mostrar.</p>
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm Validation"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Seguro que quieres validar la finalizacion de este producto?:</p>
        {selectedProduct && (
          <div>
            <p><strong>Tipo:</strong> {isShortProduct(selectedProduct) ? 'Short' : 'Camisa'}</p>
            <p><strong>Size:</strong> {selectedProduct.size}</p>
            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
            <p><strong>Observation:</strong> {selectedProduct.observation}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CuttingArea