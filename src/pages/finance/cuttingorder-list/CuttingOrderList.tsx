import React, { useState, useEffect } from 'react'
import { Space, Table, Card, Input, Button, Drawer, Form, message, Select, InputNumber, Upload, Spin } from 'antd'
import { FilePdfOutlined, DatabaseOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PictureOutlined } from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import { generatePDFTable } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import Missing from 'assets/img/noUserPhoto.jpg'
import { API_BASE_URL } from 'config/api.config'
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
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleEditProduct, setVisibleEditProduct] = useState(false)
  const [editingOrder, setEditingOrder] = useState<CuttingOrderData | null>(null)
  const [editingProduct, setEditingProduct] = useState<FormDataShirtView | FormDataShortView | null>(null)
  const [isEditingShirt, setIsEditingShirt] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [editForm] = Form.useForm()
  const [editProductForm] = Form.useForm()
  
  // Estados para edición de imagen
  const [currentDesign, setCurrentDesign] = useState<any>(null)
  const [currentQuotationId, setCurrentQuotationId] = useState<number | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

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
      title: 'Acción',
      dataIndex: 'Accion',
      key: 'Accion',
      render: (_: any, record: CuttingOrderData) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => {
              CuttingUtils.handleView(
                record.id,
                setQuotationProducts,
                setVisible,
                setCuttingOrder,
                setImage,
                setCurrentDesign
              )
              setCurrentQuotationId(record.quotationId)
            }}
            title="Ver detalles"
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() =>
              CuttingUtils.handleEdit(
                record,
                setEditingOrder,
                editForm,
                setVisibleEdit
              )
            }
            title="Editar"
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              CuttingUtils.handleDelete(record, orders, setOrders)
            }
            title="Eliminar"
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
            <Search 
              placeholder="Busqueda..." 
              className="w-44" 
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={() => {
              const headers = ['Folio Cotización', 'Fecha Recepción', 'Fecha Entrega']
              const data = filteredOrdersWithKeys.map((order) => [
                order.quotationId?.toString() || '',
                order.dateReceipt ? new Date(order.dateReceipt).toLocaleDateString('es-ES') : '',
                order.dueDate ? new Date(order.dueDate).toLocaleDateString('es-ES') : ''
              ])
              generatePDFTable('Órdenes de Corte', headers, data, 'ordenes_corte')
            }} />
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

              {/* Sección de Imagen del Diseño */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-gray-900">
                    <PictureOutlined className="mr-2" />
                    Imagen del Diseño
                  </h4>
                </div>
                <div className="flex flex-col items-center">
                  <Spin spinning={uploadingImage}>
                    {image ? (
                      <img
                        src={image}
                        alt="Diseño"
                        className="w-64 h-48 object-contain rounded border mb-3"
                      />
                    ) : (
                      <div className="w-64 h-48 bg-gray-200 rounded flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-sm">Sin imagen de diseño</span>
                      </div>
                    )}
                    <Upload
                      beforeUpload={(file) => {
                        if (currentQuotationId) {
                          const isShirt = quotationProducts.some(p => 'clothFrontShirtId' in p);
                          CuttingUtils.handleUploadOrderImage(
                            file,
                            isShirt,
                            currentDesign,
                            currentQuotationId,
                            setImage,
                            setCurrentDesign,
                            setUploadingImage
                          );
                        }
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />} type="primary">
                        {image ? 'Cambiar Imagen' : 'Subir Imagen'}
                      </Button>
                    </Upload>
                  </Spin>
                </div>
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

                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Orden de corte {isShirtProduct(product) ? '(Playera)' : '(Short)'}
                      </h3>
                      <Button
                        icon={<EditOutlined />}
                        type="primary"
                        size="small"
                        onClick={() =>
                          CuttingUtils.handleEditProduct(
                            product,
                            isShirtProduct(product),
                            setEditingProduct,
                            setIsEditingShirt,
                            editProductForm,
                            setVisibleEditProduct
                          )
                        }
                      >
                        Editar
                      </Button>
                    </div>

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

      {/* Drawer para editar orden de corte */}
      <Drawer
        title="Editar Orden de Corte"
        placement="right"
        onClose={() => CuttingUtils.handleCloseEdit(editForm, setVisibleEdit)}
        open={visibleEdit}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => CuttingUtils.handleCloseEdit(editForm, setVisibleEdit)}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                editForm
                  .validateFields()
                  .then(() => {
                    CuttingUtils.handleSave(
                      editForm,
                      editingOrder,
                      orders,
                      setOrders,
                      setVisibleEdit
                    )
                  })
                  .catch((errorInfo) => {
                    console.error('Error validating form:', errorInfo)
                    message.error('Por favor completa todos los campos requeridos.')
                  })
              }}
              type="primary"
            >
              Guardar
            </Button>
          </div>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="quotationId"
            label="Folio Cotización"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="dateReceipt"
            label="Fecha de Recibido"
            rules={[{ required: true, message: 'Por favor ingresa la fecha de recibido' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Fecha de Entrega"
            rules={[{ required: true, message: 'Por favor ingresa la fecha de entrega' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer para editar producto (Playera o Short) */}
      <Drawer
        title={isEditingShirt ? "Editar Playera" : "Editar Short"}
        placement="right"
        onClose={() => CuttingUtils.handleCloseEditProduct(editProductForm, setVisibleEditProduct)}
        open={visibleEditProduct}
        width={500}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => CuttingUtils.handleCloseEditProduct(editProductForm, setVisibleEditProduct)}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                editProductForm
                  .validateFields()
                  .then(() => {
                    CuttingUtils.handleSaveProduct(
                      editProductForm,
                      editingProduct,
                      isEditingShirt,
                      quotationProducts,
                      setQuotationProducts,
                      setVisibleEditProduct
                    )
                  })
                  .catch((errorInfo) => {
                    console.error('Error validating form:', errorInfo)
                    message.error('Por favor completa todos los campos requeridos.')
                  })
              }}
              type="primary"
            >
              Guardar
            </Button>
          </div>
        }
      >
        <Form form={editProductForm} layout="vertical">
          <Form.Item name="discipline" label="Disciplina" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {isEditingShirt ? (
            // Campos para Playera
            <>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="clothFrontShirtId" label="Tela Frente">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="clothBackShirtId" label="Tela Espalda">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="clothSleeveId" label="Tela Manga">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="clothNecklineId" label="Tela Cuello">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="clothCuffId" label="Tela Puño">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="neckline" label="Cuello">
                  <Select placeholder="Tipo de cuello">
                    <Select.Option value="Redondo">Redondo</Select.Option>
                    <Select.Option value="V">V</Select.Option>
                    <Select.Option value="Polo">Polo</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="typeNeckline" label="Tipo de Cuello">
                  <Select placeholder="Tipo">
                    <Select.Option value="Amplio">Amplio</Select.Option>
                    <Select.Option value="Cerrado">Cerrado</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="sleeveType" label="Tipo de Manga">
                  <Select placeholder="Tipo de manga">
                    <Select.Option value="Corta">Corta</Select.Option>
                    <Select.Option value="Larga">Larga</Select.Option>
                    <Select.Option value="3/4">3/4</Select.Option>
                    <Select.Option value="Tank">Tank</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="sleeveShape" label="Forma de Manga">
                  <Select placeholder="Forma de manga">
                    <Select.Option value="Ranglan">Ranglan</Select.Option>
                    <Select.Option value="Normal">Normal</Select.Option>
                    <Select.Option value="Sin manga">Sin manga</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="cuff" label="Puños">
                  <Select placeholder="Puños">
                    <Select.Option value="Si">Sí</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="typeCuff" label="Tipo de Puño">
                  <Select placeholder="Tipo de puño">
                    <Select.Option value="Sencillo">Sencillo</Select.Option>
                    <Select.Option value="Doble">Doble</Select.Option>
                    <Select.Option value="None">None</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </>
          ) : (
            // Campos para Short
            <>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="clothShortId" label="Tela Short">
                  <Select placeholder="Seleccionar tela">
                    {materials.map((m) => (
                      <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="viewShort" label="Vista Short">
                  <Select placeholder="Vista">
                    <Select.Option value="Frontal">Frontal</Select.Option>
                    <Select.Option value="Trasera">Trasera</Select.Option>
                    <Select.Option value="Completa">Completa</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="shortSection" label="Sección Short">
                  <Input />
                </Form.Item>
              </div>
            </>
          )}

          {/* Campos comunes */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="size" label="Talla" rules={[{ required: true }]}>
              <Select placeholder="Talla">
                <Select.Option value="XS">XS</Select.Option>
                <Select.Option value="S">S</Select.Option>
                <Select.Option value="M">M</Select.Option>
                <Select.Option value="L">L</Select.Option>
                <Select.Option value="XL">XL</Select.Option>
                <Select.Option value="XXL">XXL</Select.Option>
                <Select.Option value="XXXL">XXXL</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="quantity" label="Cantidad" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="gender" label="Género">
              <Select placeholder="Género">
                <Select.Option value={1}>Masculino</Select.Option>
                <Select.Option value={2}>Femenino</Select.Option>
                <Select.Option value={3}>Unisex</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="observation" label="Observación">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default CuttingOrderList