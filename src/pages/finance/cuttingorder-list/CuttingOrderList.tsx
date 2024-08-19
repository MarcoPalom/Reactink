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

const { Search } = Input

const CuttingOrderList = () => {
  const navigate = useNavigate()
  const [Orders, setOrders] = useState<CuttingOrderData[]>([])
  const [Materials, setMaterials] = useState<Material[]>([])
  const [Designs, setDesigns] = useState<quotationDesigns[]>([])
  const [quotationProducts, setQuotationProducts] = useState<FormDataShirtView[]>([])
  const [cuttingOrder, setCuttingOrder] = useState<Quotation[]>([])
  const [selectedProduct, setSelectedProduct] = useState<FormDataShirtView | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const [searchText] = useState('')
  const filteredOrders = CuttingUtils.filterOrders(Orders, searchText)
  const filteredOrdersWithKeys = CuttingUtils.addKeysToOrders(filteredOrders)
  const [image, setImage] = useState<string | null>(null)
  const { Option } = Select

  useTokenRenewal(navigate)

  useEffect(() => {
    CuttingUtils.fetchAndSetOrders(setOrders)
    CuttingUtils.fetchAndSetMaterials(setMaterials)
    CuttingUtils.fetchAndSetQuotations(setDesigns)
  }, [])

  const materialMap = new Map(
    Materials.map((material) => [material.id, material.name])
  )

  const getMaterialName = (id: string) => {
    return materialMap.get(id) || 'Unknown'
  }

  const onProductSelectChange = (value: number) => {
    CuttingUtils.handleSelectChange(
      value,
      quotationProducts,
      Designs,
      setSelectedProduct,
      setImage
    )
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
        open={visible}
        width={600}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una orden
          </label>
          <Select
            className="w-full"
            placeholder="Selecciona una cotizacion"
            onChange={onProductSelectChange}
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
                <div className="flex justify-center mb-2">
                  <img src={Logo} alt="Ink Sports" className="h-8" />
                </div>
                <div className="flex justify-between">
                  <p>
                    <strong>Cotizacion Folio:</strong>{' '}
                    {selectedProduct.quotationId}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {}
                  </p>
                </div>

                <div></div>
              </div>

              <div>
                <h3 className="flex justify-center text-lg leading-6 font-medium text-gray-900 mb-4">
                  Orden de corte
                </h3>
              </div>

              <div className="flex">
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
                      <strong>Disciplina:</strong> {selectedProduct.discipline}
                    </p>
                    <p>
                      <strong>Tela espalda:</strong>{' '}
                      {getMaterialName(selectedProduct.clothBackShirtId)}
                    </p>
                    <p>
                      <strong>Tela Manga:</strong>{' '}
                      {getMaterialName(selectedProduct.clothSleeveId)}
                    </p>
                    <p>
                      <strong>Tela cuello:</strong>{' '}
                      {getMaterialName(selectedProduct.clothNecklineId)}
                    </p>
                    <p>
                      <strong>Tela frente:</strong>{' '}
                      {getMaterialName(selectedProduct.clothFrontShirtId)}
                    </p>
                    <p>
                      <strong>Tela Puño:</strong>{' '}
                      {getMaterialName(selectedProduct.clothCuffId)}
                    </p>
                    <p>
                      <strong>Talla:</strong> {selectedProduct.size}
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
              <div className="flex justify-between">
                <div className="gird grid-cols-1 justify-end mt-4">
                  <p>
                    <strong>Cantidad:</strong> {selectedProduct.quantity}
                  </p>
                </div>
                <div className="flex mt-14">
                  <p>
                    <strong>DTF: </strong>
                    {selectedProduct.dtfShirt}&nbsp;
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
