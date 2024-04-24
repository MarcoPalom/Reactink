import React, { useState } from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import { Button, Space, Table, Card, Input } from 'antd';
import { PlusOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const ProductList: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: 'descend',
      columnKey: 'age',
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className='grid grid-cols-1 justify-items-center items-center lg:flex flex-row justify-between mb-4'>
        <div className='text-center  lg:text-left'>
          <h4 className='font-bold text-lg'>Inventario</h4>
          <h6 className='text-sm'>Lista de Productos</h6>
        </div>
        <Button className=' h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 items-center '>
          <a><PlusOutlined className='text-white font-bold' />    Añadir nuevo producto </a>

        </Button>
      </div>

      <Card className='w-full'>
        <Space style={{ marginBottom: 16 }} className='flex flex-row justify-between'>

          <div className='grid grid-cols-2 lg:flex flex-row gap-1'>
            <Search placeholder="Busqueda..." className="w-full" />
            <Button onClick={setAgeSort}>Sort age</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
          </div>
          <div className='flex flex-row gap-4 text-lg'>
            <FilePdfOutlined className='text-red-500' />
            <FileExcelOutlined className='text-lime-500' />
            <PrinterOutlined />
          </div>
        </Space>
        <Table columns={columns} dataSource={data} onChange={handleChange} scroll={{ y: 500 }} />
      </Card>
    </>
  );
};

export default ProductList;