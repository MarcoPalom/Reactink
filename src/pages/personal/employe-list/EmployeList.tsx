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
  Upload
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
  UploadOutlined
} from '@ant-design/icons'
import axios from 'axios'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { Employee } from 'components/Scripts/Interfaces'
import * as EmployeeUtils from 'components/Scripts/EmployeeUtils'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
import { generatePDF } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'

const { Search } = Input
const { confirm } = Modal

const roleMapping: Record<number, string> = {
  1: 'Administrador',
  2: 'Financiero',
  3: 'Auxiliar'
}

const EmployeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  )
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const navigate = useNavigate()
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const filteredEmployees = EmployeeUtils.filterEmployees(employees, searchText)
  const filteredEmployeesWithKeys =
    EmployeeUtils.addKeysToEmployees(filteredEmployees)
  const [fileString, setFileString] = useState<string>('')

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setEmployees(response.data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }
    fetchEmployees()
  }, [visibleAdd])

  const handleFileChange = (info: UploadChangeParam) => {
    const fileList = [...info.fileList]
    const file = fileList[0]?.originFileObj as RcFile

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const img = new Image()
      img.src = reader.result as string

      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        const base64Image = canvas.toDataURL('image/jpeg', 0.6)
        const maxLength = 255
        const trimmedBase64 = base64Image.substring(0, maxLength)
        setFileString(trimmedBase64)
      }
    }

    reader.readAsDataURL(file)
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
      className: 'hidden lg:table-cell',
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
        return roleMapping[role] || 'Desconocido'
      }
    },
    {
      title: 'Accion',
      key: 'action',
      className: 'action-column ',
      render: (text: any, record: any) => (
        <Space className="md:flex-wrap md:items-center" size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() =>
              EmployeeUtils.handleView(
                record.id.toString(),
                setSelectedEmployee,
                setVisible
              )
            }
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() =>
              EmployeeUtils.handleEdit(
                record,
                setEditingEmployee,
                EditForm,
                setVisibleEdit
              )
            }
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
        onCancel={() => EmployeeUtils.handleClose(setVisible)}
        footer={[]}
      >
        {selectedEmployee && (
          <>
            <p>
              <strong>Nombre:</strong> {selectedEmployee.name}
            </p>
            <p>
              <strong>Apellido:</strong> {selectedEmployee.surname}
            </p>
            <p>
              <strong>Correo:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedEmployee.phone}
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
            <p>
              <strong>Rol:</strong>{' '}
              {roleMapping[selectedEmployee.role] || 'Desconocido'}
            </p>
          </>
        )}
      </Modal>

      <Modal
        title="Editar Empleado"
        open={visibleEdit}
        onCancel={() => EmployeeUtils.handleCloseEdit(EditForm, setVisibleEdit)}
        onOk={() => {
          EditForm.validateFields()
            .then((values) => {
              EmployeeUtils.handleSave(
                EditForm,
                editingEmployee,
                employees,
                setEmployees,
                setVisibleEdit,
                fileString
              )
            })
            .catch((errorInfo) => {
              console.error('Error validating form:', errorInfo)
              message.error('Por favor completa todos los campos requeridos.')
            })
        }}
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
            rules={[{ required: true, message: 'Por favor sube una imagen' }]}
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
      </Modal>

      <Modal
        title="Añadir Nuevo Empleado"
        open={visibleAdd}
        onCancel={() =>
          EmployeeUtils.handleAddCancel(setVisibleAdd, EditForm, addForm)
        }
        onOk={() =>
          EmployeeUtils.handleAddSave(addForm, setEmployees, setVisibleAdd)
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
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingrese la contraseña' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            rules={[
              { required: true, message: 'Por favor confirme la contraseña' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Dirección">
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salario">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="startDate" label="Fecha de Inicio">
            <Input type="date" />
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

      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de Empleados</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={() => EmployeeUtils.handleAdd(setVisibleAdd)}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir nuevo
            empleado{' '}
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
            dataSource={filteredEmployeesWithKeys}
          />
        </div>
      </Card>
    </>
  )
}

export default EmployeList
