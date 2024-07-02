import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Space,
  Table,
  Card,
  Input,
  Modal,
  Form,
  message
} from 'antd';
import {
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import axios from 'axios';
import useTokenRenewal from 'components/Scripts/useTokenRenewal';
import { Client } from 'components/Scripts/Interfaces';
import * as clientUtils from 'components/Scripts/ClientUtils'; 

const { Search } = Input;

const ClientList = () => {
  const [Clients, setClients] = useState<Client[]>([]);
  const [searchText, setSearchText] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const navigate = useNavigate();
  const [EditForm] = Form.useForm();
  const [addForm] = Form.useForm();

  useTokenRenewal(navigate);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/client/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching Clients:', error);
      }
    };
    fetchClients();
  }, [visibleAdd]);

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
      sorter: (a: any, b: any) => a.organization.length - b.organization.length
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
      title: 'Acción',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => clientUtils.handleView(record.id.toString(), setSelectedClient, setVisible)}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => clientUtils.handleEdit(record, setEditingClient, EditForm, setVisibleEdit)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => clientUtils.handleDelete(record, Clients, setClients)}
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title="Detalles del Cliente"
        visible={visible}
        onCancel={() => clientUtils.handleClose(setVisible)}
        footer={[]}
      >
        {selectedClient && (
          <>
            <p><strong>Nombre:</strong> {selectedClient.name}</p>
            <p><strong>Apellido:</strong> {selectedClient.surname}</p>
            <p><strong>Organización:</strong> {selectedClient.organization}</p>
            <p><strong>Email:</strong> {selectedClient.email}</p>
            <p><strong>Teléfono:</strong> {selectedClient.phone}</p>
          </>
        )}
      </Modal>

      <Modal
        title="Editar Cliente"
        visible={visibleEdit}
        onCancel={() => clientUtils.handleCloseEdit(EditForm, setVisibleEdit)}
        onOk={() => clientUtils.handleSave(EditForm, editingClient, Clients, setClients, setVisibleEdit)}
      >
        <Form form={EditForm} layout="vertical">
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
          <Form.Item name="surname" label="Apellido">
            <Input />
          </Form.Item>
          <Form.Item name="organization" label="Organización">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Añadir Nuevo Cliente"
        visible={visibleAdd}
        onCancel={() => clientUtils.handleAddCancel(EditForm, addForm, setVisibleAdd)}
        onOk={() => clientUtils.handleAddSave(addForm, setClients, setVisibleAdd)}
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
            name="organization"
            label="Organización"
            rules={[{ required: true, message: 'Por favor ingrese la organización' }]}
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
          onClick={() => clientUtils.handleAdd(setVisibleAdd)}
        >
          <a>
            <PlusOutlined className="text-white font-bold" /> Añadir nuevo cliente
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
              placeholder="Búsqueda..."
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
          dataSource={clientUtils.addKeysToFilteredClients(clientUtils.filterClients(Clients, searchText))}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  );
};

export default ClientList;
