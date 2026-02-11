import { useState, useEffect, useRef } from 'react'
import {
  Button,
  Space,
  Table,
  Card,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  Drawer,
  Switch,
  Upload,
  Popover,
  message,
  Steps,
  Divider
} from 'antd'
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
  SaveOutlined,
  UploadOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import {
  Quotation,
  Client,
  Material,
  FormDataShirt,
  FormDataShort,
  CuttingOrderData,
  QuotationProduct,
  QuotationProductMaquila
} from 'components/Scripts/Interfaces'
import {
  disciplines,
  cloths,
  neckForms,
  neckTypes,
  sleeveForms,
  sleeveTypes,
  cuffs,
  cuffsTypes,
  sizes,
  shortLooks,
  sections,
  genderMap
} from 'components/Scripts/Utils'
import { FaTshirt } from 'react-icons/fa'
import { GiUnderwearShorts, GiGoalKeeper } from 'react-icons/gi'
import {
  generatePDF,
  generatePDFMODAL,
  contentBlockAceptEdit
} from 'components/Scripts/Utils'
import { UploadChangeParam } from 'antd/lib/upload'
import { fetchMaterialName, checkCuttingOrderExists } from 'components/Scripts/Apicalls'
import { useNavigate } from 'react-router-dom'
import FormItem from 'antd/es/form/FormItem'
import TodayDate from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import * as CuttingUtils from 'components/Scripts/CuttingUtils'
import * as QuotationUtils from 'components/Scripts/QuotationUtils'

const { Search } = Input
const { confirm } = Modal
const { Option } = Select

const CotationList = () => {
  const userRole = Number(localStorage.getItem('userRole') || 0)
  const readOnly = userRole === 11

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
  const [dataSourceProducts, setDataSourceProducts] = useState<
    QuotationProduct[]
  >([])
  const [dataSourceProductsMaquila, setDataSourceProductsMaquila] = useState<
    QuotationProductMaquila[]
  >([])
  const [dataSourceShorts, setDataSourceShorts] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [taxPercentage, setTaxPercentage] = useState(0)
  const [Advance, setAdvance] = useState(0)
  const [taxLocked, setTaxLocked] = useState(false)
  const [saveLocked, setSaveLocked] = useState(false)
  const [netAmount] = useState(0)
  const [total] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [quotationProducts, setQuotationProducts] = useState<
    QuotationProduct[]
  >([])
  const [quotationProductsMaquila, setQuotationProductsMaquila] = useState<
    QuotationProductMaquila[]
  >([])
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
  const { colors, handleMaterialChange } =
    CuttingUtils.useFormHandler(materials)
  const { colorsShorts, handleMaterialChangeShorts } =
    CuttingUtils.useFormHandlerShort(materials)
  const [shirts, setShirts] = useState<FormDataShirt[]>([])
  const [shorts, setShorts] = useState<FormDataShort[]>([])
  const [CuttingOrderDt, setCuttingOrderDt] = useState<CuttingOrderData[]>([])
  const [isModalShirtsTempVisible, SetisModalShirtsTempVisible] =
    useState<boolean>(false)
  const [isModalShortsTempVisible, SetisModalShortsTempVisible] =
    useState<boolean>(false)
  const [selectedShirt, setSelectedShirt] = useState<FormDataShirt | null>(null)
  const [selectedShort, setSelectedShort] = useState<FormDataShort | null>(null)
  const isSaveDisabled = CuttingUtils.isSaveButtonDisabled(shirts)
  const [productType, setProductType] = useState<number | null>(null)
  const [productTypeShort, setProductTypeShort] = useState<number | null>(null)
  const [fileShirt, setFileShirt] = useState<File | null>(null)
  const [imageFileNameShirt, setImageFileNameShirt] = useState<string | null>(null)
  const [fileShort, setFileShort] = useState<File | null>(null)
  const [imageFileNameShort, setImageFileNameShort] = useState<string | null>(null)
  const [cuttingOrderStep, setCuttingOrderStep] = useState(0)
  const modalRef = useRef(null)

  useTokenRenewal(navigate)

  useEffect(() => {
    QuotationUtils.fetchAndSetQuotations(setQuotations)
    QuotationUtils.fetchAndSetClients(setClients)
    fetchMaterialName(setMaterials)
  }, [visibleAdd, visibleEdit])

  useEffect(() => {
    QuotationUtils.fetchAndSetQuotationProducts(
      selectedQuotation,
      setQuotationProducts
    )
    QuotationUtils.fetchAndSetQuotationProductsMaquila(
      selectedQuotation,
      setQuotationProductsMaquila
    )
  }, [selectedQuotation])

  const handleFileChangeShirt = (info: UploadChangeParam) => {
    const fileList = [...info.fileList]
    setFileShirt(fileList[0]?.originFileObj as File)
  }
  const handleFileChangeShort = (info: UploadChangeParam) => {
    const fileList = [...info.fileList]
    setFileShort(fileList[0]?.originFileObj as File)
  }

  const filteredQuotations = QuotationUtils.filterQuotations(
    Quotations,
    searchText
  )
  const filteredQuotationsWithKeys =
    QuotationUtils.addKeysToQuotations(filteredQuotations)

  const handleSelectChange = (value: any) => {
    setCurrentTable(value)
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
          onClick={() =>
            CuttingUtils.handleViewDetailsShirts(
              record,
              setSelectedShirt,
              SetisModalShirtsTempVisible
            )
          }
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
            CuttingUtils.handleInputNumberChangeShirts(
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
            CuttingUtils.calculateAndUpdateTotalShirts(
              shirts,
              setShirts,
              record.key,
              value
            )
          }
        />
      )
    },
    {
      title: 'Género',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: any, record: any) => {
        const genderText = genderMap[text] || '?'

        const buttonClass =
          genderText === 'H'
            ? 'bg-blue-500 text-white'
            : genderText === 'M'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-black border border-gray-300'

        return (
          <Button
            className={`w-10 ${buttonClass}`}
            onClick={() =>
              CuttingUtils.handleGenderToggleShirts(
                shirts,
                setShirts,
                record.key
              )
            }
          >
            {genderText}
          </Button>
        )
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
            CuttingUtils.handleInputChangeShirts(
              shirts,
              setShirts,
              e,
              record.key,
              'observation'
            )
          }
        />
      )
    },
    {
      title: 'Mas',
      key: 'actions',
      render: (_: any, record: FormDataShirt) => (
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              CuttingUtils.handleDuplicateOrderShirts(record, setShirts)
            }
          ></Button>
        </Space>
      )
    }
  ]
  const columnsTempShort = [
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
          onClick={() =>
            CuttingUtils.handleViewDetailsShorts(
              record,
              setSelectedShort,
              SetisModalShortsTempVisible
            )
          }
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
            CuttingUtils.handleInputNumberChangeShorts(
              shorts,
              setShorts,
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
            CuttingUtils.calculateAndUpdateTotalShorts(
              shorts,
              setShorts,
              record.key,
              value
            )
          }
        />
      )
    },
    {
      title: 'Género',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: any, record: any) => {
        const genderText = genderMap[text] || '?'

        const buttonClass =
          genderText === 'H'
            ? 'bg-blue-500 text-white'
            : genderText === 'M'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-black border border-gray-300'

        return (
          <Button
            className={`w-10 ${buttonClass}`}
            onClick={() =>
              CuttingUtils.handleGenderToggleShorts(
                shorts,
                setShorts,
                record.key
              )
            }
          >
            {genderText}
          </Button>
        )
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
            CuttingUtils.handleInputChangeShorts(
              shorts,
              setShorts,
              e,
              record.key,
              'observation'
            )
          }
        />
      )
    },
    {
      title: 'Mas',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              CuttingUtils.handleDuplicateOrderShorts(record, setShorts)
            }
          ></Button>
        </Space>
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
            QuotationUtils.handleFieldChange(
              e.target.value,
              record.key,
              'description',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'amount',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'quantity',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'tax',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            onClick={() =>
              QuotationUtils.handleDeleteProductsClick(
                record,
                quotationProductsMaquila,
                setQuotationProductsMaquila,
                quotationProducts,
                setQuotationProducts
              )
            }
          />
        </Space>
      )
    }
  ]

  const columnsEditQuotation = [
    {
      title: 'Descripcion',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (
        <Input
          value={text}
          onChange={(e) =>
            QuotationUtils.handleFieldChange(
              e.target.value,
              record.key,
              'description',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'amount',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'quantity',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            QuotationUtils.handleFieldChange(
              value,
              record.key,
              'tax',
              dataSourceProducts,
              setDataSourceProducts,
              setSaveLocked
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
            onClick={() =>
              QuotationUtils.handleDeleteProductEdit(
                record,
                dataSourceProducts,
                setDataSourceProducts,
                dataSourceProductsMaquila,
                setDataSourceProductsMaquila
              )
            }
          />
        </Space>
      )
    }
  ]

  const columnsEditQuotationMaquila = [
    {
      title: 'Descripcion',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (
        <Input
          value={text}
          onChange={(e) =>
            QuotationUtils.handleFieldChangeMaquila(
              e.target.value,
              record.key,
              'description',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
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
            QuotationUtils.handleFieldChangeMaquila(
              value,
              record.key,
              'meters_impression',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
            )
          }
        />
      )
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'price_unit',
      key: 'price_unit',
      render: (text: any) => (
        <span>{`$${!isNaN(parseFloat(text)) ? parseFloat(text).toFixed(2) : '0.00'}`}</span>
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
            QuotationUtils.handleFieldChangeMaquila(
              value,
              record.key,
              'quantity',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
            )
          }
        />
      )
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any) => (
        <span>{`$${!isNaN(parseFloat(text)) ? parseFloat(text).toFixed(2) : '0.00'}`}</span>
      )
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              QuotationUtils.handleDeleteProductEdit(
                record,
                dataSourceProducts,
                setDataSourceProducts,
                dataSourceProductsMaquila,
                setDataSourceProductsMaquila
              )
            }
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
            QuotationUtils.handleFieldChangeMaquila(
              e.target.value,
              record.key,
              'description',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
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
            QuotationUtils.handleFieldChangeMaquila(
              value,
              record.key,
              'meters_impression',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
            )
          }
        />
      )
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'price_unit',
      key: 'price_unit',
      render: (text: any) => (
        <span>{`$${!isNaN(parseFloat(text)) ? parseFloat(text).toFixed(2) : '0.00'}`}</span>
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
            QuotationUtils.handleFieldChangeMaquila(
              value,
              record.key,
              'quantity',
              dataSourceProductsMaquila,
              setDataSourceProductsMaquila,
              setSaveLocked
            )
          }
        />
      )
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any) => (
        <span>{`$${!isNaN(parseFloat(text)) ? parseFloat(text).toFixed(2) : '0.00'}`}</span>
      )
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              QuotationUtils.handleDeleteProductsClick(
                record,
                quotationProductsMaquila,
                setQuotationProductsMaquila,
                quotationProducts,
                setQuotationProducts
              )
            }
          />
        </Space>
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
        new Date(dateReceipt.split('T')[0] + 'T00:00:00').toLocaleDateString()
    },
    {
      title: 'Fecha de Expiracion',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      className: 'hidden lg:table-cell',
      render: (expirationDate: string) =>
        new Date(expirationDate.split('T')[0] + 'T00:00:00').toLocaleDateString()
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
      render: (record: Quotation) => (
        <Space className="md:flex-wrap md:items-center" size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() =>
              QuotationUtils.handleViewClick(
                record.id.toString(),
                setSelectedQuotation,
                setVisible
              )
            }
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() =>
              QuotationUtils.handleEditClick(
                record,
                setEditingQuotation,
                EditForm,
                setVisibleEdit,
                setDataSourceProducts,
                setDataSourceProductsMaquila
              )
            }
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              QuotationUtils.handleDeleteClick(
                record,
                Quotations,
                setQuotations
              )
            }
          />
          <Button
            icon={<ScissorOutlined className="text-gray-700" />}
            onClick={async () => {
              // Verificar si ya existe una orden de corte para esta cotización
              const existingOrder = await checkCuttingOrderExists(record.id)
              if (existingOrder.exists) {
                message.warning(`Ya existe una orden de corte para la cotización #${record.id}. Si desea modificarla, use la opción de editar en la sección de órdenes de corte.`)
                return
              }
              setSelectedQuotation(record)
              setVisibleCut(true)
            }}
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
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="pdf"
            icon={<FilePdfOutlined className="text-red-500" />}
            onClick={() => generatePDFMODAL(selectedQuotation, modalRef, quotationProducts, quotationProductsMaquila)}
          ></Button>
        ]}
      >
        {selectedQuotation && (
          <div ref={modalRef}>
            <div className="mt-5 flex justify-between">
              <img src={Logo} alt="Ink Sports" className="h-10 " />
              <span className="text-end">
                {' '}
                Ciudad victoria, Tamaulipas a<TodayDate></TodayDate>{' '}
              </span>
            </div>
            <span className="mb-5 mt-5 text-center text-xl">
              {' '}
              Cotización Folio: {selectedQuotation?.id}
            </span>
            <div className="flex flex-row  gap-10 mb-5">
              <div className="text-sm">
                <p>
                  <strong>Fecha de recibido:</strong>{' '}
                  {new Date(selectedQuotation.dateReceipt.split('T')[0] + 'T00:00:00').toLocaleDateString(
                    'es-ES'
                  )}
                </p>
                <p>
                  <strong>Fecha de expiracion:</strong>{' '}
                  {new Date(selectedQuotation.expirationDate.split('T')[0] + 'T00:00:00').toLocaleDateString(
                    'es-ES'
                  )}
                </p>
                <p>
                  <strong>Cliente:</strong> {`${ selectedQuotation.client.name } ${ selectedQuotation.client.surname} - ${ selectedQuotation.client.organization }`}
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
                    key: 'description',
                    render: (text: string) => text || '-'
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
                    key: 'description',
                    render: (text: string) => text || '-'
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
              <span> 1 Y 2 Hidalgo, Zona Centro Cd. Victoria, Tamaulipas </span>
              <span>Tel: (834)-312-16-58 Whatsapp: 8341330078</span>
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
        onClose={() =>
          QuotationUtils.handleCloseEdit(
            EditForm,
            setDataSourceProducts,
            setDataSourceProductsMaquila,
            setVisibleEdit,
            setTaxLocked,
            setSaveLocked
          )
        }
        size="large"
        className="modal"
        extra={
          <Space>
            <Popover
              content={contentBlockAceptEdit}
              title="¿Por que hay elementos bloqueados?"
            >
              <QuestionCircleOutlined />
            </Popover>

            <Button
              onClick={() =>
                QuotationUtils.handleSaveClick(
                  EditForm,
                  editingQuotation,
                  Quotations,
                  setQuotations,
                  setVisibleEdit,
                  setTaxLocked,
                  dataSourceProducts,
                  dataSourceProductsMaquila,
                  setDataSourceProductsMaquila,
                  setDataSourceProducts
                )
              }
              type="primary"
              disabled={saveLocked}
            >
              Aceptar
            </Button>
          </Space>
        }
      >
        <div className="overflow-auto">
          {dataSourceProducts.length > 0 && (
            <Table
              columns={columnsEditQuotation}
              dataSource={dataSourceProducts}
              pagination={false}
              footer={() => (
                <Space className="flex justify-end">
                  <Button
                    onClick={() =>
                      QuotationUtils.handleAddRowProducts(
                        count,
                        setCount,
                        setDataSourceProducts,
                        dataSourceProducts
                      )
                    }
                    icon={<PlusOutlined className="text-cyan-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleFinishEdit(
                        EditForm,
                        dataSourceProducts,
                        setSaveLocked
                      )
                    }
                    icon={<SendOutlined className="text-green-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleEmpty(
                        setDataSourceProductsMaquila,
                        setDataSourceProducts,
                        setTaxLocked,
                        setSaveLocked,
                        EditForm
                      )
                    }
                    icon={<ClearOutlined className="text-red-500" />}
                  />
                </Space>
              )}
            />
          )}
          {dataSourceProductsMaquila.length > 0 && (
            <Table
              columns={columnsEditQuotationMaquila}
              dataSource={dataSourceProductsMaquila}
              pagination={false}
              footer={() => (
                <Space className="flex justify-end">
                  <Button
                    onClick={() =>
                      QuotationUtils.handleAddRowMaquila(
                        count,
                        setCount,
                        setDataSourceProductsMaquila,
                        dataSourceProductsMaquila
                      )
                    }
                    icon={<PlusOutlined className="text-cyan-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleFinishMaquilaEdit(
                        EditForm,
                        dataSourceProductsMaquila,
                        setSaveLocked
                      )
                    }
                    icon={<SendOutlined className="text-green-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleEmpty(
                        setDataSourceProductsMaquila,
                        setDataSourceProducts,
                        setTaxLocked,
                        setSaveLocked,
                        EditForm
                      )
                    }
                    icon={<ClearOutlined className="text-red-500" />}
                  />
                </Space>
              )}
            />
          )}

          <Form form={EditForm} layout="vertical" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione una fecha de recibido.'
                    }
                  ]}
                  name="dateReceipt"
                  label="Fecha de recibido"
                >
                  <Input type="date" className="w-full" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione una fecha de entrega.'
                    }
                  ]}
                  name="expirationDate"
                  label="Fecha de expiración"
                >
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
                          QuotationUtils.calculateTaxAndNetAmountEdit(EditForm)
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
                        QuotationUtils.handleAdvanceChange(
                          value,
                          setAdvance,
                          EditForm,
                          setTaxLocked,
                          QuotationUtils.calculateTotal
                        )
                        setAdvance(value)
                        const newTotal = QuotationUtils.calculateTotal(EditForm)
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

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione un cliente.'
                    }
                  ]}
                  name="clientId"
                  label="Cliente"
                >
                  <Select placeholder="Selecciona un cliente">
                    {clients.map((client: any) => (
                      <Option key={client.id} value={client.id}>
                        {client.name} {client.surname} - {client.phone}
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
        onClose={() =>
          QuotationUtils.handleAddCancel(
            setDataSourceProducts,
            setDataSourceProductsMaquila,
            setVisibleAdd,
            addForm,
            setTaxLocked
          )
        }
        size="large"
        className="modal"
        extra={
          <Space>
            <Button
              onClick={() =>
                QuotationUtils.handleAddSaveClick(
                  addForm,
                  setVisibleAdd,
                  setQuotations,
                  dataSourceProducts,
                  dataSourceProductsMaquila,
                  setDataSourceProductsMaquila,
                  setDataSourceProducts
                )
              }
              type="primary"
            >
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
              dataSource={dataSourceProducts}
              pagination={false}
              footer={() => (
                <Space className="flex justify-end">
                  <Button
                    onClick={() =>
                      QuotationUtils.handleAddRowProducts(
                        count,
                        setCount,
                        setDataSourceProducts,
                        dataSourceProducts
                      )
                    }
                    icon={<PlusOutlined className="text-cyan-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleFinish(addForm, dataSourceProducts)
                    }
                    icon={<SendOutlined className="text-green-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleEmpty(
                        setDataSourceProductsMaquila,
                        setDataSourceProducts,
                        setTaxLocked,
                        setSaveLocked,
                        EditForm
                      )
                    }
                    icon={<ClearOutlined className="text-red-500" />}
                  />
                </Space>
              )}
            />
          )}

          {currentTable === 'cotizacion_maquila' && (
            <Table
              columns={columnsAddQuotationMaquila}
              dataSource={dataSourceProductsMaquila}
              pagination={false}
              footer={() => (
                <Space className="flex justify-end">
                  <Button
                    onClick={() =>
                      QuotationUtils.handleAddRowMaquila(
                        count,
                        setCount,
                        setDataSourceProductsMaquila,
                        dataSourceProductsMaquila
                      )
                    }
                    icon={<PlusOutlined className="text-cyan-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleFinishMaquila(
                        addForm,
                        dataSourceProductsMaquila
                      )
                    }
                    icon={<SendOutlined className="text-green-500" />}
                  />
                  <Button
                    onClick={() =>
                      QuotationUtils.handleEmpty(
                        setDataSourceProductsMaquila,
                        setDataSourceProducts,
                        setTaxLocked,
                        setSaveLocked,
                        EditForm
                      )
                    }
                    icon={<ClearOutlined className="text-red-500" />}
                  />
                </Space>
              )}
            />
          )}
          <Form form={addForm} layout="vertical" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione una fecha de recibido.'
                    }
                  ]}
                  name="dateReceipt"
                  label="Fecha de recibido"
                >
                  <Input type="date" className="w-full" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione una fecha de recibido.'
                    }
                  ]}
                  name="expirationDate"
                  label="Fecha de expiración"
                >
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
                        const newNetAmount =
                          QuotationUtils.calculateTaxAndNetAmount(addForm)
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
                        QuotationUtils.handleAdvanceChange(
                          value,
                          setAdvance,
                          addForm,
                          setTaxLocked,
                          QuotationUtils.calculateTotal
                        )
                        setAdvance(value)
                        const newTotal = QuotationUtils.calculateTotal(addForm)
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

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, seleccione un cliente.'
                    }
                  ]}
                  name="clientId"
                  label="Cliente"
                >
                  <Select placeholder="Selecciona un cliente">
                    {clients.map((client: any) => (
                      <Option key={client.id} value={client.id}>
                        {client.name} {client.surname} - {client.phone}
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
        onClose={() => {
          setVisibleCut(false)
          setCuttingOrderStep(0)
          setShirts([])
          setShorts([])
          setFileShirt(null)
          setImageFileNameShirt(null)
          setFileShort(null)
          setImageFileNameShort(null)
          ShirtForm.resetFields()
          ShortForm.resetFields()
          CuttingForm.resetFields()
          setIsShirtFormVisible(false)
          setIsShortFormVisible(false)
        }}
        size="large"
        title={<span className="text-lg font-semibold">Orden de corte</span>}
      >
        <Steps
          current={cuttingOrderStep}
          size="small"
          className="mb-6"
          items={[
            { title: 'Tipo y fechas' },
            { title: 'Especificaciones' },
            { title: 'Lista e imagen' }
          ]}
        />

        {/* Paso 1: Tipo y fechas */}
        {cuttingOrderStep === 0 && (
          <>
            <Form form={CuttingForm} layout="vertical">
              <div className="grid grid-cols-2 gap-4">
                <FormItem
                  name="dateReceipt"
                  label="* Fecha de recibido"
                  rules={[{ required: true, message: 'Seleccione la fecha' }]}
                >
                  <Input type="date" className="w-full" />
                </FormItem>
                <FormItem
                  name="dueDate"
                  label="* Fecha de entrega"
                  rules={[{ required: true, message: 'Seleccione la fecha' }]}
                >
                  <Input type="date" className="w-full" />
                </FormItem>
              </div>
            </Form>
            <p className="text-gray-500 text-sm mt-2 mb-2">
              Elija uno o ambos tipos de prenda (en el siguiente paso se abrirán los formularios correspondientes):
            </p>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() =>
                  QuotationUtils.toggleShirtForm(
                    isShirtFormVisible,
                    setIsShirtFormVisible,
                    setProductType
                  )
                }
                className="flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-110"
              >
                <FaTshirt
                  className={`w-10 h-10 ${isShirtFormVisible ? 'text-green-500' : 'text-gray-400'}`}
                />
                <span className="text-sm">Playera</span>
                {isShirtFormVisible ? (
                  <EyeOutlined className="text-green-500" />
                ) : (
                  <EyeInvisibleOutlined className="text-gray-400" />
                )}
              </Button>
              <Button
                onClick={() =>
                  QuotationUtils.toggleShortForm(
                    isShortFormVisible,
                    setIsShortFormVisible,
                    setProductTypeShort
                  )
                }
                className="flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-110"
              >
                <GiUnderwearShorts
                  className={`w-10 h-10 ${isShortFormVisible ? 'text-green-500' : 'text-gray-400'}`}
                />
                <span className="text-sm">Short</span>
                {isShortFormVisible ? (
                  <EyeOutlined className="text-green-500" />
                ) : (
                  <EyeInvisibleOutlined className="text-gray-400" />
                )}
              </Button>
            </div>
            <Button
              type="primary"
              onClick={async () => {
                if (!isShirtFormVisible && !isShortFormVisible) {
                  message.warning('Seleccione al menos un tipo de prenda (playera o short).')
                  return
                }
                
                // Capturar y guardar los valores del CuttingForm antes de avanzar
                try {
                  const cuttingFormValues = await CuttingForm.validateFields()
                  const formDataCut: CuttingOrderData = {
                    id: 0, // Temporal, se asignará cuando se cree
                    quotationId: selectedQuotation?.id || 0,
                    dateReceipt: cuttingFormValues.dateReceipt,
                    dueDate: cuttingFormValues.dueDate,
                    quotation: selectedQuotation as any
                  }
                  
                  // Guardar en el estado
                  setCuttingOrderDt([formDataCut])
                setCuttingOrderStep(1)
                } catch (error) {
                  console.error('Error al validar CuttingForm:', error)
                  message.error('Por favor complete los campos de fecha correctamente')
                }
              }}
            >
              Siguiente: Especificaciones
            </Button>
          </>
        )}
        {/* Paso 2: Especificaciones (formulario(s) + añadir a lista) */}
        {cuttingOrderStep === 1 && (isShirtFormVisible || isShortFormVisible) && (
          <div className="space-y-6">
        {isShirtFormVisible && (
          <div>
            <div className="flex justify-center mb-4">
              <FaTshirt className="w-10 h-10 text-green-500" />
            </div>
            {isShirtForm ? (
              <div className="overflow-auto">
                <Form form={ShirtForm} layout="vertical" className="p-4">
                  <Divider orientation="left" plain>General</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
                    <Form.Item
                      name="discipline"
                      label="* Disciplina"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor, seleccione una disciplina'
                        }
                      ]}
                    >
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
                  </div>
                  <Divider orientation="left" plain>Cuello</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
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
                  </div>
                  <Divider orientation="left" plain>Manga</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
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
                  </div>
                  <Divider orientation="left" plain>DTF y tramos</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
                    <Form.Item name="dtfShirt" label="DTF playera">
                      <Input />
                    </Form.Item>
                    <Form.Item name="tShirtSection" label="Tramos playera">
                      <Select placeholder="Seleccionar">
                        <Option value={true}>Sí</Option>
                        <Option value={false}>No</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="flex justify-end mb-4">
                    <Button
                      icon={<SaveOutlined className="text-blue-500" />}
                      onClick={() =>
                        CuttingUtils.handleFormSubmitShirt(
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
                    >
                      Añadir a la lista
                    </Button>
                  </div>
                  <Space className="w-full">
                    {shirts.length > 0 && (
                      <Table
                        className="w-full"
                        size="small"
                        columns={columnsTempShirt}
                        dataSource={shirts.map((shirt, index) => ({
                          ...shirt,
                          key: index
                        }))}
                        pagination={{ pageSize: 5 }}
                      />
                    )}
                  </Space>
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
            ) : null}
          </div>
        )}
        {isShortFormVisible && (
          <div>
            <div className="flex justify-center mb-4">
              <GiUnderwearShorts className="w-10 h-10 text-green-500" />
            </div>

            {isShortForm ? (
              <div className="overflow-auto">
                <Form form={ShortForm} layout="vertical" className="p-4">
                  <Divider orientation="left" plain>General</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
                    <Form.Item
                      name="discipline"
                      label="* Disciplina"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor, seleccione una disciplina'
                        }
                      ]}
                    >
                      <Select>
                        {disciplines.map((discipline) => (
                          <Option key={discipline} value={discipline}>
                            {discipline}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="clothShortId" label="Tela Short">
                      <Select
                        placeholder="Tela Short"
                        onChange={(value) =>
                          handleMaterialChangeShorts(
                            'clothShortColor',
                            value,
                            ShortForm
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
                    <Form.Item name="clothShortColor" label="Color de tela">
                      <Input value={colorsShorts.clothShortColor} readOnly />
                    </Form.Item>
                  </div>
                  <Divider orientation="left" plain>Vista y tramos</Divider>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-md mb-4">
                    <Form.Item label="Vista de short">
                      <Select>
                        {shortLooks.map((shortLook) => (
                          <Option key={shortLook} value={shortLook}>
                            {shortLook}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="clothViewId" label="Tela de vista short">
                      <Select
                        placeholder="Tela Short"
                        onChange={(value) =>
                          handleMaterialChangeShorts(
                            'clothViewColor',
                            value,
                            ShortForm
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
                    <Form.Item name="clothViewColor" label="Color de tela">
                      <Input value={colorsShorts.clothViewColor} readOnly />
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
                  <div className="flex justify-end mb-4">
                    <Button
                      icon={<SaveOutlined className="text-blue-500" />}
                      onClick={() =>
                        CuttingUtils.handleFormSubmitShort(
                          ShortForm,
                          setShorts,
                          CuttingForm,
                          setCuttingOrderDt,
                          shorts,
                          CuttingOrderDt
                        )
                      }
                      disabled={isSaveDisabled}
                    >
                      Añadir a la lista
                    </Button>
                  </div>
                  <Space className="w-full">
                    {shorts.length > 0 && (
                      <Table
                        className="w-full"
                        size="small"
                        columns={columnsTempShort}
                        dataSource={shorts.map((short, index) => ({
                          ...short,
                          key: index
                        }))}
                        pagination={{ pageSize: 5 }}
                      />
                    )}
                  </Space>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setCuttingOrderStep(0)}>Atrás</Button>
                    {shorts.length > 0 && (
                      <Button type="primary" onClick={() => setCuttingOrderStep(2)}>
                        Siguiente: Lista e imagen
                      </Button>
                    )}
                  </div>
                  <Modal
                    title={`Orden`}
                    open={isModalShortsTempVisible}
                    onCancel={() => SetisModalShortsTempVisible(false)}
                    footer={null}
                  >
                    {selectedShort && (
                      <div>
                        <p>Disciplina: {selectedShort.discipline}</p>
                        <p>Disciplina: {selectedShort.clothShortId}</p>
                        <p>Disciplina: {selectedShort.clothViewId}</p>
                        <p>Disciplina: {selectedShort.viewShort}</p>
                        <p>Disciplina: {selectedShort.dtfShort}</p>
                        <p>Disciplina: {selectedShort.shortSection}</p>
                      </div>
                    )}
                  </Modal>
                </Form>
              </div>
            ) : null}
          </div>
        )}
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button onClick={() => setCuttingOrderStep(0)}>Atrás</Button>
              <Button
                type="primary"
                onClick={() => setCuttingOrderStep(2)}
                disabled={
                  (isShirtFormVisible && shirts.length === 0) ||
                  (isShortFormVisible && shorts.length === 0)
                }
              >
                Siguiente: Lista e imagen
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Lista, imagen opcional y envío */}
        {cuttingOrderStep === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Revise la lista. Opcionalmente suba la imagen del diseño y envíe la orden.
            </p>
            {isShirtFormVisible && shirts.length > 0 && (
              <Table
                size="small"
                columns={columnsTempShirt}
                dataSource={shirts.map((shirt, index) => ({ ...shirt, key: index }))}
                pagination={{ pageSize: 5 }}
              />
            )}
            {isShortFormVisible && shorts.length > 0 && (
              <Table
                size="small"
                columns={columnsTempShort}
                dataSource={shorts.map((short, index) => ({ ...short, key: index }))}
                pagination={{ pageSize: 5 }}
              />
            )}
            <Divider />
            {isShirtFormVisible && shirts.length > 0 && (
              <Form.Item
                label="Imagen playera (opcional)"
                help="Imagen del diseño para la orden de playeras."
              >
                <Upload
                  name="imageShirt"
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleFileChangeShirt}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Subir imagen playera</Button>
                </Upload>
              </Form.Item>
            )}
            {isShortFormVisible && shorts.length > 0 && (
              <Form.Item
                label="Imagen short (opcional)"
                help="Imagen del diseño para la orden de shorts."
              >
                <Upload
                  name="imageShort"
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleFileChangeShort}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Subir imagen short</Button>
                </Upload>
              </Form.Item>
            )}
            <Button
              type="primary"
              size="large"
              className="mt-2"
              onClick={async () => {
                let imageShirt: string | null = imageFileNameShirt
                let imageShort: string | null = imageFileNameShort
                if (fileShirt && isShirtFormVisible && shirts.length > 0) {
                  try {
                    imageShirt = await CuttingUtils.uploadImageShirt(fileShirt)
                    setImageFileNameShirt(imageShirt)
                    message.success('Imagen playera subida')
                  } catch (e) {
                    message.error('Error al subir la imagen de playera')
                    return
                  }
                }
                if (fileShort && isShortFormVisible && shorts.length > 0) {
                  try {
                    imageShort = await CuttingUtils.uploadImageShort(fileShort)
                    setImageFileNameShort(imageShort)
                    message.success('Imagen short subida')
                  } catch (e) {
                    message.error('Error al subir la imagen de short')
                    return
                  }
                }
                if (isShirtFormVisible && shirts.length > 0) {
                  await CuttingUtils.handleCutSubmitShirts(
                    selectedQuotation,
                    shirts,
                    CuttingOrderDt,
                    imageShirt,
                    CuttingForm
                  )
                }
                if (isShortFormVisible && shorts.length > 0) {
                  await CuttingUtils.handleCutSubmitShorts(
                    selectedQuotation,
                    shorts,
                    CuttingOrderDt,
                    imageShort,
                    CuttingForm
                  )
                }
                setVisibleCut(false)
                setCuttingOrderStep(0)
                setShirts([])
                setShorts([])
                setFileShirt(null)
                setImageFileNameShirt(null)
                setFileShort(null)
                setImageFileNameShort(null)
              }}
            >
              Enviar formulario
            </Button>
            <Button className="ml-2" onClick={() => setCuttingOrderStep(1)}>
              Atrás
            </Button>
          </div>
        )}
      </Drawer>

      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
          <h4 className="font-bold text-lg">Finanzas</h4>
          <h6 className="text-sm">Lista de Cotizaciones{readOnly ? ' (solo lectura)' : ''}</h6>
        </div>
        {!readOnly && (
          <Button
            className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
            onClick={() => setVisibleAdd(true)}
          >
            <div>
              <PlusOutlined className="text-white font-bold" /> Añadir Nueva
              Cotizacion{' '}
            </div>
          </Button>
        )}
      </div>

      <Card>
        <Space className="flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <Search
              placeholder="Busqueda..."
              className="w-44"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={() => generatePDF(filteredQuotationsWithKeys)} />
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
            dataSource={filteredQuotationsWithKeys}
            tableLayout="fixed"
          />
        </div>
      </Card>
    </>
  )
}

export default CotationList
