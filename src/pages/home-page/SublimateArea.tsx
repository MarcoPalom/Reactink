import React, { useState, useEffect } from 'react'
import { Card, Drawer, Modal, message, Spin } from 'antd'
import { RightOutlined, LeftOutlined, SkinOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from 'config/api.config'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import ProductDetailView from './homepage-components/ProductDetailView'
import {
  CuttingOrderData,
  Quotation,
  FormDataShirtView,
  FormDataShortView,
  Material,
} from 'components/Scripts/Interfaces'
import {
  fetchOrders,
  fetchMaterials,
  fetchQuotations,
  fetchAllProducts,
  updateProductArea,
  fetchImage,
  fetchCuttingOrderDetails
} from 'components/Scripts/Apicalls'

const SublimateAreaList: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CuttingOrderData[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [shirtImage, setShirtImage] = useState<string | null>(null)
  const [shortImage, setShortImage] = useState<string | null>(null)
  const [quotationProducts, setQuotationProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [filteredQuotationProducts, setFilteredQuotationProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [CuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<FormDataShirtView | FormDataShortView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [validatedProducts, setValidatedProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [client, setClient] = useState<string | null>(null);

  useTokenRenewal(navigate)
  const CURRENT_AREA = 3

  const isShortProduct = (product: FormDataShirtView | FormDataShortView): product is FormDataShortView => {
    return 'shortSection' in product
  }

  const fetchImg = async (
    imageName: string,
    folder: string,
    setImage: (imageUrl: string | null) => void
  ) => {
    try {
      const img = await fetchImage(imageName, folder)
      const imgURL = URL.createObjectURL(img)
      setImage(imgURL)
    } catch (error) {
      console.error('Error fetching design image:', error)
      setImage(null)
    }
  }

  const pickDesignsForOrder = (orderId: number, designs: any[]) => {
    if (!designs || designs.length === 0) return { shirt: null, short: null }
    const own = designs.filter((d: any) => d.cuttingOrderId === orderId)
    const candidates = own.length > 0 ? own : designs
    return {
      shirt: candidates.find((d: any) => d.designFront) || null,
      short: candidates.find((d: any) => d.designShort || d.design) || null,
    }
  }

  const fetchClient = async ( client: number ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/client/${ client }`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const {name, surname, organization} = await res.json();
      const cliente = `${ name } ${ surname } - ${ organization }`;

      setClient( cliente );

    } catch ( error ) {
      message.error(`${ error }`);
    }
  }

  const fetchData = async () => {
    try {
      const [ordersData, materialsData] = await Promise.all([
        fetchOrders(),
        fetchMaterials(),
        fetchQuotations(),
      ])
      setOrders(ordersData)
      setMaterials(materialsData)
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
      checkProductStatus(products)
    } catch (error) {
      console.error('Error fetching all products:', error)
      message.error('Error al cargar los productos. Por favor, intente de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkProductStatus = (products: (FormDataShirtView | FormDataShortView)[]) => {
    setValidatedProducts(products.filter(p => !!p.cuttingArea && !!p.printingArea && !p.sublimationArea))
  }

  useEffect(() => {
    fetchData()
    fetchAllProductsData()
  }, [])

  const filteredOrders = CuttingUtils.filterOrders(orders, searchText)
    .filter(order => validatedProducts.some(product => product.quotationId === order.quotationId))
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
        setIsModalVisible(false)
        const validatedId = selectedProduct.id
        setSelectedProduct(null)
        setFilteredQuotationProducts(prev => prev.filter(p => p.id !== validatedId))
        await fetchAllProductsData()
      } else {
        throw new Error('Unexpected response status')
      }
    } catch (error) {
      console.error('Error validating item:', error)
      message.error("No se pudo validar el artículo. Por favor, intente de nuevo.")
    }
  }

  const handleViewOrderDetails = async (id: number, quotationId: number) => {
    try {
      setIsLoading(true)
      setShirtImage(null)
      setShortImage(null)

      const orderDetails = await fetchCuttingOrderDetails(id)
      const quotationData: any = orderDetails?.quotation
      const orderDesigns: any[] =
        quotationData?.quotation_design || quotationData?.quotationDesigns || []
      const { shirt, short } = pickDesignsForOrder(id, orderDesigns)

      if (shirt?.designFront) {
        fetchImg(shirt.designFront, 'quotation_shirt', setShirtImage)
      }
      const shortFile = short?.designShort || short?.design
      if (shortFile) {
        fetchImg(shortFile, 'quotation_short', setShortImage)
      }

      if (quotationData?.clientId) {
        fetchClient(quotationData.clientId)
      } else {
        setClient(null)
      }

      const fetchedProducts = await CuttingUtils.handleView(id, setQuotationProducts, setVisible, setCuttingOrder)
      setFilteredQuotationProducts(fetchedProducts.filter(p => !p.sublimationArea))
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Área de Sublimado</h1>
      
      {filteredOrdersWithKeys.length > 0 ? (
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
                    onClick={() => handleViewOrderDetails(order.id, order.quotationId)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-pulse" />
                        <div className="flex items-center justify-center bg-blue-500 rounded-full p-4">
                          <SkinOutlined className="text-white text-2xl" />
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
                      <span className="text-green-500">En proceso de Sublimado</span>
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
                  currentSlide === index ? 'bg-blue-500' : 'bg-blue-300'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-xl font-semibold">De momento no hay trabajo en esta área.</p>
        </div>
      )}

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
          <ProductDetailView
            products={filteredQuotationProducts}
            client={client}
            shirtImage={shirtImage}
            shortImage={shortImage}
            getMaterialName={getMaterialName}
            onValidate={handleValidate}
            title="Orden de Sublimado"
          />
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
        <p>Seguro que quieres validar la finalización de este producto?:</p>
        {selectedProduct && (
          <div>
            <p><strong>Tipo:</strong> {isShortProduct(selectedProduct) ? 'Short' : 'Camisa'}</p>
            <p><strong>Size:</strong> {selectedProduct.size}</p>
            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SublimateAreaList