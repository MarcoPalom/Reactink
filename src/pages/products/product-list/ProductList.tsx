import React, { useState, useEffect } from 'react'
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
  DatabaseOutlined
} from '@ant-design/icons'
import axios from 'axios'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import {
  Material,
  MaterialAdd,
  Category,
  CategoryAdd,
  Supplier,
  SupplierAdd
} from 'components/Scripts/Interfaces'
import Dragger from 'antd/es/upload/Dragger'

const { Search } = Input
const { confirm } = Modal

const MaterialList = () => {
  const [Materials, setMaterials] = useState<Material[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null )
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [Suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isAddSupplierModalVisible, setIsAddSupplierModalVisible] =useState(false)
  const [newSupplier, setNewSupplier] = useState<SupplierAdd>({
    name: '',
    email: '',
    phone: ''
  })
  const [userName, setUserName] = useState<string>('')
  const navigate = useNavigate()
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const { Option } = Select

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsResponse, categoriesResponse, suppliersResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/material/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('http://localhost:3001/api/category/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('http://localhost:3001/api/supplier/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get(`http://localhost:3001/api/user/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);

        const materials: Material[] = materialsResponse.data.map((material: any) => ({
          ...material,
          categoryName: categoriesResponse.data.find((category: Category) => category.id === material.categoryId)?.name,
          supplierName: suppliersResponse.data.find((supplier: Supplier) => supplier.id === material.supplierId)?.name,
          userName: userResponse.data.find((user: any) => user.id === material.userId)?.name
        }));

        setMaterials(materials);
        setCategories(categoriesResponse.data);
        setSuppliers(suppliersResponse.data);
        setUserName(userResponse.data.name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [visibleAdd]);

  const handleAddSupplier = () => setIsAddSupplierModalVisible(true);
  const handleAddCategory = () => setIsAddCategoryModalVisible(true);
  

 
  const handleNewSupplierSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/supplier/',
        newSupplier,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const createdSupplier: Supplier = { ...newSupplier, id: response.data.id }
      setSuppliers([...Suppliers, createdSupplier])
      setIsAddSupplierModalVisible(false)
      addForm.resetFields()
    } catch (error) {
      console.error('There was an error adding the Supplier!', error)
    }
  }

 

  const handleNewCategorySubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/category/',
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setCategories([...categories, response.data])
      setIsAddCategoryModalVisible(false)
      setNewCategoryName('')
    } catch (error) {
      console.error('There was an error adding the category!', error)
    }
  }

  const handleView = async (id: string) => {
    try {
      const response = await axios.get<Material>(
        `http://localhost:3001/api/material/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSelectedMaterial(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching Material details:', error)
    }
  }

  const handleSave = async () => {
    try {
      const values = await EditForm.validateFields()
      const response = await axios.put<Material>(
        `http://localhost:3001/api/material/update/${editingMaterial?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      message.success('Material actualizado exitosamente')
      const updatedMaterials = Materials.map((Material) =>
        Material.id === editingMaterial?.id
          ? { ...Material, ...values }
          : Material
      )
      setMaterials(updatedMaterials)
      setVisibleEdit(false)
      EditForm.resetFields()
    } catch (error) {
      console.error('Error updating Material:', error)
      message.error('Error al actualizar el Material')
    }
  }

  const handleAddSave = async () => {
    try {
      const values = await addForm.validateFields()
      const MaterialData: MaterialAdd = {
        ...values,
      }

      const response = await axios.post<Material>(
        'http://localhost:3001/api/material/',
        MaterialData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setMaterials((prevMaterials) => [...prevMaterials, response.data])
      message.success('Material agregado exitosamente')
      setVisibleAdd(false)
      addForm.resetFields()
    } catch (error: any) {
      console.error('Error adding Material:', error)
      message.error(
        error.response?.data.message || 'Error al agregar el Material'
      )
    }
  }

  const handleDelete = (record: Material) => {
    confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres eliminar al Material ${record.name}?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteMaterial(record.id)
      }
    })
  }

  const deleteMaterial = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/material/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      message.success('Material eliminado exitosamente')
      const updatedMaterials = Materials.filter(
        (Material) => Material.id !== id
      )
      setMaterials(updatedMaterials)
    } catch (error) {
      console.error('Error deleting Material:', error)
      message.error('Error al eliminar el Material')
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

  const handleEdit = async (record: Material) => {
    try {
      setEditingMaterial(record)
      EditForm.setFieldsValue(record)
      setVisibleEdit(true)
    } catch (error) {
      console.error('Error al editar el Material:', error)
    }
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
      title: 'Cantidad',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: any, b: any) => a.address.length - b.address.length
    },
    {
      title: 'Provedor',
      dataIndex: 'supplierName',
      key: 'supplierId',
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Categoria',
      dataIndex: 'categoryName',
      key: 'categoryId'
    },
    {
      title: 'Agrego',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Unidad',
      dataIndex: 'unitMeasure',
      key: 'unitMeasure'
    },
    {
      title: 'Fecha de recibido',
      dataIndex: 'dateReceipt',
      key: 'dateReceipt'
    },
    {
      title: 'Serie',
      dataIndex: 'serial',
      key: 'serial'
    },
    {
      title: 'Ubicacion',
      dataIndex: 'location',
      key: 'location'
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

  const filteredMaterials = searchText
    ? Materials.filter((Material) =>
        Object.values(Material).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : Materials

  const filteredMaterialsWithKeys = filteredMaterials.map(
    (Material, index) => ({
      ...Material,
      key: index.toString()
    })
  )

  return (
    <>
      <Modal
        title="Detalles del Material"
        open={visible}
        onCancel={handleClose}
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
        title="Editar Material"
        open={visibleEdit}
        onCancel={handleCloseEdit}
        onOk={handleSave}
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
              <Select.Option value="Cm">Centimetros(Cm)</Select.Option>
              <Select.Option value="in">Pulgada(in)</Select.Option>
              <Select.Option value="M">Metros(M)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateReceipt" label="Recibido:">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="serial" label="Serial">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Ubicacion">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Añadir Nuevo Material"
        open={visibleAdd}
        onClose={handleAddCancel}
        extra={
          <Space>
          <Button onClick={handleAddSave} type="primary">
            Submit
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
                      Añadir categoría
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
                      Añadir proveedor
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
              <Select.Option value="Cm">Centimetros(Cm)</Select.Option>
              <Select.Option value="in">Pulgada(in)</Select.Option>
              <Select.Option value="M">Metros(M)</Select.Option>
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
        title="Añadir nueva categoría"
        onClose={() => setIsAddCategoryModalVisible(false)}
        extra={
          <Space>
            <Button onClick={handleNewCategorySubmit} type="primary">
              Submit
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

      <Modal
        open={isAddSupplierModalVisible}
        title="Añadir nuevo proveedor"
        onCancel={() => setIsAddSupplierModalVisible(false)}
        onOk={handleNewSupplierSubmit}
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
      </Modal>

      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de materiales</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={handleAdd}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir nuevo
            material{' '}
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
          dataSource={filteredMaterialsWithKeys}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  )
}

export default MaterialList
