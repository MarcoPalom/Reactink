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
import { Client, ClientAdd } from 'components/Scripts/Interfaces'

const { Search } = Input
const { confirm } = Modal


const ClientList = () => {
  const [Clients, setClients] = useState<Client[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    null
  )
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const navigate = useNavigate()
  const [EditForm] = Form.useForm()
  const [addForm] = Form.useForm()

  useTokenRenewal(navigate)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/client/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setClients(response.data)
      } catch (error) {
        console.error('Error fetching Clients:', error)
      }
    }
    fetchClients()
  }, [visibleAdd])

  

  const handleView = async (id: string) => {
    try {
      const response = await axios.get<Client>(
        `http://localhost:3001/api/client/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSelectedClient(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching Client details:', error)
    }
  }

  const handleSave = async () => {
    try {
      const values = await EditForm.validateFields()
      const response = await axios.put<Client>(
        `http://localhost:3001/api/client/update/${editingClient?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      message.success('Cliente actualizado exitosamente')
      const updatedClients = Clients.map((Client) =>
        Client.id === editingClient?.id
          ? { ...Client, ...values }
          : Client
      )
      setClients(updatedClients)
      setVisibleEdit(false)
      EditForm.resetFields()
    } catch (error) {
      console.error('Error updating Client:', error)
      message.error('Error al actualizar el Cliente')
    }
  }

  const handleAddSave = async () => {
    try {
      const values = await addForm.validateFields()
      const ClientData: ClientAdd = {
        name: values.name,
        surname: values.surname,
        organization: values.organization,
        email: values.email,
        phone: values.phone,
      }

      const response = await axios.post<Client>(
        'http://localhost:3001/api/client/',
        ClientData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setClients((prevClients) => [...prevClients, response.data]);
      message.success('Cliente agregado exitosamente');
      setVisibleAdd(false);
      addForm.resetFields()
    } catch (error: any) {
      console.error('Error adding Client:', error)
      message.error(
        error.response?.data.message || 'Error al agregar el Cliente'
      )
    }
  }

  const handleDelete = (record: Client) => {
    confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres eliminar al Cliente ${record.name} ${record.surname}?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteclient(record.id)
      }
    })
  }

  const deleteclient = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/client/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      message.success('Cliente eliminado exitosamente')
      const updatedClients = Clients.filter(
        (Client) => Client.id !== id
      )
      setClients(updatedClients)
    } catch (error) {
      console.error('Error deleting Client:', error)
      message.error('Error al eliminar el Cliente')
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

  const handleEdit = async (record: Client) => {
    try {
      setEditingClient(record)
      EditForm.setFieldsValue(record)
      setVisibleEdit(true)
    } catch (error) {
      console.error('Error al editar el Cliente:', error)
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
      title: 'Apellido',
      dataIndex: 'surname',
      key: 'surname',
      sorter: (a: any, b: any) => a.surname.length - b.surname.length
    },
    {
        title: 'Organizacion',
        dataIndex: 'organization',
        key: 'organization',
        sorter: (a: any, b: any) => a.address.length - b.address.length
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

  const filteredClients = searchText
    ? Clients.filter((Client) =>
        Object.values(Client).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : Clients

  const filteredClientsWithKeys = filteredClients.map(
    (Client, index) => ({
      ...Client,
      key: index.toString()
    })
  )

  return (
    <>
      <Modal
        title="Detalles del Cliente"
        open={visible}
        onCancel={handleClose}
        footer={[]}
      >
        {selectedClient && (
          <>
            <p>
            <strong>Nombre:</strong> {selectedClient.name}
            </p>
            <p>
              <strong>Apellido:</strong> {selectedClient.surname}
            </p>
            <p>
              <strong>Organizacion:</strong> {selectedClient.organization}
            </p>
            <p>
              <strong>Email:</strong> {selectedClient.email}
            </p>
            <p>
              <strong>Telefono:</strong> {selectedClient.phone}
            </p>
          </>
        )}
      </Modal>

      <Modal
        title="Editar Cliente"
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
          <Form.Item name="organization" label="Organizacion">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefono">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Añadir Nuevo Cliente"
        open={visibleAdd}
        onCancel={handleAddCancel}
        onOk={handleAddSave}
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
            name="organization"
            label="Organizacion"
            rules={[{ required: true, message: 'Por favor ingrese la organizacion' }]}
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
          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de Clientes</h6>
        </div>
        <Button
          className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center "
          onClick={handleAdd}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir nuevo
            cliente{' '}
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
          dataSource={filteredClientsWithKeys}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  )
}

export default ClientList
