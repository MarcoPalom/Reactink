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
  Drawer
} from 'antd'
import * as MaterialUtils from 'components/Scripts/MaterialUtils'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  RiseOutlined
} from '@ant-design/icons'
import axios from 'axios'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import {
  Material,
  Category,
  Supplier,
  SupplierAdd,
  MaterialSize
} from 'components/Scripts/Interfaces'
import { generatePDF } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'

const { Search } = Input
const { confirm } = Modal

const MaterialList = () => {
  const [Materials, setMaterials] = useState<Material[]>([])
  const [EditingMaterialSize, setEditingMaterialSize] = useState<MaterialSize[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [VisibleMaterialSize, setVisibleMaterialSize] = useState<boolean>(false)
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
  const { Option } = Select
  const filteredMaterials = MaterialUtils.filterMaterials(Materials, searchText);
  const filteredMaterialsWithKeys = MaterialUtils.addKeysToMaterials(filteredMaterials);

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          materialsResponse,
          categoriesResponse,
          suppliersResponse,
          userResponse
        ] = await Promise.all([
          axios.get('http://localhost:3001/api/material/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get('http://localhost:3001/api/category/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get('http://localhost:3001/api/supplier/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`http://localhost:3001/api/user/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ])

        const materials: Material[] = materialsResponse.data.map(
          (material: any) => ({
            ...material,
            categoryName: categoriesResponse.data.find(
              (category: Category) => category.id === material.categoryId
            )?.name,
            supplierName: suppliersResponse.data.find(
              (supplier: Supplier) => supplier.id === material.supplierId
            )?.name,
            userName: userResponse.data.find(
              (user: any) => user.id === material.userId
            )?.name
          })
        )

        setMaterials(materials)
        setCategories(categoriesResponse.data)
        setSuppliers(suppliersResponse.data)
        setUserName(userResponse.data.name)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [visibleAdd])

  const handleAddSupplier = () => setIsAddSupplierModalVisible(true)
  const handleAddCategory = () => setIsAddCategoryModalVisible(true)




  

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
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() =>
              MaterialUtils.handleView(
                record.id.toString(),
                setSelectedMaterial,
                setVisible
              )
            }
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => MaterialUtils.handleEdit(record, setEditingMaterial, EditForm, setVisibleEdit)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => MaterialUtils.handleDelete(record, Materials, setMaterials)}
          />
           <Button
            icon={<RiseOutlined  className="text-yellow-700" />}
            onClick={()=>MaterialUtils.openMaterialSizeModal(record,setSelectedMaterial,setVisibleMaterialSize)}
          />
        </Space>
      )
    }
  ]



  return (
    <>
      <Modal
        title="Detalles del Material"
        open={visible}
        onCancel={()=> MaterialUtils.handleClose(setVisible)}
        footer={[]}
      >
        {selectedMaterial && (
          <>
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
              <strong>Provedor:</strong> {selectedMaterial.supplierId}
            </p>
            <p>
              <strong>Categoria:</strong> {selectedMaterial.categoryId}
            </p>
            <p>
              <strong>Usuario:</strong> {selectedMaterial.userId}
            </p>
            <p>
              <strong>Unidad:</strong> {selectedMaterial.unitMeasure}
            </p>
            <p>
              <strong>Recibido:</strong> {selectedMaterial.dateReceipt}
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
        title="Agregar Tamaño de Material"
        open={VisibleMaterialSize}
        onOk={()=>MaterialUtils.handleSaveMatSize(MaterialSizeform,selectedMaterial,setVisibleMaterialSize)}
        onCancel={()=>MaterialUtils.handleCloseMaterialSize(MaterialSizeform,setVisibleMaterialSize)}
      >
        <Form form={MaterialSizeform} layout="vertical">
          <div className='flex flex-row justify-between'>
          <Form.Item
            name="size"
            label="Tamaño"
            rules={[{ required: true, message: 'Por favor ingrese el tamaño' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="consumption"
            label="Consumo"
            rules={[{ required: true, message: 'Por favor ingrese el consumo' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="performance"
            label="Desempeño"
            rules={[{ required: true, message: 'Por favor ingrese el desempeño' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          </div>
        </Form>
      </Modal>

      <Drawer
  title="Editar Material"
  visible={visibleEdit}
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
            setVisibleEdit
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
        <Select.Option value="CM">Centímetros (Cm)</Select.Option>
        <Select.Option value="IN">Pulgada (in)</Select.Option>
        <Select.Option value="M">Metros (M)</Select.Option>
        <Select.Option value="KG">Kilos (KG)</Select.Option>
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
  </Form>
</Drawer>

      <Drawer
        title="Añadir Nuevo Material"
        open={visibleAdd}
        onClose={()=>MaterialUtils.handleAddCancel(setVisibleAdd,EditForm,addForm)}
        extra={
          <Space>
            <Button
              onClick={() =>
                MaterialUtils.handleAddSave(
                  addForm,
                  setMaterials,
                  Materials,
                  setVisibleAdd
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
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="descripcion">
            <Input />
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
              <Select.Option value="CM">Centimetros(Cm)</Select.Option>
              <Select.Option value="IN">Pulgada(in)</Select.Option>
              <Select.Option value="M">Metros(M)</Select.Option>
              <Select.Option value="KG">Kilos(KG)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateReceipt" label="Fecha de recibido">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="serial" label="serial">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Ubicacion">
            <Input />
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

      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de materiales</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={()=>MaterialUtils.handleAdd(setVisibleAdd)}
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
            <FilePdfOutlined className="text-red-500" onClick={generatePDF} />
          </div>
        </Space>
        <div id="PDFtable">
          <div className="mt-5 flex justify-between mb-5">
            <img src={Logo} alt="Ink Sports" className="h-10 " />
            <h1 className="text-end">
              {' '}
              Ciudad victoria, Tamaulipas a<TodayDate></TodayDate>{' '}
            </h1>
          </div>
          <Table
            className="w-full border-collapse border border-gray-200"
            columns={columns}
            dataSource={filteredMaterialsWithKeys}
          />
        </div>
      </Card>
    </>
  )
}

export default MaterialList
