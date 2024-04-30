import React, { useState, useEffect } from 'react'
import { Button, Space, Table, Card, Input } from 'antd'
import {
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import axios from 'axios'

const { Search } = Input

const EmployeList = () => {
  const [employees, setEmployees] = useState([])
  const [filteredInfo, setFilteredInfo] = useState({})
  const [sortedInfo, setSortedInfo] = useState({})
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/')
        setEmployees(response.data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, [])

  const handleChange = (pagination:any, filters:any, sorter:any) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }

 
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a:any, b:any) => a.name.length - b.name.length
    },
    {
      title: 'Apellido',
      dataIndex: 'surname',
      key: 'surname',
      sorter: (a:any, b:any) => a.surname.length - b.surname.length
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      sorter: (a:any, b:any) => a.email.length - b.email.length
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
      sorter: (a:any, b:any) => a.address.length - b.address.length
    },
    {
      title: 'Sueldo',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a:any, b:any) => a.salary - b.salary
    },
    {
      title: 'Fecha de inicio',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      sorter: (a:any, b:any) => a.role - b.role
    },
    {
      title: 'Foto',
      dataIndex: 'image',
      key: 'image',
    },
  ]

  const filteredEmployees = searchText
    ? employees.filter(employee =>
        Object.values(employee).some(
          value =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : employees

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Personal</h4>
          <h6 className="text-sm">Lista de Empleados</h6>
        </div>
        <Button className=" h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center ">
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
              onChange={e => setSearchText(e.target.value)}
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
          dataSource={filteredEmployees}
          onChange={handleChange}
          scroll={{ y: 500 }}
        />
      </Card>
    </>
  )
}

export default EmployeList
