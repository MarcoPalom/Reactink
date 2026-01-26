import { useState, useEffect } from 'react'
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
  Upload,
  Drawer
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  UploadOutlined
} from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { Employee } from 'components/Scripts/Interfaces'
import * as EmployeeUtils from 'components/Scripts/EmployeeUtils'
import { UploadChangeParam } from 'antd/lib/upload'
import { generatePDFTable } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import Missing from 'assets/img/noUserPhoto.jpg'
import TodayDate from '../../../components/Scripts/Utils'

const { Search } = Input

const EmployeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  )
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const filteredEmployees = EmployeeUtils.filterEmployees(employees, searchText)
  const filteredEmployeesWithKeys =
    EmployeeUtils.addKeysToEmployees(filteredEmployees)
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>('')

  const navigate = useNavigate()
  useTokenRenewal(navigate)

  useEffect(() => {
    EmployeeUtils.fetchAndSetEmployees(setEmployees)
  }, [visibleAdd])

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
      title: 'Apellido',
      dataIndex: 'surname',
      key: 'surname',
      sorter: (a: any, b: any) => a.surname.length - b.surname.length
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Telefono',
      dataIndex: 'phone',
      key: 'phone',
      className: 'hidden lg:table-cell'
    },
    {
      title: 'Direccion',
      dataIndex: 'address',
      key: 'address',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.address.length - b.address.length
    },

    {
      title: 'Sueldo',
      dataIndex: 'salary',
      key: 'salary',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.salary - b.salary
    },
    {
      title: 'Fecha de inicio',
      dataIndex: 'startDate',
      key: 'startDate',
      className: 'hidden lg:table-cell',
      render: (startDate: Date) => {
        return new Date(startDate).toLocaleDateString('es-ES')
      }
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      className: 'hidden lg:table-cell',
      sorter: (a: any, b: any) => a.role - b.role,
      render: (role: number) => {
        return EmployeeUtils.roleMapping[role] || 'Desconocido'
      }
    },
    {
      title: 'Accion',
      key: 'action',
      className: 'action-column ',
      render: (record: Employee) => (
        <Space className="md:flex-wrap md:items-center" size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={async () => {
              await EmployeeUtils.handleView(
                record.id.toString(),
                setSelectedEmployee,
                setVisible,
                setImage
              )
            }}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => {
              EmployeeUtils.handleEdit(
                record,
                setEditingEmployee,
                editForm,
                setVisibleEdit
              )
            }}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() =>
              EmployeeUtils.handleDelete(record, employees, setEmployees)
            }
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <Modal
        title="Detalles del Empleado"
        open={visible}
        onCancel={() => EmployeeUtils.handleClose(setVisible, setImage)}
        footer={[]}
      >
        {selectedEmployee && (
          <>
            <div className="flex justify-center">
              {image ? (
                <img className="w-44 h-44" src={image} alt="Image" />
              ) : (
                <img className="w-44 h-44" src={Missing} alt="missing image" />
              )}
            </div>

            <p>
              <strong>Nombre:</strong> {selectedEmployee.name}
            </p>
            <p>
              <strong>Apellido:</strong> {selectedEmployee.surname}
            </p>
            <p>
              <strong>Rol:</strong>{' '}
              {EmployeeUtils.roleMapping[selectedEmployee.role] ||
                'Desconocido'}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedEmployee.phone}
            </p>

            <p>
              <strong>Correo:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>Dirección:</strong> {selectedEmployee.address}
            </p>
            <p>
              <strong>Sueldo:</strong> {selectedEmployee.salary}
            </p>
            <p>
              <strong>Fecha de inicio:</strong>{' '}
              {new Date(selectedEmployee.startDate).toLocaleDateString('es-ES')}
            </p>
          </>
        )}
      </Modal>

      <Drawer
        title="Editar Empleado"
        open={visibleEdit}
        onClose={() => EmployeeUtils.handleCloseEdit(editForm, setVisibleEdit)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                editForm
                  .validateFields()
                  .then((values) => {
                    EmployeeUtils.handleSave(
                      editForm,
                      editingEmployee,
                      employees,
                      setEmployees,
                      setVisibleEdit,
                      file,
                      setFile
                    )
                  })
                  .catch((errorInfo) => {
                    console.error('Error validating form:', errorInfo)
                    message.error(
                      'Por favor completa todos los campos requeridos.'
                    )
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
              <Select.Option value={3}>Administrativo</Select.Option>
              <Select.Option value={4}>Diseño</Select.Option>
              <Select.Option value={5}>Corte</Select.Option>
              <Select.Option value={6}>Impresion</Select.Option>
              <Select.Option value={7}>Sublimado</Select.Option>
              <Select.Option value={8}>Costura</Select.Option>
              <Select.Option value={9}>Planchado y Acabado</Select.Option>
            </Select>
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
        title="Añadir Nuevo Empleado"
        open={visibleAdd}
        onClose={() => EmployeeUtils.handleAddCancel(setVisibleAdd, addForm)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() =>
                EmployeeUtils.handleAddSave(
                  addForm,
                  setEmployees,
                  setVisibleAdd,
                  file,
                  setFile
                )
              }
              type="primary"
            >
              Guardar
            </Button>
          </div>
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
          <Form.Item
            name="surname"
            label="Apellido"
            rules={[
              { required: true, message: 'Por favor ingrese el apellido' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo Electrónico"
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
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingrese la contraseña' }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            rules={[
              { required: true, message: 'Por favor confirme la contraseña' }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[
              { required: true, message: 'Por favor ingrese el telefono' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Dirección"
            rules={[
              { required: true, message: 'Por favor confirme la dirección' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salario"
            rules={[
              { required: true, message: 'Por favor confirme el salario' }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Fecha de Inicio"
            rules={[
              {
                required: true,
                message: 'Por favor confirme la fecha de inicio'
              }
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Puesto"
            rules={[
              { required: true, message: 'Por favor confirme el puesto' }
            ]}
          >
            <Select placeholder="Selecciona un puesto">
              <Select.Option value={1}>Administrador</Select.Option>
              <Select.Option value={2}>Financiero</Select.Option>
              <Select.Option value={3}>Administrativo</Select.Option>
              <Select.Option value={4}>Diseño</Select.Option>
              <Select.Option value={5}>Corte</Select.Option>
              <Select.Option value={6}>Impresion</Select.Option>
              <Select.Option value={7}>Sublimado</Select.Option>
              <Select.Option value={8}>Costura</Select.Option>
              <Select.Option value={9}>Planchado y Acabado</Select.Option>
            </Select>
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

      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de Empleados</h6>
        </div>
        <Button
          className="h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 mt-4 md:mt-0 md:self-end"
          onClick={() => EmployeeUtils.handleAdd(setVisibleAdd)}
          icon={<PlusOutlined className="text-white font-bold" />}
        >
          Añadir nuevo empleado
        </Button>
      </div>

      <Card>
        <Space className="mb-4 flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <Search
              placeholder="Busqueda..."
              className="w-44"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" onClick={() => {
              const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Rol']
              const data = filteredEmployeesWithKeys.map((e) => [
                e.id?.toString() || '',
                e.name || '',
                e.surname || '',
                e.email || '',
                e.phone || '',
                e.role?.toString() || ''
              ])
              generatePDFTable('Lista de Empleados', headers, data, 'empleados')
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
            dataSource={filteredEmployeesWithKeys}
            tableLayout="fixed"
          />
        </div>
      </Card>
    </>
  )
}

export default EmployeList
