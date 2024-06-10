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
import { Quotation, QuotationAdd, Client } from 'components/Scripts/Interfaces'
import html2pdf from 'html2pdf.js'
import {
  handleFinish,
  handleAddRow,
  handleEmpty,
  handleFieldChange,
  calculateSubtotal,
  calculateTaxAndNetAmount,
  calculateTotal
} from 'components/Scripts/QuotationUtils'

const { Search } = Input
const { confirm } = Modal
const { Option } = Select

const CotationList = () => {
  const [Quotations, setQuotations] = useState<Quotation[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  )
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null
  )
  const navigate = useNavigate()
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [addQuotationForm] = Form.useForm()
  const [dataSource, setDataSource] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [subtotal] = useState(0)
  const [taxPercentage, setTaxPercentage] = useState(0)
  const [Advance, setAdvance] = useState(0)
  const [netAmount, setNetAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const modalRef = useRef(null)
  const [quotationProducts, setQuotationProducts] = useState([])

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
          );
          console.log(response.data);
          const filteredProducts = filterProductsByQuotationId(response.data, selectedQuotation.id);
          setQuotationProducts(filteredProducts);
        } else {
          // Si no hay cotización seleccionada, establecer productos en vacío
          setQuotationProducts([]);
        }
      } catch (error) {
        console.error('Error fetching quotation products:', error);
      }
    };
  
    fetchQuotationProducts();
  }, [selectedQuotation]);
  
  // Función para filtrar los productos por el id de cotización
  const filterProductsByQuotationId = (products:any, quotationId:any) => {
    return products.filter((product: any) => product.quotationId === quotationId);
  };

  const handleView = async (id: string) => {
    try {
      const response = await axios.get<Quotation>(
        `http://localhost:3001/api/quotation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      console.log(response.data);
      setSelectedQuotation(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching Quotation details:', error)
    }
  }

  const handleSave = async () => {
    try {
      const values = await EditForm.validateFields()
      const response = await axios.put<Quotation>(
        `http://localhost:3001/api/quotation/update/${editingQuotation?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      message.success('Cotizacion actualizado exitosamente')
      const updatedQuotations = Quotations.map((Quotation) =>
        Quotation.id === editingQuotation?.id
          ? { ...Quotation, ...values }
          : Quotation
      )
      setQuotations(updatedQuotations)
      setVisibleEdit(false)
      EditForm.resetFields()
    } catch (error) {
      console.error('Error updating Quotation:', error)
      message.error('Error al actualizar la Cotizacion')
    }
  }

  const handleAddSave = async () => {
    try {
      const values = await addForm.validateFields()
      if (values.password !== values.confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }

      const QuotationData: QuotationAdd = {
        ...values
      }

      const response = await axios.post<Quotation>(
        'http://localhost:3001/api/quotation/',
        QuotationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      dataSource.forEach(async (item) => {
        const pivotDataProduct = {
          quotationId: response.data.id,
          description: item.description,
          quantity: item.quantity,
          amount: item.unitPrice,
          tax: item.tax,
          total: item.total
        }
        console.log(pivotDataProduct)
        await axios.post(
          'http://localhost:3001/api/quotation-product/',
          pivotDataProduct,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      })

      setQuotations((prevQuotations) => [...prevQuotations, response.data])
      message.success('Cotizacion agregado exitosamente')
      setVisibleAdd(false)
      addForm.resetFields()
    } catch (error: any) {
      console.error('Error adding Quotation:', error)
      message.error(
        error.response?.data.message || 'Error al agregar la Cotizacion'
      )
    }
  }

  const handleDelete = (record: Quotation) => {
    confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres eliminar la cotizacion?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deletequotation(record.id)
      }
    })
  }

  const deletequotation = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/quotation/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      message.success('Cotizacion eliminado exitosamente')
      const updatedQuotations = Quotations.filter(
        (Quotation) => Quotation.id !== id
      )
      setQuotations(updatedQuotations)
    } catch (error) {
      console.error('Error deleting Quotation:', error)
      message.error('Error al eliminar la Cotizacion')
    }
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

  const handleEdit = async (record: Quotation) => {
    try {
      setEditingQuotation(record)
      EditForm.setFieldsValue(record)
      setVisibleEdit(true)
    } catch (error) {
      console.error('Error al editar la Cotizacion:', error)
    }
  }

  const handleFinishClick = () => {
    const subtotal = calculateSubtotal(dataSource)
    handleFinish(addForm, dataSource)
  }

  const handleAddRowClick = () => {
    handleAddRow(count, setCount, setDataSource, dataSource)
  }

  const handleEmptyClick = () => {
    handleEmpty(confirm, setDataSource)
  }

  const generatePDF = () => {
    const element = modalRef.current;
    const options = {
      margin: 0.5,
      filename: `cotizacion_folio_${selectedQuotation?.id}.pdf`, // Nombre del archivo PDF
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      // Agregar título al PDF con el folio de la cotización
      title: `Cotización Folio: ${selectedQuotation?.id}`,
      // Estilo del título
      titleStyle: {
        textAlign: 'center', // Alineación centrada
        fontSize: 18, // Tamaño de fuente
        color: '#333', // Color del texto
        textDecoration: 'underline' // Subrayado
        // Otros estilos CSS pueden ser aplicados según tus preferencias
      }
    };
  
    html2pdf().from(element).set(options).save();
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
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text: number, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) =>
            handleFieldChange(
              value,
              record.key,
              'unitPrice',
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
      sorter: (a: any, b: any) => a.address.length - b.address.length,
      render: (tax: number) => `$${Number(tax).toFixed(2)}`
    },
    {
      title: 'Valor neto',
      dataIndex: 'netAmount',
      key: 'netAmount',
      sorter: (a: any, b: any) => a.salary - b.salary,
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
      sorter: (a: any, b: any) => a.role - b.role,
      render: (total: number) => `$${Number(total).toFixed(2)}`
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => handleView(record.id.toString())}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      )
    }
  ]

  const filteredQuotations = searchText
    ? Quotations.filter((Quotation) =>
        Quotation.id.toString().includes(searchText.toLowerCase())
      )
    : Quotations

  const filteredQuotationsWithKeys = filteredQuotations.map(
    (Quotation, index) => ({
      ...Quotation,
      key: index.toString()
    })
  )

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
            <div className="flex flex-row  gap-10 mb-5">
              <div>
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
                  <strong>Subtotal:</strong> {selectedQuotation.subtotal}
                  {'$'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Impuesto:</strong> {selectedQuotation.tax}
                  {'$'}
                </p>
                <p>
                  <strong>Total neto:</strong> {selectedQuotation.netAmount}
                  {'$'}
                </p>
                <p>
                  <strong>Avance:</strong> {selectedQuotation.advance}
                  {'$'}
                </p>
                <p>
                  <strong>Total:</strong> {selectedQuotation.total}
                  {'$'}
                </p>
              </div>
            </div>

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
                  title: 'Precio',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => price
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  key: 'total',
                  render: (total: number) => total
                }
              ]}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Editar Cotizacion"
        open={visibleEdit}
        onCancel={handleCloseEdit}
        onOk={handleSave}
      >
        <Form form={EditForm} layout="vertical">
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
          <Form.Item name="surname" label="Apellido">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefono">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Direccion">
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salario">
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Fecha de inicio">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Puesto">
            <Select placeholder="Selecciona un puesto">
              <Select.Option value={1}>Administrador</Select.Option>
              <Select.Option value={2}>Financiero</Select.Option>
              <Select.Option value={3}>Auxiliar</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Añadir Nueva Cotización"
        open={visibleAdd}
        onClose={handleAddCancel}
        size="large"
        className="modal"
        extra={
          <Space>
            <Button onClick={handleAddSave} type="primary">
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
                    onChange={(value) => {
                      if (value !== null) {
                        setTaxPercentage(value)
                        const newNetAmount = calculateTaxAndNetAmount(addForm)
                        addForm.setFieldsValue({ netAmount: newNetAmount })
                        addForm.setFieldsValue({ total: newNetAmount })
                      }
                    }}
                    defaultValue={0}
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
