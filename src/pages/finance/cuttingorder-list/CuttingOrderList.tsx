import React, { useState, useEffect } from 'react'
import { Space, Table, Card, Input, Button, Drawer } from 'antd'
import { FilePdfOutlined, DatabaseOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import { generatePDF } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import Missing from 'assets/img/noUserPhoto.jpg'
import {
  CuttingOrderData,
  Quotation,
  FormDataShirtView,
  FormDataShortView,
  Material,
  quotationDesigns
} from 'components/Scripts/Interfaces'

const { Search } = Input

const CuttingOrderList: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<CuttingOrderData[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [designs, setDesigns] = useState<quotationDesigns[]>([])
  const [quotationProducts, setQuotationProducts] = useState<(FormDataShirtView | FormDataShortView)[]>([])
  const [cuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [visible, setVisible] = useState(false)
  const [searchText] = useState('')
  const [image, setImage] = useState<string | null>(null)

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
    CuttingUtils.fetchAndSetMaterials(setMaterials)
    CuttingUtils.fetchAndSetQuotations(setDesigns)
  }, [])

  const filteredOrders = CuttingUtils.filterOrders(orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)

  const materialMap = new Map(
    materials.map((material) => [material.id, material.name])
  )

  const getMaterialName = (id: number) => {
    return materialMap.get(id) || 'Unknown'
  }

  const isShirtProduct = (product: FormDataShirtView | FormDataShortView): product is FormDataShirtView => {
    return 'clothFrontShirtId' in product
  }

  function combineProducts(products: (FormDataShirtView | FormDataShortView)[]): (FormDataShirtView | FormDataShortView)[] {
    const combinedProducts: (FormDataShirtView | FormDataShortView)[] = []

    products.forEach((product) => {
      const existingProduct = combinedProducts.find(
        (p) =>
          p.quotationId === product.quotationId &&
          (isShirtProduct(p) === isShirtProduct(product)) &&
          (isShirtProduct(p) ? (
            p.clothBackShirtId === (product as FormDataShirtView).clothBackShirtId &&
            p.clothSleeveId === (product as FormDataShirtView).clothSleeveId &&
            p.clothNecklineId === (product as FormDataShirtView).clothNecklineId &&
            p.clothFrontShirtId === (product as FormDataShirtView).clothFrontShirtId &&
            p.clothCuffId === (product as FormDataShirtView).clothCuffId &&
            p.cuff === (product as FormDataShirtView).cuff &&
            p.typeCuff === (product as FormDataShirtView).typeCuff &&
            p.neckline === (product as FormDataShirtView).neckline &&
            p.typeNeckline === (product as FormDataShirtView).typeNeckline &&
            p.sleeveType === (product as FormDataShirtView).sleeveType &&
            p.sleeveShape === (product as FormDataShirtView).sleeveShape
          ) : (
            p.clothShortId === (product as FormDataShortView).clothShortId &&
            p.viewShort === (product as FormDataShortView).viewShort &&
            p.shortSection === (product as FormDataShortView).shortSection
          )) &&
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
    }
  ]

  const columns = [
    {
      title: 'Folio Cotizacion',
      dataIndex: 'quotationId',
      key: 'quotationId'
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
      render: (dueDate: string) => new Date(dueDate).toLocaleDateString()
    },
    {
      title: 'Accion',
      dataIndex: 'Accion',
      key: 'Accion',
      render: (_: any, record: CuttingOrderData) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() =>
              CuttingUtils.handleView(
                record.id,
                setQuotationProducts,
                setVisible,
                setCuttingOrder
              )
            }
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
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
          <div className="mt-5 flex flex-col items-center sm:flex-row justify-between mb-5">
            <img src={Logo} alt="Ink Sports" className="h-10 mb-3 sm:mb-0" />
            <span className="text-center sm:text-end">
              Ciudad victoria, Tamaulipas a <TodayDate />
            </span>
          </div>
          <Table
            className="w-full border-collapse border border-gray-200"
            columns={columns}
            dataSource={filteredOrdersWithKeys}
            tableLayout="fixed"
          />
        </div>
      </Card>

      <Drawer
        title="Detalles de la orden"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={600}
      >
        {quotationProducts.length > 0 && (
          <Card className="p-4">
            <div>
              <div className="flex justify-center mb-2">
                <img src={Logo} alt="Ink Sports" className="h-8" />
              </div>

              {combinedProducts.map((product, index) => {
                const isSingleProduct = typeof product.size === 'string' && !product.size.includes(', ');

                const dataSource = isSingleProduct
                  ? [{
                      key: 0,
                      size: product.size,
                      quantity: product.quantity,
                      observation: product.observation,
                    }]
                  : (typeof product.size === 'string' ? product.size.split(', ') : [product.size]).map((size, idx) => ({
                      key: idx,
                      size,
                      quantity: typeof product.quantity === 'string' ? product.quantity.split(', ')[idx] : product.quantity,
                      observation: typeof product.observation === 'string' ? product.observation.split(', ')[idx] : product.observation,
                    }));
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
                          <img className="w-64 h-44" src={image} alt="Product" />
                        ) : (
                          <img
                            className="w-64 h-44"
                            src={Missing}
                            alt="Missing product image"
                          />
                        )}
                      </div>
                      <div className="w-3/4 pl-4">
                        <div className="text-center text-sm text-gray-500 space-y-2">
                          <p>
                            <strong>Disciplina:</strong> {product.discipline}
                          </p>
                          {isShirtProduct(product) ? (
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
                                <strong>Tela Puño:</strong>{' '}
                                {getMaterialName(product.clothCuffId)}
                              </p>
                            </>
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </div>

                    {isShirtProduct(product) && (
                      <div className="grid grid-cols-2 mt-4">
                        <p>
                          <strong>Puños:</strong> {product.cuff}
                        </p>
                        <p>
                          <strong>Tipo de puño:</strong> {product.typeCuff}
                        </p>
                        <p>
                          <strong>Cuello:</strong> {product.neckline}
                        </p>
                        <p>
                          <strong>Tipo de cuello:</strong> {product.typeNeckline}
                        </p>
                        <p>
                          <strong>Tipo de manga:</strong> {product.sleeveType}
                        </p>
                        <p>
                          <strong>Forma de manga:</strong> {product.sleeveShape}
                        </p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Table
                        columns={columnsData}
                        dataSource={dataSource}
                        pagination={false} 
                        bordered
                      />
                    </div>

                    <hr className="my-4" />
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