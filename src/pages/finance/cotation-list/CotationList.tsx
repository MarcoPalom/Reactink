import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Space,
  Table,
  Card,
  Input,
  Modal,
  Form,
  message,
  Select,
  InputNumber,
  Drawer
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SendOutlined,
  ClearOutlined
} from '@ant-design/icons'
import axios from 'axios'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { Quotation, QuotationAdd, Client  } from 'components/Scripts/Interfaces'
import html2pdf from 'html2pdf.js'
import {
  handleFinish,
  handleAddRow,
  handleEmpty,
  handleFieldChange,
  calculateSubtotal,
  calculateTaxAndNetAmount,
  calculateTotal,
  filterQuotations,
  addKeysToQuotations,
  handleFieldChangeMaquila,
  handleFinishMaquila
} from 'components/Scripts/QuotationUtils'
import {
  fetchQuotation,
  updateQuotation,
  addQuotation,
  deleteQuotation,
  addQuotationProduct
} from 'components/Scripts/Apicalls'
import {
  handleView,
  handleSave,
  handleAddSave,
  handleDelete,
  handleEdit
} from 'components/Scripts/QuotationUtils'
import TodayDate from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
const { Search } = Input
const { confirm } = Modal
const { Option } = Select

const CotationList = () => {
  const [Quotations, setQuotations] = useState<Quotation[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [taxPercentage, setTaxPercentage] = useState(0)
  const [Advance, setAdvance] = useState(0)
  const [netAmount, setNetAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [quotationProducts, setQuotationProducts] = useState([])
  const [quotationProductsMaquila, setQuotationProductsMaquila] = useState([])
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const [subtotal] = useState(0)
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [addQuotationForm] = Form.useForm()
  const [currentTable, setCurrentTable] = useState('cotizacion_producto');

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/client/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setClients(response.data)
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/quotation/',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setQuotations(response.data)
      } catch (error) {
        console.error('Error fetching Quotations:', error)
      }
    }
    fetchQuotations()
    fetchClients()
  }, [visibleAdd])
  useEffect(() => {
    const fetchQuotationProducts = async () => {
      try {
        if (selectedQuotation) {
          const response = await axios.get(
            `http://localhost:3001/api/quotation-product/?quotationid=${selectedQuotation.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          const filteredProducts = filterProductsByQuotationId(
            response.data,
            selectedQuotation.id
          )
          setQuotationProducts(filteredProducts)
        } else {
          setQuotationProducts([])
        }
      } catch (error) {
        console.error('Error fetching quotation products:', error)
      }
    }

   

    const fetchQuotationProductsMaquila = async () => {
      try {
        if (selectedQuotation) {
          const response = await axios.get(
            `http://localhost:3001/api/quotation-product-maquila/?quotationid=${selectedQuotation.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          const filteredProducts = filterProductsByQuotationId(
            response.data,
            selectedQuotation.id
          )
          setQuotationProductsMaquila(filteredProducts)
        } else {
          setQuotationProductsMaquila([])
        }
      } catch (error) {
        console.error('Error fetching quotation products:', error)
      }
    }
    
    fetchQuotationProducts()
    fetchQuotationProductsMaquila()
  }, [selectedQuotation])
  

  const filterProductsByQuotationId = (products: any, quotationId: any) => {
    return products.filter(
      (product: any) => product.quotationId === quotationId
    )
  }

  
  const handleClose = () => {
    setVisible(false)
  }
  const handleCloseEdit = () => {
    EditForm.resetFields()
    setVisibleEdit(false)
  }
  const handleAdd = () => {
    setVisibleAdd(true)
  }
  const handleAddCancel = () => {
    setVisibleAdd(false)
    EditForm.resetFields()
    addForm.resetFields()
  }
  const handleFinishClick = () => {
    const subtotal = calculateSubtotal(dataSource)
    handleFinish(addForm, dataSource)
  }
  const handleFinishClickMaquila = () => {
    const subtotal = calculateSubtotal(dataSource)
    handleFinishMaquila(addForm, dataSource)
  }

  const handleAddRowClick = () => {
    handleAddRow(count, setCount, setDataSource, dataSource)
  }
  const handleEmptyClick = () => {
    handleEmpty(confirm, setDataSource)
  }
  const handleSaveClick = async () => {
    try {
      if (editingQuotation) {
        await handleSave(EditForm, editingQuotation, Quotations, setQuotations, setVisibleEdit);
      
        for (const item of dataSource) {
          const pivotDataProduct = {
            quotationId: editingQuotation.id,
            description: item.description,
            quantity: item.quantity,
            amount: item.unitPrice,
            tax: item.tax,
            total: item.total,
          };
        }
      } else {
        console.error('No hay una cotización en edición');
        message.error('Error al guardar la Cotización');
        return;
      }
    } catch (error) {
      console.error('Error saving Quotation:', error);
      message.error('Error al guardar la Cotización');
    }
  }
  const handleAddSaveClick = async () => {
    await handleAddSave(addForm, dataSource, setVisibleAdd, setDataSource, setQuotations)
  }
  const handleViewClick = async (id: string) => {
    await handleView(id, setSelectedQuotation, setVisible)
  }

  const handleEditClick = async (record: Quotation) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/quotation-product/?quotationid=${record.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      const filteredProducts = filterProductsByQuotationId(
        response.data,
        record.id
      );
  
      setDataSource(filteredProducts);
      handleEdit(record, setEditingQuotation, EditForm, setVisibleEdit);
    } catch (error) {
      console.error('Error fetching quotation products:', error);
    }
  }

  const handleDeleteClick = (record: Quotation) => {
    handleDelete(record, deleteQuotation, Quotations, setQuotations)
  }
  const filteredQuotations = filterQuotations(Quotations, searchText)
  const filteredQuotationsWithKeys = addKeysToQuotations(filteredQuotations)

  const generatePDF = () => {
    const element = modalRef.current
    const options = {
      margin: 0.5,
      filename: `cotizacion_folio_${selectedQuotation?.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().from(element).set(options).save()
  }
  

  const handleSelectChange = (value:any) => {
    setCurrentTable(value); 
    setDataSource([]);
};

  const columnsAddQuotation = [
    {
      title: 'Descripcion',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (
        <Input
          value={text}
          onChange={(e) =>
            handleFieldChange(
              e.target.value,
              record.key,
              'description',
              dataSource,
              setDataSource
            )
          }
        />
      )
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) =>
            handleFieldChange(
              value,
              record.key,
              'amount',
              dataSource,
              setDataSource
            )
          }
        />
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) =>
            handleFieldChange(
              value,
              record.key,
              'quantity',
              dataSource,
              setDataSource
            )
          }
        />
      )
    },
    {
      title: 'Impuesto (%)',
      dataIndex: 'tax',
      key: 'tax',
      render: (text: number, record: any) => (
        <InputNumber
          min={0}
          max={100}
          value={record.tax}
          onChange={(value) =>
            handleFieldChange(
              value,
              record.key,
              'tax',
              dataSource,
              setDataSource
            )
          }
        />
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text: any) => `$${parseFloat(text).toFixed(2)}`
    }
  ]

  const columnsAddQuotationMaquila = [
    {
        title: 'Descripcion',
        dataIndex: 'description',
        key: 'description',
        render: (text: string, record: any) => (
            <Input
                value={text}
                onChange={(e) =>
                    handleFieldChangeMaquila(
                        e.target.value,
                        record.key,
                        'description',
                        dataSource,
                        setDataSource
                    )
                }
            />
        )
    },
    {
        title: 'Precio M',
        dataIndex: 'price_meter',
        key: 'price_meter',
        render: () => (
            <span>120</span> 
        )
    },
    {
        title: 'Metros de impresion',
        dataIndex: 'meters_impression',
        key: 'meters_impression',
        render: (text: number, record: any) => (
          <InputNumber
          step={0.1} 
          min={0}
          value={text}
          onChange={(value) =>
              handleFieldChangeMaquila(
                  value,
                  record.key,
                  'meters_impression',
                  dataSource,
                  setDataSource
              )
          }
      />
        )
    },
    {
        title: 'Precio Unitario',
        dataIndex: 'price_unit',
        key: 'price_unit',
        render: (text: number) => (
          <span>{`$${text ? text.toFixed(2) : '0.00'}`}</span> 
        )
    },
    {
        title: 'Cantidad',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (text: number, record: any) => (
            <InputNumber
                min={0}
                value={text}
                onChange={(value) =>
                    handleFieldChangeMaquila(
                        value,
                        record.key,
                        'quantity',
                        dataSource,
                        setDataSource
                    )
                }
            />
        )
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => (
          <span>{`$${text ? text.toFixed(2) : '0.00'}`}</span> 
      )
  }
];

  const columns = [
    {
      title: 'Folio',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Fecha de Recibido',
      dataIndex: 'dateReceipt',
      key: 'dateReceipt',
      render: (dateReceipt: string) =>
        new Date(dateReceipt).toLocaleDateString()
    },
    {
      title: 'Fecha de Expiracion',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (expirationDate: string) =>
        new Date(expirationDate).toLocaleDateString()
    },
    {
      title: 'Cliente',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: string) => {
        const client = clients.find((client) => client.id === clientId)
        return client ? client.name : 'Cliente no encontrado'
      }
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `$${Number(subtotal).toFixed(2)}`
    },
    {
      title: 'Impuesto',
      dataIndex: 'tax',
      key: 'tax',
      render: (tax: number) => `${Number(tax).toFixed(2)}%`
    },
    {
      title: 'Valor neto',
      dataIndex: 'netAmount',
      key: 'netAmount',
      render: (netAmount: number) => `$${Number(netAmount).toFixed(2)}`
    },
    {
      title: 'Avance',
      dataIndex: 'advance',
      key: 'advance',
      render: (advance: number) => `$${Number(advance).toFixed(2)}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${Number(total).toFixed(2)}`
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => handleViewClick(record.id.toString())}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => handleEditClick(record)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => handleDeleteClick(record)}
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <Modal
        title="Detalles de la Cotizacion"
        open={visible}
        onCancel={handleClose}
        footer={[
          <Button
            key="pdf"
            icon={<FilePdfOutlined className="text-red-500" />}
            onClick={generatePDF}
          ></Button>
        ]}
      >
        {selectedQuotation && (
          <div ref={modalRef}>
            <div className="mt-5 flex justify-between">
              <img src={Logo} alt="Ink Sports" className="h-10 " />
              <h1 className="text-end">
                {' '}
                Ciudad victoria, Tamaulipas a<TodayDate></TodayDate>{' '}
              </h1>
            </div>
            <h1 className="mb-5 mt-5 text-center text-xl">
              {' '}
              Cotización Folio: {selectedQuotation?.id}
            </h1>
            <div className="flex flex-row  gap-10 mb-5">
              <div className="text-sm">
                <p>
                  <strong>Fecha de recibido:</strong>{' '}
                  {new Date(selectedQuotation.dateReceipt).toLocaleDateString(
                    'es-ES'
                  )}
                </p>
                <p>
                  <strong>Fecha de expiracion:</strong>{' '}
                  {new Date(selectedQuotation.dateReceipt).toLocaleDateString(
                    'es-ES'
                  )}
                </p>
                <p>
                  <strong>Cliente:</strong> {selectedQuotation.clientId}
                </p>
                <p>
                  <strong>Subtotal:</strong> {'$'}
                  {selectedQuotation.subtotal}
                </p>
              </div>
              <div className="text-sm">
                <p>
                  <strong>Impuesto:</strong> {selectedQuotation.tax}
                  {'%'}
                </p>
                <p>
                  <strong>Total neto:</strong> {'$'}
                  {selectedQuotation.netAmount}
                </p>
                <p>
                  <strong>Avance:</strong> {'$'}
                  {selectedQuotation.advance}
                </p>
                <p>
                  <strong>Total:</strong> {'$'}
                  {selectedQuotation.total}
                </p>
              </div>
            </div>

            {quotationProducts.length > 0 && (
            <Table
              dataSource={quotationProducts}
              columns={[
                {
                  title: 'Descripción',
                  dataIndex: 'description',
                  key: 'description'
                },
                {
                  title: 'Cantidad',
                  dataIndex: 'quantity',
                  key: 'quantity'
                },
                {
                  title: 'Precio C/U',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (text: any) => `$${parseFloat(text).toFixed(2)}`
                },
                {
                  title: 'Impuesto',
                  dataIndex: 'tax',
                  key: 'tax',
                  render: (text: any) => `${parseFloat(text).toFixed(2)}%`
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  key: 'total',
                  render: (text: any) => `$${parseFloat(text).toFixed(2)}`
                }
              ]}
            />
          )}
            {quotationProductsMaquila.length > 0 && (
            <Table
              dataSource={quotationProductsMaquila}
              columns={[
                {
                  title: 'Descripción',
                  dataIndex: 'description',
                  key: 'description'
                },
                {
                  title: 'Cantidad',
                  dataIndex: 'quantity',
                  key: 'quantity'
                },
                {
                  title: 'Precio M',
                  dataIndex: 'price_meter',
                  key: 'price_meter',
                  render: (text: any) => `$${parseFloat(text).toFixed(2)}`
                },
                {
                  title: 'Metros de impresion',
                  dataIndex: 'meters_impression',
                  key: 'meters_impression',
                  render: (text: any) => `${parseFloat(text).toFixed(2)}m`
                },
                {
                  title: 'Precio C/U',
                  dataIndex: 'price_unit',
                  key: 'price_unit',
                  render: (text: any) => `$${parseFloat(text).toFixed(2)}`
                },
                {
                  title: 'Total',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (text: any) => `$${parseFloat(text).toFixed(2)}`
                }
              ]}
              scroll={{ x: 240 }} 
            />
          )}

            <div className="mt-5 mb-5 text-end text-xs">
              <h1> 1 Y 2 Hidalgo, Zona Centro Cd. Victoria, Tamaulipas </h1>
              <h1>Tel: (834)-312-16-58 Whatsapp: 8341330078</h1>
              <p className="mt-2">
                Si usted tiene alguna pregunta sobre esta cotización, por favor,
                póngase en contacto con nosotros INK SUBLIMACIÓN, al 31 2 16 58
                o a nuestro E-mail inkcomprasvic@gmail.com
              </p>
            </div>
          </div>
        )}
      </Modal>

<Drawer
  title="Editar Cotización"
  open={visibleEdit}
  onClose={handleCloseEdit}
  size="large"
  className="modal"
  extra={
    <Space>
      <Button onClick={handleSaveClick} type="primary">
        Aceptar
      </Button>
    </Space>
  }
>
  <div className="overflow-auto">
    <Table
      columns={columnsAddQuotation} 
      dataSource={dataSource}
      pagination={false}
      footer={() => (
        <Space className="flex justify-end">
          <Button
            onClick={handleAddRowClick}
            icon={<PlusOutlined className="text-cyan-500" />}
          />
          <Button
            onClick={handleFinishClick}
            icon={<SendOutlined className="text-green-500" />}
          />
          <Button
            onClick={handleEmptyClick}
            icon={<ClearOutlined className="text-red-500" />}
          />
        </Space>
      )}
    />
    <Form form={EditForm} layout="vertical" className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Form.Item name="dateReceipt" label="Fecha de recibido" >
            <Input type="date" className="w-full" />
          </Form.Item>
          <Form.Item name="expirationDate" label="Fecha de expiración" >
            <Input type="date" className="w-full" />
          </Form.Item>
        </div>
        <div>
          <Form.Item name="tax" label="Impuesto">
          <InputNumber
                    onChange={(value) => {
                      if (value !== null) {
                        setTaxPercentage(value)
                        const newNetAmount = calculateTaxAndNetAmount(EditForm)
                        EditForm.setFieldsValue({ netAmount: newNetAmount })
                        EditForm.setFieldsValue({ total: newNetAmount })
                      }
                    }}
                    defaultValue={0}
                    className="w-full"
                  />
          </Form.Item>

          <Form.Item name="netAmount" label="Total Neto">
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Form.Item name="subtotal" label="Subtotal" >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <div>
          <Form.Item name="advance" label="Avance" >
          <InputNumber
                    min={0}
                    onChange={(value) => {
                      if (value !== null) {
                        setAdvance(value)
                        const newTotal = calculateTotal(EditForm)
                        EditForm.setFieldsValue({ total: newTotal })
                      }
                    }}
                    className="w-full"
                  />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Form.Item name="total" label="Total" >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item name="clientId" label="Cliente">
            <Select placeholder="Selecciona un cliente">
              {clients.map((client: any) => (
                <Option key={client.id} value={client.id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
    </Form>
  </div>
</Drawer>

      <Drawer
        title="Añadir Nueva Cotización"
        open={visibleAdd}
        onClose={handleAddCancel}
        size="large"
        className="modal"
        extra={
          <Space>
            <Button onClick={handleAddSaveClick} type="primary">
              Aceptar
            </Button>
          </Space>
        }
      >
       <Select
        placeholder="Selecciona una opción"
        onChange={handleSelectChange}
        value={currentTable}
        className="w-full mb-4"
    >
        <Option value="cotizacion_producto">Añadir Cotización Producto</Option>
        <Option value="cotizacion_maquila">Añadir Cotización Maquila</Option>
    </Select>
        <div className="overflow-auto">

        {currentTable === 'cotizacion_producto' && (
          <Table
            columns={columnsAddQuotation}
            dataSource={dataSource}
            pagination={false}
            footer={() => (
              <Space className="flex justify-end">
                <Button
                  onClick={handleAddRowClick}
                  icon={<PlusOutlined className="text-cyan-500" />}
                />
                <Button
                  onClick={handleFinishClick}
                  icon={<SendOutlined className="text-green-500" />}
                />
                <Button
                  onClick={handleEmptyClick}
                  icon={<ClearOutlined className="text-red-500" />}
                />
              </Space>
            )}
          />
         )}  

           {currentTable === 'cotizacion_maquila' && (
          <Table
            columns={columnsAddQuotationMaquila}
            dataSource={dataSource}
            pagination={false}
            footer={() => (
              <Space className="flex justify-end">
                <Button
                  onClick={handleAddRowClick}
                  icon={<PlusOutlined className="text-cyan-500" />}
                />
                <Button
                  onClick={handleFinishClickMaquila}
                  icon={<SendOutlined className="text-green-500" />}
                />
                <Button
                  onClick={handleEmptyClick}
                  icon={<ClearOutlined className="text-red-500" />}
                />
              </Space>
            )}
          />
        )}
          <Form form={addForm} layout="vertical" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item name="dateReceipt" label="Fecha de recibido">
                  <Input type="date" className="w-full" />
                </Form.Item>
                <Form.Item name="expirationDate" label="Fecha de expiración">
                  <Input type="date" className="w-full" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="tax"
                  label="Impuesto"
                  initialValue={taxPercentage}
                >
                  <InputNumber
                    min = {0}
                    onChange={(value) => {
                      if (value !== null) {
                        setTaxPercentage(value)
                        const newNetAmount = calculateTaxAndNetAmount(addForm)
                        addForm.setFieldsValue({ netAmount: newNetAmount })
                        addForm.setFieldsValue({ total: newNetAmount })
                      }
                    }}
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item name="netAmount" label="Total Neto">
                  <InputNumber value={netAmount} readOnly className="w-full" />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item name="subtotal" label="Subtotal">
                  <InputNumber value={subtotal} readOnly className="w-full" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="advance" label="Avance">
                  <InputNumber
                    min={0}
                    onChange={(value) => {
                      if (value !== null) {
                        setAdvance(value)
                        const newTotal = calculateTotal(addForm)
                        addForm.setFieldsValue({ total: newTotal })
                      }
                    }}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Form.Item name="total" label="Total">
                  <InputNumber value={total} readOnly className="w-full" />
                </Form.Item>

                <Form.Item name="clientId" label="Cliente">
                  <Select placeholder="Selecciona un cliente">
                    {clients.map((client: any) => (
                      <Option key={client.id} value={client.id}>
                        {client.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>

     



      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Finanzas</h4>
          <h6 className="text-sm">Lista de Cotizaciones</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={handleAdd}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir Nueva
            Cotizacion{' '}
          </a>
        </Button>
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
            <FilePdfOutlined className="text-red-500" />
            <FileExcelOutlined className="text-lime-500" />
            <PrinterOutlined />
          </div>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredQuotationsWithKeys}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  )
}

export default CotationList
