import { useState, useEffect } from 'react'
import {
  Button,
  Space,
  Table,
  Card,
  Input,
  InputNumber,
  Modal,
  Form,
  Select,
  Drawer,
  Upload
} from 'antd'
import * as MaterialUtils from 'components/Scripts/MaterialUtils'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  RiseOutlined,
  UploadOutlined
} from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import {
  Material,
  Category,
  Supplier,
  SupplierAdd,
  MaterialRends
} from 'components/Scripts/Interfaces'
import { generatePDFTable } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import { UploadChangeParam } from 'antd/lib/upload'
import Missing from 'assets/img/noUserPhoto.jpg'

const { Search } = Input

const MaterialList = () => {
  const [Materials, setMaterials] = useState<Material[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [VisibleMaterialSize, setVisibleMaterialSize] = useState<boolean>(false)
  const [VisibleMaterialRen, setVisibleMaterialRen] = useState<boolean>(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  )
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [Suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isAddSupplierModalVisible, setIsAddSupplierModalVisible] =
    useState(false)
  const [newSupplier, setNewSupplier] = useState<SupplierAdd>({
    name: '',
    email: '',
    phone: ''
  })
  const [userName, setUserName] = useState<string>('')
  const navigate = useNavigate()
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [MaterialSizeform] = Form.useForm()
  const filteredMaterials = MaterialUtils.filterMaterials(Materials, searchText)
  const filteredMaterialsWithKeys =
    MaterialUtils.addKeysToMaterials(filteredMaterials)
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [materialRends, setMaterialRends] = useState<MaterialRends[] | null>(
    null
  )
  const [usedSizes, setUsedSizes] = useState<string[]>([])
  const [editingRend, setEditingRend] = useState<MaterialRends | null>(null)
  const [visibleEditRend, setVisibleEditRend] = useState<boolean>(false)
  const [editRendForm] = Form.useForm()

  const { Option } = Select

  useTokenRenewal(navigate)

  useEffect(() => {
    MaterialUtils.fetchAndSetData(
      setMaterials,
      setCategories,
      setSuppliers,
      setUserName
    )
  }, [visibleAdd])

  const handleAddSupplier = () => setIsAddSupplierModalVisible(true)
  const handleAddCategory = () => setIsAddCategoryModalVisible(true)

  const handleFileChange = (info: UploadChangeParam) => {
    const fileList = [...info.fileList]
    setFile(fileList[0]?.originFileObj as File)
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length
    },
    {
      title: 'Descripcion',
      dataIndex: 'description',
      key: 'description',
      sorter: (a: any, b: any) => a.surname.length - b.surname.length
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      sorter: (a: any, b: any) => a.surname.length - b.surname.length
    },
    {
      title: 'Cantidad',
      dataIndex: 'stock',
      key: 'stock',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.address.length - b.address.length
    },
    {
      title: 'Provedor',
      dataIndex: 'supplierName',
      key: 'supplierId',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Categoria',
      dataIndex: 'categoryName',
      key: 'categoryId',
      className: 'hidden lg:table-cell'
    },
    {
      title: 'Agrego',
      dataIndex: 'userName',
      key: 'userName',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Unidad',
      dataIndex: 'unitMeasure',
      key: 'unitMeasure',
      className: 'hidden lg:table-cell'
    },
    {
      title: 'Fecha de recibido',
      dataIndex: 'dateReceipt',
      key: 'dateReceipt',
      className: 'hidden lg:table-cell',
      render: (dateReceipt: string) =>
        new Date(dateReceipt).toLocaleDateString()
    },
    {
      title: 'Serie',
      dataIndex: 'serial',
      key: 'serial',
      className: 'hidden lg:table-cell'
    },
    {
      title: 'Ubicacion',
      dataIndex: 'location',
      key: 'location',
      className: 'hidden lg:table-cell'
    },
    {
      title: 'Accion',
      key: 'action',
      className: 'action-column',
      render: (record: Material) => (
        <Space className="flex flex-col md:grid md:grid-cols-2" size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() =>
              MaterialUtils.handleView(
                record.id.toString(),
                setSelectedMaterial,
                setVisible,
                setImage
              )
            }
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() =>
              MaterialUtils.handleEdit(
                record,
                setEditingMaterial,
                EditForm,
                setVisibleEdit
              )
            }
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              MaterialUtils.handleDelete(record, Materials, setMaterials)
            }
          />
          {record.unitMeasure !== 'U' && (
            <Button
              icon={<RiseOutlined className="text-yellow-700" />}
              onClick={() =>
                MaterialUtils.openMaterialRends(
                  record,
                  setVisibleMaterialRen,
                  setMaterialRends,
                  setSelectedMaterial,
                  setUsedSizes
                )
              }
            />
          )}
        </Space>
      )
    }
  ]

  const columnsRen = [
    {
      title: 'Talla',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      sorter: (a: MaterialRends, b: MaterialRends) => String(a.size).localeCompare(String(b.size))
    },
    {
      title: 'Consumo',
      dataIndex: 'consumption',
      key: 'consumption',
      width: 120,
      align: 'right' as const,
      sorter: (a: MaterialRends, b: MaterialRends) => Number(a.consumption) - Number(b.consumption)
    },
    {
      title: 'Rendimiento',
      dataIndex: 'performance',
      key: 'performance',
      width: 120,
      align: 'right' as const,
      sorter: (a: MaterialRends, b: MaterialRends) => Number(a.performance) - Number(b.performance)
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: MaterialRends) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined className="text-blue-600" />}
            onClick={() =>
              MaterialUtils.handleEditRend(
                record,
                setEditingRend,
                editRendForm,
                setVisibleEditRend
              )
            }
          >
            Editar
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              MaterialUtils.handleDeleteRend(
                record,
                materialRends,
                setMaterialRends,
                selectedMaterial,
                setUsedSizes
              )
            }
          >
            Eliminar
          </Button>
        </Space>
      )
    }
  ]

  return (
    <>
      <Modal
        title="Detalles del Material"
        open={visible}
        onCancel={() => MaterialUtils.handleClose(setVisible, setImage)}
        footer={[]}
      >
        {selectedMaterial && (
          <>
            <div className="flex justify-center">
              {image ? (
                <img className="w-44 h-44" src={image} alt="Foto" />
              ) : (
                <img className="w-44 h-44" src={Missing} alt="Sin foto" />
              )}
            </div>
            <p>
              <strong>Nombre:</strong> {selectedMaterial.name}
            </p>
            <p>
              <strong>Descripcion:</strong> {selectedMaterial.description}
            </p>
            <p>
              <strong>Cantidad:</strong> {selectedMaterial.stock}
            </p>
            <p>
              <strong>Provedor:</strong>{' '}
              {MaterialUtils.getSupplierName(
                selectedMaterial.supplierId,
                Suppliers
              )}
            </p>
            <p>
              <strong>Categoría:</strong>{' '}
              {MaterialUtils.getCategoryName(
                selectedMaterial.categoryId,
                categories
              )}
            </p>
            <p>
              <strong>Usuario:</strong> {selectedMaterial.userId}
            </p>
            <p>
              <strong>Unidad:</strong> {selectedMaterial.unitMeasure}
            </p>
            <p>
              <strong>Recibido:</strong>{' '}
              {selectedMaterial.dateReceipt
                ? new Date(selectedMaterial.dateReceipt).toLocaleDateString(
                    'es-ES'
                  )
                : 'No disponible'}
            </p>
            <p>
              <strong>Serial:</strong> {selectedMaterial.serial}
            </p>
            <p>
              <strong>Ubicacion:</strong> {selectedMaterial.location}
            </p>
          </>
        )}
      </Modal>

      <Modal
        title="Agregar rendimiento por talla"
        open={VisibleMaterialSize}
        onOk={() =>
          MaterialUtils.handleSaveMatSize(
            MaterialSizeform,
            selectedMaterial,
            setVisibleMaterialSize,
            materialRends,
            setMaterialRends,
            setUsedSizes
          )
        }
        onCancel={() =>
          MaterialUtils.handleCloseMaterialSize(
            MaterialSizeform,
            setVisibleMaterialSize
          )
        }
        okText="Guardar"
        cancelText="Cancelar"
        width={420}
      >
        <Form form={MaterialSizeform} layout="vertical" className="pt-2">
          <Form.Item
            name="size"
            label="Talla"
            rules={[{ required: true, message: 'Selecciona una talla' }]}
          >
            <Select placeholder="Selecciona una talla" allowClear>
              {MaterialUtils.getAvailableSizes(usedSizes).map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="consumption"
            label="Consumo"
            rules={[{ required: true, message: 'Ingresa el consumo' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
          <Form.Item
            name="performance"
            label="Rendimiento"
            rules={[{ required: true, message: 'Ingresa el rendimiento' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span className="text-lg font-semibold">
            Rendimientos por talla
            {selectedMaterial && (
              <span className="block text-sm font-normal text-gray-500 mt-1">
                {selectedMaterial.name}
              </span>
            )}
          </span>
        }
        open={VisibleMaterialRen}
        onCancel={() => setVisibleMaterialRen(false)}
        width={640}
        footer={
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                MaterialUtils.openMaterialSizeModal(
                  setVisibleMaterialSize,
                  setEditingRend
                )
              }
            >
              Agregar rendimiento
            </Button>
          </div>
        }
        styles={{ body: { paddingTop: 16 } }}
      >
        {materialRends && materialRends.length > 0 ? (
          <Table
            columns={columnsRen}
            dataSource={materialRends.map((r, i) => ({ ...r, key: r.id ?? i }))}
            pagination={false}
            size="middle"
            scroll={{ x: 400 }}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <RiseOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <p>No hay rendimientos registrados para este material.</p>
            <Button
              type="primary"
              className="mt-4"
              icon={<PlusOutlined />}
              onClick={() =>
                MaterialUtils.openMaterialSizeModal(
                  setVisibleMaterialSize,
                  setEditingRend
                )
              }
            >
              Agregar el primero
            </Button>
          </div>
        )}
      </Modal>

      <Drawer
        title="Editar rendimiento"
        open={visibleEditRend}
        onClose={() => {
          setVisibleEditRend(false)
          setEditingRend(null)
          editRendForm.resetFields()
        }}
        width={400}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setVisibleEditRend(false)
                setEditingRend(null)
                editRendForm.resetFields()
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={() =>
                MaterialUtils.handleSaveEditRend(
                  editingRend,
                  editRendForm,
                  setVisibleEditRend,
                  setEditingRend,
                  materialRends,
                  setMaterialRends,
                  selectedMaterial,
                  setUsedSizes
                )
              }
            >
              Guardar
            </Button>
          </div>
        }
      >
        <Form form={editRendForm} layout="vertical">
          <Form.Item name="size" label="Talla">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="consumption"
            label="Consumo"
            rules={[{ required: true, message: 'Ingresa el consumo' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
          <Form.Item
            name="performance"
            label="Rendimiento"
            rules={[{ required: true, message: 'Ingresa el rendimiento' }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Editar Material"
        open={visibleEdit}
        onClose={() => MaterialUtils.handleCloseEdit(setVisibleEdit, EditForm)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() =>
                MaterialUtils.handleSave(
                  editingMaterial,
                  EditForm,
                  Materials,
                  setMaterials,
                  setVisibleEdit,
                  file
                )
              }
              type="primary"
            >
              Guardar
            </Button>
          </div>
        }
      >
        <Form form={EditForm} layout="vertical">
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripcion">
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Cantidad">
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Categoría"
            rules={[
              { required: true, message: 'Por favor seleccione una categoría' }
            ]}
          >
            <Select
              placeholder="Seleccione una categoría"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8
                    }}
                  ></div>
                </>
              )}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Proveedor"
            rules={[
              { required: true, message: 'Por favor seleccione un proveedor' }
            ]}
          >
            <Select
              placeholder="Seleccione un proveedor"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8
                    }}
                  ></div>
                </>
              )}
            >
              {Suppliers.map((Supplier) => (
                <Option key={Supplier.id} value={Supplier.id}>
                  {Supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="unitMeasure" label="Unidad de medida">
            <Select placeholder="Selecciona una unidad">
              <Select.Option value="M">Metros (M)</Select.Option>
              <Select.Option value="KG">Kilos (KG)</Select.Option>
              <Select.Option value="U">Unidades(U)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateReceipt" label="Recibido:">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="serial" label="Serial">
            <Input />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Ubicación">
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Imagen"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              if (e && e.fileList) {
                return e.fileList
              }
              return []
            }}
          >
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Click para subir</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Añadir Nuevo Material"
        open={visibleAdd}
        onClose={() =>
          MaterialUtils.handleAddCancel(setVisibleAdd, EditForm, addForm)
        }
        extra={
          <Space>
            <Button
              onClick={() =>
                MaterialUtils.handleAddSave(
                  addForm,
                  setMaterials,
                  Materials,
                  setVisibleAdd,
                  file,
                  setFile
                )
              }
              type="primary"
            >
              Guardar
            </Button>
          </Space>
        }
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del material' }]}
          >
            <Input placeholder="Ej: CALCETA LISA, TELA POLO" />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input placeholder="Opcional" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Cantidad"
            rules={[
              { required: true, message: 'Por favor ingrese la Cantidad' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Categoría"
            rules={[
              { required: true, message: 'Por favor seleccione una categoría' }
            ]}
          >
            <Select
              placeholder="Seleccione una categoría"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8
                    }}
                  >
                    <Button type="link" onClick={handleAddCategory}>
                      Añadir Categoría
                    </Button>
                  </div>
                </>
              )}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Proveedor"
            rules={[
              { required: true, message: 'Por favor seleccione un proveedor' }
            ]}
          >
            <Select
              placeholder="Seleccione un proveedor"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8
                    }}
                  >
                    <Button type="link" onClick={handleAddSupplier}>
                      Añadir Proveedor
                    </Button>
                  </div>
                </>
              )}
            >
              {Suppliers.map((Supplier) => (
                <Option key={Supplier.id} value={Supplier.id}>
                  {Supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="unitMeasure" label="Unidad de medida">
            <Select placeholder="Selecciona una unidad">
              <Select.Option value="M">Metros(M)</Select.Option>
              <Select.Option value="KG">Kilos(KG)</Select.Option>
              <Select.Option value="U">Unidades(U)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateReceipt" label="Fecha de recibido">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="serial" label="Serial">
            <Input placeholder="Opcional" />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <Input placeholder="Ej: BLANCO, NEGRO" />
          </Form.Item>
          <Form.Item name="location" label="Ubicación">
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Imagen"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              if (e && e.fileList) {
                return e.fileList
              }
              return []
            }}
          >
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Click para subir</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        open={isAddCategoryModalVisible}
        title="Añadir Nueva Categoría"
        onClose={() => setIsAddCategoryModalVisible(false)}
        extra={
          <Space>
            <Button
              onClick={() =>
                MaterialUtils.handleNewCategorySubmit(
                  newCategoryName,
                  setCategories,
                  categories,
                  setIsAddCategoryModalVisible,
                  setNewCategoryName
                )
              }
              type="primary"
            >
              Guardar
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Form.Item
            label="Nombre de la categoría"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el nombre de la categoría'
              }
            ]}
          >
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        open={isAddSupplierModalVisible}
        title="Añadir Nuevo Proveedor"
        onClose={() => setIsAddSupplierModalVisible(false)}
        extra={
          <Space>
            <Button
              onClick={() =>
                MaterialUtils.handleNewSupplierSubmit(
                  newSupplier,
                  setSuppliers,
                  Suppliers,
                  setIsAddSupplierModalVisible
                )
              }
              type="primary"
            >
              Guardar{' '}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Form.Item
            label="Nombre del proveedor"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el nombre del proveedor'
              }
            ]}
          >
            <Input
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el correo electrónico'
              },
              {
                type: 'email',
                message: 'Por favor ingrese un correo electrónico válido'
              }
            ]}
          >
            <Input
              value={newSupplier.email}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, email: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el número de teléfono'
              }
            ]}
          >
            <Input
              value={newSupplier.phone}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, phone: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Drawer>

      <div className="flex flex-col md:flex-row md:justify-between mb-4">
      <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de materiales</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={() => MaterialUtils.handleAdd(setVisibleAdd)}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir Nuevo
            Material{' '}
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
            <FilePdfOutlined className="text-red-500" onClick={() => {
              const headers = ['ID', 'Nombre', 'Descripción', 'Stock', 'Ubicación']
              const data = filteredMaterialsWithKeys.map((m) => [
                m.id?.toString() || '',
                m.name || '',
                m.description || '',
                m.stock?.toString() || '0',
                m.location || ''
              ])
              generatePDFTable('Lista de Materiales', headers, data, 'materiales')
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
            dataSource={filteredMaterialsWithKeys}
            tableLayout="fixed"
          />
        </div>
      </Card>
    </>
  )
}

export default MaterialList
