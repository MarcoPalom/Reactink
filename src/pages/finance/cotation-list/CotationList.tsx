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
  Drawer,
  Switch,
  DatePicker
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SendOutlined,
  ClearOutlined,
  ScissorOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  SaveOutlined
} from '@ant-design/icons'
import axios from 'axios'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import {
  Quotation,
  Client,
  Material,
  FormDataShirt,
  CuttingOrderData
} from 'components/Scripts/Interfaces'
import html2pdf from 'html2pdf.js'
import {
  handleFinish,
  handleAddRow,
  handleEmpty,
  handleFieldChange,
  calculateSubtotal,
  calculateTaxAndNetAmount,
  calculateTaxAndNetAmountEdit,
  calculateTotal,
  filterQuotations,
  addKeysToQuotations,
  handleFieldChangeMaquila,
  handleFinishMaquila,
  handleDeleteProduct,
  handleAdvanceChange,
  disciplines,
  cloths,
  neckForms,
  neckTypes,
  sleeveForms,
  sleeveTypes,
  cuffs,
  cuffsTypes,
  sizes,
  calculateAndUpdateTotal,
  handleInputNumberChangeShirts,
  handleInputChangeShirts,
  handleGenderToggleShirts,
  shortLooks,
  sections,
  handleAddRowShorts,
  handleEmptyShorts,
  handleSelectChangeShirtShorts,
  handleInputNumberChangeShorts,
  handleInputChangeShorts,
  handleGenderToggleShorts,
  handleFormSubmitShirt,
  useFormHandler,
  isSaveButtonDisabled,
  handleSubmitShirts,
  genderMap
} from 'components/Scripts/QuotationUtils'
import {
  fetchQuotation,
  updateQuotation,
  addQuotation,
  deleteQuotation,
  deleteQuotationProduct,
  deleteQuotationProductMaquila,
  addQuotationProduct,
  fetchMaterialName
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
import { FaTshirt } from 'react-icons/fa'
import { GiUnderwearShorts, GiGoalKeeper } from 'react-icons/gi'
import { generatePDF } from 'components/Scripts/Utils'
import FormItem from 'antd/es/form/FormItem'

const { Search } = Input
const { confirm } = Modal
const { Option } = Select

const CotationList = () => {
  const [Quotations, setQuotations] = useState<Quotation[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [visibleCut, setVisibleCut] = useState<boolean>(false)
  const [isShirtForm, setIsShirtForm] = useState(true)
  const [isShortForm, setIsShortForm] = useState(true)
  const [isShirtFormVisible, setIsShirtFormVisible] = useState(false)
  const [isShortFormVisible, setIsShortFormVisible] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  )
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null
  )
  const [dataSource, setDataSource] = useState<any[]>([])
  const [dataSourceShorts, setDataSourceShorts] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [taxPercentage, setTaxPercentage] = useState(0)
  const [Advance, setAdvance] = useState(0)
  const [taxLocked, setTaxLocked] = useState(false)
  const [netAmount, setNetAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [quotationProducts, setQuotationProducts] = useState([])
  const [quotationProductsMaquila, setQuotationProductsMaquila] = useState([])
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const [subtotal] = useState(0)
  const [EditForm] = Form.useForm()
  const [ShirtForm] = Form.useForm()
  const [CuttingForm] = Form.useForm()
  const [ShortForm] = Form.useForm()
  const [GoalkeeperShirtForm] = Form.useForm()
  const [GoalkeeperShortForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [currentTable, setCurrentTable] = useState('cotizacion_producto')
  const { colors, handleMaterialChange } = useFormHandler(materials)
  const [shirts, setShirts] = useState<FormDataShirt[]>([])
  const [CuttingOrderDt, setCuttingOrderDt] = useState<CuttingOrderData[]>([])
  const [isModalShirtsTempVisible, SetisModalShirtsTempVisible] =
    useState<boolean>(false)
  const [selectedShirt, setSelectedShirt] = useState<FormDataShirt | null>(null)
  const [isObservationFilled, setIsObservationFilled] = useState(false)
  const isSaveDisabled = isSaveButtonDisabled(shirts)
  const [productType, setProductType] = useState<number | null>(null)
  const [id, setId] = useState<any>(0)

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
    fetchMaterialName(setMaterials)
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

  const handleSwitchChange = (checked: any) => {
    setIsShirtForm(checked)
  }
  const handleSwitchChangeShort = (checked: any) => {
    setIsShortForm(checked)
  }

  const handleClose = () => {
    setVisible(false)
    setTaxLocked(false)
  }
  const handleCloseEdit = () => {
    EditForm.resetFields()
    setVisibleEdit(false)
    setTaxLocked(false)
  }
  const handleAdd = () => {
    setVisibleAdd(true)
  }
  const handleAddCancel = () => {
    setVisibleAdd(false)
    EditForm.resetFields()
    addForm.resetFields()
    setTaxLocked(false)
  }
  const handleAddCut = () => {
    setVisibleCut(true)
  }
  const handleAddCutCancel = () => {
    setVisibleCut(false)
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
    handleEmpty(confirm, setDataSource, setTaxLocked, EditForm)
  }
  const handleAddRowClickShorts = () => {
    handleAddRowShorts(count, setCount, setDataSourceShorts, dataSourceShorts)
  }
  const handleEmptyClickShorts = () => {
    handleEmptyShorts(confirm, setDataSourceShorts)
  }
  const handleSaveClick = async () => {
    try {
      if (editingQuotation) {
        await handleSave(
          EditForm,
          editingQuotation,
          Quotations,
          setQuotations,
          setVisibleEdit,
          setTaxLocked,
          dataSource
        )
      } else {
        console.error('No hay una cotización en edición')
        message.error('Error al guardar la Cotización')
        return
      }
    } catch (error) {
      console.error('Error saving Quotation:', error)
      message.error('Error al guardar la Cotización')
    }
  }

  const handleAddSaveClick = async () => {
    await handleAddSave(
      addForm,
      dataSource,
      setVisibleAdd,
      setDataSource,
      setQuotations
    )
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
      )

      const filteredProducts = filterProductsByQuotationId(
        response.data,
        record.id
      )

      setDataSource(filteredProducts)
      handleEdit(record, setEditingQuotation, EditForm, setVisibleEdit)
    } catch (error) {
      console.error('Error fetching quotation products:', error)
    }
  }

  const handleDeleteClick = (record: Quotation) => {
    handleDelete(record, deleteQuotation, Quotations, setQuotations)
  }

  const handleDeleteProductsClick = (record: Quotation) => {
    handleDeleteProduct(
      record,
      deleteQuotationProductMaquila,
      deleteQuotationProduct,
      quotationProductsMaquila,
      setQuotationProductsMaquila,
      quotationProducts,
      setQuotationProducts
    )
  }
  const toggleShirtForm = () => {
    setIsShirtFormVisible(!isShirtFormVisible)
    setProductType(isShirtFormVisible ? null : 1)
  }

  const toggleShortForm = () => {
    setIsShortFormVisible(!isShortFormVisible)
  }

  const filteredQuotations = filterQuotations(Quotations, searchText)
  const filteredQuotationsWithKeys = addKeysToQuotations(filteredQuotations)

  const generatePDFS = () => {
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

  const handleSelectChange = (value: any) => {
    setCurrentTable(value)
    setDataSource([])
  }

  const handleViewDetails = (record: any) => {
    setSelectedShirt(record)
    SetisModalShirtsTempVisible(true)
  }

  const handlecutSummitShirts = async () => {
    if (selectedQuotation) {
      await handleSubmitShirts(shirts,CuttingOrderDt, selectedQuotation.id)
    } else {
      console.error('No quotation selected')
    }
  }

  const columnsTempShirt = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any, index: any) => `Orden # ${index + 1}`
    },
    {
      title: 'Datos',
      key: 'action',
      render: (text: string, record: any) => (
        <Button
          icon={<MoreOutlined />}
          onClick={() => handleViewDetails(record)}
        ></Button>
      )
    },
    {
      title: 'Talla',
      dataIndex: 'size',
      key: 'size',
      render: (text: any, record: any) => (
        <Select
          className="w-16"
          defaultValue={text}
          onChange={(value) =>
            handleInputNumberChangeShirts(
              shirts,
              setShirts,
              value,
              record.key,
              'size'
            )
          }
        >
          {sizes.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: any, record: any) => (
        <InputNumber
          className="w-12"
          min={0}
          defaultValue={text}
          onChange={(value) =>
            calculateAndUpdateTotal(shirts, setShirts, record.key, value)
          }
        />
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text: any, record: any) => record.total || '0.00'
    },
    {
      title: 'Género',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: any, record: any) => {
        const genderText = genderMap[text] || '?'; 
        
        const buttonClass =
        genderText === 'H'
            ? 'bg-blue-500 text-white'
            : genderText === 'M'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-black border border-gray-300';
    
        return (
          <Button
            className={`w-10 ${buttonClass}`}
            onClick={() =>
              handleGenderToggleShirts(shirts, setShirts, record.key)
              
            }
          >
            {genderText}
          </Button>
        );
      }
    },
    {
      title: 'Observación',
      dataIndex: 'observation',
      key: 'observation',
      render: (text: any, record: any) => (
        <Input
          defaultValue={text}
          onChange={(e) =>
            handleInputChangeShirts(
              shirts,
              setShirts,
              e,
              record.key,
              'observation',
              setIsObservationFilled
            )
          }
        />
      )
    }
  ]

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
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => handleDeleteProductsClick(record)}
          />
        </Space>
      )
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
      render: () => <span>120</span>
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
      className: 'hidden lg:table-cell',
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
      className: 'hidden lg:table-cell',
      render: (subtotal: number) => `$${Number(subtotal).toFixed(2)}`
    },
    {
      title: 'Impuesto',
      dataIndex: 'tax',
      key: 'tax',
      className: 'hidden lg:table-cell',
      render: (tax: number) => `${Number(tax).toFixed(2)}%`
    },
    {
      title: 'Valor neto',
      dataIndex: 'netAmount',
      key: 'netAmount',
      className: 'hidden lg:table-cell',
      render: (netAmount: number) => `$${Number(netAmount).toFixed(2)}`
    },
    {
      title: 'Avance',
      dataIndex: 'advance',
      key: 'advance',
      className: 'hidden lg:table-cell',
      render: (advance: number) => `$${Number(advance).toFixed(2)}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: 'hidden lg:table-cell',
      render: (total: number) => `$${Number(total).toFixed(2)}`
    },
    {
      title: 'Accion',
      key: 'action',
      className: 'action-column',
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
          <Button
            icon={<ScissorOutlined className="text-gray-700" />}
            onClick={() => {
              setSelectedQuotation(record)
              handleAddCut()
            }}
          />
        </Space>
      )
    }
  ]

  const columnsShort = [
    {
      title: 'Talla',
      dataIndex: 'talla',
      key: 'talla',
      render: (text: any, record: any) => (
        <Select
          className="w-20"
          defaultValue={text}
          onChange={(value) =>
            handleSelectChangeShirtShorts(
              dataSourceShorts,
              setDataSourceShorts,
              value,
              record.key,
              'talla'
            )
          }
        >
          {sizes.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (text: any, record: any) => (
        <InputNumber
          min={0}
          defaultValue={text}
          onChange={(value) =>
            handleInputNumberChangeShorts(
              setDataSourceShorts,
              setDataSourceShorts,
              value,
              record.key,
              'cantidad'
            )
          }
        />
      )
    },
    {
      title: 'Genero',
      dataIndex: 'genero',
      key: 'genero',
      render: (text: any, record: any) => (
        <Button
          className={`w-10 ${
            text === 'H' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
          }`}
          onClick={() =>
            handleGenderToggleShorts(
              dataSourceShorts,
              setDataSourceShorts,
              record.key
            )
          }
        >
          {text}
        </Button>
      )
    },
    {
      title: 'Observación',
      dataIndex: 'observacion',
      key: 'observacion',
      render: (text: any, record: any) => (
        <Input
          defaultValue={text}
          onChange={(e) =>
            handleInputChangeShorts(
              dataSourceShorts,
              setDataSourceShorts,
              e,
              record.key,
              'observacion'
            )
          }
        />
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
            onClick={generatePDFS}
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
                <Form.Item name="dateReceipt" label="Fecha de recibido">
                  <Input type="date" className="w-full" />
                </Form.Item>
                <Form.Item name="expirationDate" label="Fecha de expiración">
                  <Input type="date" className="w-full" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="tax" label="Impuesto">
                  <InputNumber
                    min={0}
                    onChange={(value) => {
                      if (value !== null) {
                        setTaxPercentage(value)
                        const newNetAmount =
                          calculateTaxAndNetAmountEdit(EditForm)
                        EditForm.setFieldsValue({ netAmount: newNetAmount })
                        if (EditForm.getFieldValue('advance') !== null) {
                          const Advance = EditForm.getFieldValue('advance')
                          EditForm.setFieldsValue({
                            total: newNetAmount - Advance
                          })
                        }
                      } else {
                        const newNetAmount = EditForm.getFieldValue('subtotal')
                        EditForm.setFieldsValue({ netAmount: newNetAmount })
                        if (EditForm.getFieldValue('advance') !== null) {
                          const Advance = EditForm.getFieldValue('advance')
                          EditForm.setFieldsValue({
                            total: newNetAmount - Advance
                          })
                        }
                      }
                    }}
                    className="w-full"
                    disabled={taxLocked}
                  />
                </Form.Item>

                <Form.Item name="netAmount" label="Total Neto">
                  <InputNumber readOnly className="w-full" />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item name="subtotal" label="Subtotal">
                  <InputNumber readOnly className="w-full" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="advance" label="Avance">
                  <InputNumber
                    min={0}
                    onChange={(value) => {
                      if (value !== null) {
                        handleAdvanceChange(
                          value,
                          setAdvance,
                          EditForm,
                          setTaxLocked,
                          calculateTotal
                        )
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
                <Form.Item name="total" label="Total">
                  <InputNumber readOnly className="w-full" />
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
          <Option value="cotizacion_producto">
            Añadir Cotización Producto
          </Option>
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
                    min={0}
                    onChange={(value) => {
                      if (value !== null) {
                        setTaxPercentage(value)
                        const newNetAmount = calculateTaxAndNetAmount(addForm)
                        addForm.setFieldsValue({ netAmount: newNetAmount })
                        addForm.setFieldsValue({ total: newNetAmount })
                      } else {
                        const newNetAmount = addForm.getFieldValue('subtotal')
                        addForm.setFieldsValue({ netAmount: newNetAmount })
                        addForm.setFieldsValue({ total: newNetAmount })
                      }
                    }}
                    className="w-full"
                    disabled={taxLocked}
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
                        handleAdvanceChange(
                          value,
                          setAdvance,
                          addForm,
                          setTaxLocked,
                          calculateTotal
                        )
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

      <Drawer
        open={visibleCut}
        onClose={handleAddCutCancel}
        size="large"
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Orden de corte</span>
            <div className="flex space-x-4">
              <Button
                onClick={toggleShirtForm}
                className="flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-110"
              >
                <FaTshirt
                  className={`w-10 h-10 ${isShirtFormVisible ? 'text-green-500' : 'text-red-500'}`}
                />
                {isShirtFormVisible ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </Button>
              <Button
                onClick={toggleShortForm}
                className="flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-110"
              >
                <GiUnderwearShorts
                  className={`w-10 h-10 ${isShortFormVisible ? 'text-green-500' : 'text-red-500'}`}
                />
                {isShortFormVisible ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </Button>
            </div>
          </div>
        }
      >
        {isShirtFormVisible && (
          <div>
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                <FaTshirt
                  className={`w-10 h-10 text-green-500 ${isShirtForm ? 'block' : 'hidden'}`}
                />
                <GiGoalKeeper
                  className={`w-10 h-10 text-green-500 ${!isShirtForm ? 'block' : 'hidden'}`}
                />
                <Switch
                  onChange={handleSwitchChange}
                  checked={isShirtForm}
                  className="w-14 h-7"
                  checkedChildren={<span className="invisible" />}
                  unCheckedChildren={<span className="invisible" />}
                />
              </div>
            </div>
            <Form form={CuttingForm} layout="vertical">
              <div className="grid grid-cols-2 gap-2">
                <FormItem name="dateReceipt" label="Fecha de recibido">
                  <Input type="date" className="w-full" />
                </FormItem>
                <FormItem name="dueDate" label="Fecha de entrega">
                  <Input type="date" className="w-full" />
                </FormItem>
              </div>
            </Form>

            {isShirtForm ? (
              <div className="overflow-auto">
                <Form form={ShirtForm} layout="vertical" className="p-4">
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-4 rounded-md ">
                    <Form.Item name="discipline" label="Disciplina">
                      <Select>
                        {disciplines.map((discipline) => (
                          <Option key={discipline} value={discipline}>
                            {discipline}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="clothFrontShirtId"
                      label="Tela playera frente"
                    >
                      <Select
                        placeholder="Tela playera frente"
                        onChange={(value) =>
                          handleMaterialChange(
                            'frontClothColor',
                            value,
                            ShirtForm
                          )
                        }
                      >
                        {materials.map((material: any) => (
                          <Option key={material.id} value={material.id}>
                            {material.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="clothBackShirtId"
                      label="Tela playera espalda"
                    >
                      <Select placeholder="Tela playera espalda">
                        {materials.map((material: any) => (
                          <Option key={material.id} value={material.id}>
                            {material.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="frontClothColor" label="Color de tela">
                      <Input value={colors.frontClothColor} readOnly />
                    </Form.Item>
                    <Form.Item name="neckline" label="Forma cuello">
                      <Select>
                        {neckForms.map((neckForm) => (
                          <Option key={neckForm} value={neckForm}>
                            {neckForm}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="typeNeckline" label="Tipo cuello">
                      <Select>
                        {neckTypes.map((neckType) => (
                          <Option key={neckType} value={neckType}>
                            {neckType}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item name="clothNecklineId" label="Tela cuello">
                      <Select
                        placeholder="Tela cuello"
                        onChange={(value) =>
                          handleMaterialChange(
                            'neckClothColor',
                            value,
                            ShirtForm
                          )
                        }
                      >
                        {materials.map((material: any) => (
                          <Option key={material.id} value={material.id}>
                            {material.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="neckClothColor" label="Color de tela">
                      <Input value={colors.frontClothColor} readOnly />
                    </Form.Item>
                    <Form.Item name="sleeveShape" label="Forma de manga">
                      <Select>
                        {sleeveForms.map((sleeveForm) => (
                          <Option key={sleeveForm} value={sleeveForm}>
                            {sleeveForm}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="sleeveType" label="Tipo de manga">
                      <Select>
                        {sleeveTypes.map((sleeveType) => (
                          <Option key={sleeveType} value={sleeveType}>
                            {sleeveType}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="clothSleeveId" label=" Tela de manga">
                      <Select
                        placeholder="Tela de manga"
                        onChange={(value) =>
                          handleMaterialChange(
                            'sleeveClothColor',
                            value,
                            ShirtForm
                          )
                        }
                      >
                        {materials.map((material: any) => (
                          <Option key={material.id} value={material.id}>
                            {material.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="sleeveClothColor" label="Color de tela">
                      <Input value={colors.sleeveClothColor} readOnly />
                    </Form.Item>
                    <Form.Item name="cuff" label="Puño">
                      <Select>
                        {cuffs.map((cuff) => (
                          <Option key={cuff} value={cuff}>
                            {cuff}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="typeCuff" label="Tipo de puño">
                      <Select>
                        {cuffsTypes.map((cuffsType) => (
                          <Option key={cuffsType} value={cuffsType}>
                            {cuffsType}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="clothCuffId" label="Tela de puño">
                      <Select
                        placeholder="Tela de puño"
                        onChange={(value) =>
                          handleMaterialChange(
                            'cuffClothColor',
                            value,
                            ShirtForm
                          )
                        }
                      >
                        {materials.map((material: any) => (
                          <Option key={material.id} value={material.id}>
                            {material.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="cuffClothColor" label="Color de tela">
                      <Input value={colors.cuffClothColor} readOnly />
                    </Form.Item>
                    <Form.Item name="dtfShirt" label="DTF playera">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="tShirtSection"
                      label="Tramos playera"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor, seleccione una opción.'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Seleccionar"
                      >
                        <Option value={true}>Sí</Option>
                        <Option value={false}>No</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="priceUnit" label="Precio C/U">
                      <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item name="tax" label="Impuesto">
                      <InputNumber className="w-full" />
                    </Form.Item>
                    <div></div>
                    <div className="flex justify-end">
                      <Button
                        icon={<SaveOutlined className="text-blue-500" />}
                        onClick={() =>
                          handleFormSubmitShirt(
                            ShirtForm,
                            setShirts,
                            CuttingForm, 
                            setCuttingOrderDt,
                            shirts, 
                            CuttingOrderDt, 
                            productType
                          )
                        }
                        disabled={isSaveDisabled}
                      />
                    </div>
                  </div>
                  <Space>
                    <Table
                      columns={columnsTempShirt}
                      dataSource={shirts.map((shirt, index) => ({
                        ...shirt,
                        key: index
                      }))}
                    />
                  </Space>
                  <Button
                    type="primary"
                    onClick={() => handlecutSummitShirts()}
                  >
                    Mostrar contenido de Shirts
                  </Button>
                  <Modal
                    title={`Orden`}
                    open={isModalShirtsTempVisible}
                    onCancel={() => SetisModalShirtsTempVisible(false)}
                    footer={null}
                  >
                    {selectedShirt && (
                      <div>
                        <p>Disciplina: {selectedShirt.discipline}</p>
                        <p>
                          Tela playera frente: {selectedShirt.clothFrontShirtId}
                        </p>
                        <p>
                          Tela playera espalda: {selectedShirt.clothBackShirtId}
                        </p>
                        <p>Forma cuello: {selectedShirt.neckline}</p>
                        <p>Tipo cuello: {selectedShirt.typeNeckline}</p>
                        <p>Tela cuello: {selectedShirt.clothNecklineId}</p>
                        <p>Forma de manga: {selectedShirt.sleeveShape}</p>
                        <p>Tipo de manga: {selectedShirt.sleeveType}</p>
                        <p>Tela de manga: {selectedShirt.clothSleeveId}</p>
                        <p>Puño: {selectedShirt.cuff}</p>
                        <p>Tipo de puño: {selectedShirt.typeCuff}</p>
                        <p>Tela de puño: {selectedShirt.clothCuffId}</p>
                        <p>DTF playera: {selectedShirt.dtfShirt}</p>
                        <p>Tramos playera: {selectedShirt.tShirtSection}</p>
                      </div>
                    )}
                  </Modal>
                </Form>
              </div>
            ) : (
              <div className="overflow-auto">
                <Form
                  form={GoalkeeperShirtForm}
                  layout="vertical"
                  className="p-4"
                >
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-4 rounded-md">
                    <Form.Item label="Tipo de tela">
                      <Select>
                        {cloths.map((cloths) => (
                          <Option key={cloths} value={cloths}>
                            {cloths}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Color de tela">
                      <Input></Input>
                    </Form.Item>
                    <Form.Item label="Forma cuello">
                      <Select>
                        {neckForms.map((neckForm) => (
                          <Option key={neckForm} value={neckForm}>
                            {neckForm}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Forma de manga">
                      <Select>
                        {sleeveForms.map((sleeveForm) => (
                          <Option key={sleeveForm} value={sleeveForm}>
                            {sleeveForm}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Tipo de puño">
                      <Select>
                        {cuffsTypes.map((cuffsType) => (
                          <Option key={cuffsType} value={cuffsType}>
                            {cuffsType}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="DTF playera">
                      <Input />
                    </Form.Item>
                  </div>

                  <Table
                    className="mt-2"
                    dataSource={dataSourceShorts}
                    columns={columnsShort}
                    pagination={false}
                    footer={() => (
                      <Space className="flex justify-end">
                        <Button
                          onClick={handleAddRowClickShorts}
                          icon={<PlusOutlined className="text-cyan-500" />}
                        />
                        <Button
                          onClick={handleEmptyClickShorts}
                          icon={<ClearOutlined className="text-red-500" />}
                        />
                      </Space>
                    )}
                  />
                </Form>
              </div>
            )}
          </div>
        )}
        {isShortFormVisible && (
          <div>
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                <GiUnderwearShorts
                  className={`w-10 h-10 text-green-500 ${isShortForm ? 'block' : 'hidden'}`}
                />
                <GiGoalKeeper
                  className={`w-10 h-10 text-green-500 ${!isShortForm ? 'block' : 'hidden'}`}
                />
                <Switch
                  onChange={handleSwitchChangeShort}
                  checked={isShortForm}
                  className="w-14 h-7"
                  checkedChildren={<span className="invisible" />}
                  unCheckedChildren={<span className="invisible" />}
                />
              </div>
            </div>

            {isShortForm ? (
              <div className="overflow-auto">
                <Form form={ShortForm} layout="vertical" className="p-4">
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-4 rounded-md ">
                    <Form.Item label="Tela short">
                      <Select>
                        {disciplines.map((discipline) => (
                          <Option key={discipline} value={discipline}>
                            {discipline}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Color de tela">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Vista de short">
                      <Select>
                        {shortLooks.map((shortLook) => (
                          <Option key={shortLook} value={shortLook}>
                            {shortLook}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Tela de vista">
                      <Select>
                        {cloths.map((cloths) => (
                          <Option key={cloths} value={cloths}>
                            {cloths}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Color de tela">
                      <Input />
                    </Form.Item>
                    <Form.Item label="DTF short">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Tramos short">
                      <Select>
                        {sections.map((section) => (
                          <Option key={section} value={section}>
                            {section}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <Table
                    className="mt-2"
                    dataSource={dataSourceShorts}
                    columns={columnsShort}
                    pagination={false}
                    footer={() => (
                      <Space className="flex justify-end">
                        <Button
                          onClick={handleAddRowClickShorts}
                          icon={<PlusOutlined className="text-cyan-500" />}
                        />
                        <Button
                          onClick={handleEmptyClickShorts}
                          icon={<ClearOutlined className="text-red-500" />}
                        />
                      </Space>
                    )}
                  />
                </Form>
              </div>
            ) : (
              <div className="overflow-auto">
                <Form
                  form={GoalkeeperShortForm}
                  layout="vertical"
                  className="p-4"
                >
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-4 rounded-md">
                    {/* Formulario de Portero */}
                    <Form.Item label="Tela short">
                      <Select>
                        {disciplines.map((discipline) => (
                          <Option key={discipline} value={discipline}>
                            {discipline}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {/* ... otros elementos del formulario ... */}
                    <Form.Item label="Tramos short">
                      <Select>
                        {sections.map((section) => (
                          <Option key={section} value={section}>
                            {section}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <Table
                    className="mt-2"
                    dataSource={dataSourceShorts}
                    columns={columnsShort}
                    pagination={false}
                    footer={() => (
                      <Space className="flex justify-end">
                        <Button
                          onClick={handleAddRowClickShorts}
                          icon={<PlusOutlined className="text-cyan-500" />}
                        />
                        <Button
                          onClick={handleEmptyClickShorts}
                          icon={<ClearOutlined className="text-red-500" />}
                        />
                      </Space>
                    )}
                  />
                </Form>
              </div>
            )}
          </div>
        )}
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
            dataSource={filteredQuotationsWithKeys}
          />
        </div>
      </Card>
    </>
  )
}

export default CotationList
