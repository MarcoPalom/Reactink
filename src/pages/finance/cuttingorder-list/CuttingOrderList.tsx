import { useState, useEffect } from 'react'
import { Space, Table, Card, Input, Button, Select, Drawer } from 'antd'
import { FilePdfOutlined, DatabaseOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import { generatePDF } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import {
  CuttingOrderData,
  FormDataShirt,
  FormDataShirtView
} from 'components/Scripts/Interfaces'

const { Search } = Input

const CuttingOrderList = () => {
  const navigate = useNavigate()
  const [Orders, setOrders] = useState<CuttingOrderData[]>([])
  const [quotationProducts, setQuotationProducts] = useState<
    FormDataShirtView[]
  >([])
  const [selectedProduct, setSelectedProduct] =
    useState<FormDataShirtView | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const filteredOrders = CuttingUtils.filterOrders(Orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)
  const { Option } = Select

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
  }, [])

  const handleSelectChange = (value: number) => {
    const product = quotationProducts.find((product) => product.id === value)
    setSelectedProduct(product || null)
  }

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
                setVisible
              )
            }
          />
        </Space>
      )
    }
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
            dataSource={filteredOrdersWithKeys}
          />
        </div>
      </Card>
      <Drawer
        title="Detalles de la orden"
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        width={600}
        bodyStyle={{ padding: '24px' }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una cotizacion
          </label>
          <Select
            className="w-full"
            placeholder="Selecciona una cotizacion"
            onChange={handleSelectChange}
          >
            {quotationProducts.map((product) => (
              <Option key={product.id} value={product.id}>
                {`Folio Cotizacion Camisas: ${product.id}`}
              </Option>
            ))}
          </Select>
        </div>

        {selectedProduct && (
          <Card className="p-4">
            <div className="">
              <div>
                <h3 className="flex justify-center text-lg leading-6 font-medium text-gray-900 mb-4">
                  Cotizacion de camisas
                </h3>
              </div>

              <div className="flex">
                <div className="w-80 h-48 bg-gray-200 flex items-center justify-center">
                  {/* Imagen */}
                  <p className="text-gray-500">Imagen</p>
                </div>
                <div className="w-3/4 pl-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <p>
                      <strong>Disciplina:</strong> {selectedProduct.discipline}
                    </p>
                    <p>
                      <strong>Talla:</strong> {selectedProduct.size}
                    </p>
                    <p>
                      <strong>Tela espalda:</strong>{' '}
                      {selectedProduct.clothBackShirtId}
                    </p>
                    <p>
                      <strong>Tela frente:</strong>{' '}
                      {selectedProduct.clothFrontShirtId}
                    </p>
                    <p>
                      <strong>Tela Puño:</strong> {selectedProduct.clothCuffId}
                    </p>
                    <p>
                      <strong>Tela cuello:</strong>{' '}
                      {selectedProduct.clothNecklineId}
                    </p>
                    <p>
                      <strong>Tela Manga:</strong>{' '}
                      {selectedProduct.clothSleeveId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 mt-4">
                <p>
                  <strong>Puños:</strong> {selectedProduct.cuff}
                </p>
                <p>
                  <strong>Tipo de puño:</strong> {selectedProduct.typeCuff}
                </p>
                <p>
                  <strong>Cuello:</strong> {selectedProduct.neckline}
                </p>
                <p>
                  <strong>Tipo de cuello:</strong>{' '}
                  {selectedProduct.typeNeckline}
                </p>
                <p>
                  <strong>Tipo de manga:</strong> {selectedProduct.sleeveType}
                </p>
                <p>
                  <strong>Forma de manga:</strong> {selectedProduct.sleeveShape}
                </p>
              </div>
              <div className='flex justify-between'>
              <div className='gird grid-cols-1 justify-end mt-4'>
                <p>
                  <strong>Cantidad:</strong> {selectedProduct.quantity}
                </p>
                <p>
                  <strong>Impuesto:</strong> {selectedProduct.tax}
                </p>
                <p>
                  <strong>Total:</strong> {selectedProduct.total}
                </p>
              </div>
              <div className='flex mt-14'>
              <p >
                <strong>DTF:</strong> {selectedProduct.dtfShirt}--{ }  
              </p>
              <p>
                <strong>Observacion:</strong> {selectedProduct.observation}
              </p>
              </div>
              </div>
            </div>
          </Card>
        )}
      </Drawer>
    </>
  )
}
export default CuttingOrderList
