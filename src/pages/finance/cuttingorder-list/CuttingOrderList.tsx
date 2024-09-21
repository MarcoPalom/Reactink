import { useState, useEffect } from 'react'
import { Space, Table, Card, Input, Button, Select, Drawer } from 'antd'
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
  Material,
  quotationDesigns
} from 'components/Scripts/Interfaces'
import { groupBy } from 'lodash'

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

  const materialMap = new Map(
    Materials.map((material) => [material.id, material.name])
  )

  const getMaterialName = (id: number) => {
    return materialMap.get(id) || 'Unknown'
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
      render: (text: any, record: any) => (
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
        {quotationProducts && quotationProducts.length > 0 && (
          <Card className="p-4">
            <div>
              <div className="flex justify-center mb-2">
                <img src={Logo} alt="Ink Sports" className="h-8" />
              </div>

              {combinedProducts.map((product, index) => {
                const isSingleProduct = product.size && !product.size.includes(', ');
          
                const dataSource = isSingleProduct
                  ? [{
                      key: 0,
                      size: product.size,
                      quantity: product.quantity,
                      observation: product.observation,
                    }]
                  : product.size.split(', ').map((size, idx) => ({
                      key: idx,
                      size,
                      quantity: product.quantity.split(', ')[idx],
                      observation: product.observation.split(', ')[idx],
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
                            <strong>Tela Puño:</strong>{' '}
                            {getMaterialName(product.clothCuffId)}
                          </p>
                        </div>
                      </div>
                    </div>

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
