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
  message,
  Select,
  Drawer
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { Employee, Expense, Material } from 'components/Scripts/Interfaces'
import * as ExpenseUtils from 'components/Scripts/ExpenseUtils'
import { generatePDFTable } from 'components/Scripts/Utils'
import Logo from 'assets/img/logo.png'
import TodayDate from '../../../components/Scripts/Utils'
import type { SelectProps } from 'antd/es/select';

const { Search } = Input

const ExpenseList = () => {
  const [Expenses, setExpenses] = useState<Expense[]>([])
  const [Materials, setMaterials] = useState<Material[]>([])
  const [Employees, setEmployees] = useState<Employee[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const filteredExpenses = ExpenseUtils.filterExpenses(Expenses, searchText)
  const filteredExpensesWithKeys = ExpenseUtils.addKeysToExpenses(filteredExpenses)

  const navigate = useNavigate()
  useTokenRenewal(navigate)

  useEffect(() => {
    ExpenseUtils.fetchAndSetExpenses(setExpenses)
    ExpenseUtils.fetchMaterialsAndEmployees(setMaterials, setEmployees)
  }, [visibleAdd])

  const availableMaterials = Materials.filter(
    (material) =>
      !Expenses.some((expense) => expense.materialId === material.id)
  )

  const materialOptions: SelectProps['options'] = availableMaterials.map(material => ({
    value: material.id,
    label: material.name,
  }));

  const columns = [
    {
      title: 'Concepto',
      dataIndex: 'concept',
      key: 'concept',
      sorter: (a: any, b: any) => a.concept.length - b.concept.length
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: Expense, b: Expense) => a.total - b.total
    },
    {
      title: 'Banco',
      dataIndex: 'bank',
      key: 'bank',
      sorter: (a: any, b: any) => a.Banco.length - b.Banco.length
    },
    {
      title: 'Fecha del gasto',
      dataIndex: 'dateExpense',
      key: 'dateExpense',
      render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
      sorter: (a: Expense, b: Expense) => new Date(a.dateExpense).getTime() - new Date(b.dateExpense).getTime()
    },
    {
      title: 'Material',
      dataIndex: 'materialId',
      key: 'materialId',
      render: (materialId: number) => Materials.find(m => m.id === materialId)?.name || 'Desconocido',
      sorter: (a: any, b: any) => a.Material.length - b.Material.length
    },
    {
      title: 'Acción',
      key: 'action',
      render: (record: Expense) => (
        <Space className="md:flex-wrap md:items-center" size="middle">
          <Button
            icon={<DatabaseOutlined className="text-green-700" />}
            onClick={() => ExpenseUtils.handleView(record.id, setSelectedExpense, setVisible)}
          />
          <Button
            icon={<EditOutlined className="text-blue-700" />}
            onClick={() => ExpenseUtils.handleEdit(record, setEditingExpense, editForm, setVisibleEdit)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-700" />}
            onClick={() => ExpenseUtils.handleDelete(record, Expenses, setExpenses)}
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <Modal
        title="Detalles del Gasto"
        open={visible}
        onCancel={() => ExpenseUtils.handleClose(setVisible)}
        footer={[]}
      >
        {selectedExpense && (
          <>
            <p><strong>Concepto:</strong> {selectedExpense.concept}</p>
            <p><strong>Total:</strong> {selectedExpense.total}</p>
            <p><strong>Banco:</strong> {selectedExpense.bank}</p>
            <p><strong>Fecha del gasto:</strong> {new Date(selectedExpense.dateExpense).toLocaleDateString('es-ES')}</p>
            <p><strong>Material:</strong> {Materials.find(m => m.id === selectedExpense.materialId)?.name || 'Desconocido'}</p>
          </>
        )}
      </Modal>

      <Drawer
        title="Editar Gasto"
        open={visibleEdit}
        onClose={() => ExpenseUtils.handleCloseEdit(editForm, setVisibleEdit)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                editForm
                  .validateFields()
                  .then((values) => {
                    ExpenseUtils.handleSave(
                      editForm,
                      editingExpense,
                      Expenses,
                      setExpenses,
                      setVisibleEdit,
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
          <Form.Item
            name="concept"
            label="Concepto"
            rules={[{ required: true, message: 'Por favor ingrese el concepto' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="total"
            label="Total"
            rules={[{ required: true, message: 'Por favor ingrese el total' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="bank"
            label="Banco"
            rules={[{ required: true, message: 'Por favor ingrese el banco' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateExpense"
            label="Fecha del gasto"
            rules={[{ required: true, message: 'Por favor confirme la fecha del gasto' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="materialId"
            label="Material"
            rules={[{ required: true, message: 'Por favor seleccione un material' }]}
          >
            <Select
              placeholder="Seleccione un material"
              options={materialOptions}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Añadir Nuevo Gasto"
        open={visibleAdd}
        onClose={() => ExpenseUtils.handleAddCancel(setVisibleAdd, addForm)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() =>
                ExpenseUtils.handleAddSave(
                  addForm,
                  setExpenses,
                  setVisibleAdd,
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
            name="concept"
            label="Concepto"
            rules={[{ required: true, message: 'Por favor ingrese el concepto' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="total"
            label="Total"
            rules={[{ required: true, message: 'Por favor ingrese el total' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="bank"
            label="Banco"
            rules={[{ required: true, message: 'Por favor ingrese el banco' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateExpense"
            label="Fecha del gasto"
            rules={[{ required: true, message: 'Por favor confirme la fecha del gasto' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="materialId"
            label="Material"
            rules={[{ required: true, message: 'Por favor seleccione un material' }]}
          >
            <Select
              placeholder="Seleccione un material"
              options={materialOptions}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-start">
          <h4 className="font-bold text-lg">Gastos</h4>
          <h6 className="text-sm">Lista de Gastos</h6>
        </div>
        <Button
          className="h-10 bg-indigo-900 rounded-md text-white text-base font-bold p-2 mt-4 md:mt-0 md:self-end"
          onClick={() => ExpenseUtils.handleAdd(setVisibleAdd)}
          icon={<PlusOutlined className="text-white font-bold" />}
        >
          Añadir nuevo Gasto
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
              const headers = ['ID', 'Concepto', 'Total', 'Banco', 'Fecha']
              const data = filteredExpensesWithKeys.map((e) => [
                e.id?.toString() || '',
                e.concept || '',
                `$${e.total || 0}`,
                e.bank || '',
                e.dateExpense ? new Date(e.dateExpense).toLocaleDateString('es-ES') : ''
              ])
              generatePDFTable('Lista de Gastos', headers, data, 'gastos')
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
            dataSource={filteredExpensesWithKeys}
            tableLayout="fixed"
          />
        </div>
      </Card>
    </>
  )
}

export default ExpenseList