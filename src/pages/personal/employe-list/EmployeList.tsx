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
  Select
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
import { Employee} from 'components/Scripts/Interfaces'
import * as EmployeeUtils from 'components/Scripts/EmployeeUtils'; 

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
  const filteredEmployees = EmployeeUtils.filterEmployees(employees, searchText);
  const filteredEmployeesWithKeys = EmployeeUtils.addKeysToEmployees(filteredEmployees);


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
      sorter: (a: any, b: any) => a.email.length - b.email.length
    },
    {
      title: 'Telefono',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Direccion',
      dataIndex: 'address',
      key: 'address',
      sorter: (a: any, b: any) => a.address.length - b.address.length
    },
    {
      title: 'Sueldo',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a: any, b: any) => a.salary - b.salary
    },
    {
      title: 'Fecha de inicio',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate: Date) => {
        return new Date(startDate).toLocaleDateString('es-ES');
      }
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      sorter: (a: any, b: any) => a.role - b.role,
      render: (role: number) => {
        return roleMapping[role] || 'Desconocido';
      }
    },
    {
      title: 'Accion',
      key: 'action',
      render: (text: any, record: any) => (
        <Space className="md:flex-wrap md:items-center"size="middle" >
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => EmployeeUtils.handleView(record.id.toString(), setSelectedEmployee, setVisible)}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => EmployeeUtils.handleEdit(record, setEditingEmployee, EditForm, setVisibleEdit)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => EmployeeUtils.handleDelete(record, employees, setEmployees)}
          />       
        </Space>
      )
    }
  ];

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
        onOk={() => EmployeeUtils.handleSave(EditForm, editingEmployee, employees, setEmployees, setVisibleEdit)}
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

      <Modal
        title="Añadir Nuevo Empleado"
        open={visibleAdd}
        onCancel={() => EmployeeUtils.handleAddCancel(setVisibleAdd, EditForm, addForm)}
        onOk={() => EmployeeUtils.handleAddSave(addForm, setEmployees, setVisibleAdd)}
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
            rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor ingrese el correo electrónico' },
              { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            rules={[{ required: true, message: 'Por favor confirme la contraseña' }]}
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
            <FilePdfOutlined className="text-red-500" />
            <FileExcelOutlined className="text-lime-500" />
            <PrinterOutlined />
          </div>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredEmployeesWithKeys}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  );
};

export default EmployeList;
 