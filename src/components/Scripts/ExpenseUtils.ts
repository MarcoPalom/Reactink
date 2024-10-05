import {
    fetchExpenseDetails,
    updateExpense,
    addExpense,
    deleteExpense,
    fetchExpenses,
    fetchMaterials,
    fetchEmployees
  } from './Apicalls'
  import { message, Modal } from 'antd'
  import { Expense, Material, Employee } from './Interfaces'
  import { FormInstance } from 'antd'
  
  const { confirm } = Modal
  
  export const fetchAndSetExpenses = async (
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  ) => {
    try {
      const response = await fetchExpenses()
      setExpenses(response)
    } catch (error) {
      console.error('Error fetching and setting expenses:', error)
    }
  }
  
  export const fetchMaterialsAndEmployees = async (
    setMaterials: React.Dispatch<React.SetStateAction<Material[]>>,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  ) => {
    try {
      const [materials, employees] = await Promise.all([
        fetchMaterials(),
        fetchEmployees()
      ])
  
      const enrichedMaterials = materials.map((material: Material) => ({
        ...material,
        employeeName: employees.find((employee: Employee) => employee.id === material.userId)?.name || 'Desconocido'
      }))
  
      setMaterials(enrichedMaterials)
      setEmployees(employees)
    } catch (error) {
      console.error('Error fetching materials and employees:', error)
    }
  }
  
  export const handleView = async (
    id: number,
    setSelectedExpense: (expense: Expense | null) => void,
    setVisible: (visible: boolean) => void,
  ) => {
    try {
      const expenseDetails = await fetchExpenseDetails(id)
      setSelectedExpense({ ...expenseDetails })
      setVisible(true)
    } catch (error) {
      console.error('Error fetching expense details:', error)
    }
  }
  
  export const handleSave = async (
    editForm: FormInstance,
    editingExpense: Expense | null,
    expenses: Expense[],
    setExpenses: (expenses: Expense[]) => void,
    setVisibleEdit: (visible: boolean) => void
  ) => {
    try {
      const values = await editForm.validateFields()
      const updatedExpenseData: Partial<Expense> = { ...values }
      if (editingExpense) {
        await updateExpense(editingExpense.id, updatedExpenseData)
        message.success('Gasto actualizado exitosamente')
  
        const updatedExpenses = expenses.map((expense: Expense) =>
          expense.id === editingExpense.id
            ? { ...expense, ...updatedExpenseData }
            : expense
        )
  
        setExpenses(updatedExpenses)
      } else {
        message.error('No hay Gasto para actualizar')
      }
    } catch (error) {
      console.error('Error al actualizar el Gasto:', error)
      message.error('Error al actualizar el Gasto')
    } finally {
      setVisibleEdit(false)
      editForm.resetFields()
    }
  }
  
  export const handleAddSave = async (
    addForm: FormInstance,
    setExpenses: (expenses: (prevExpenses: Expense[]) => Expense[]) => void,
    setVisibleAdd: (visible: boolean) => void
  ) => {
    try {
      const values = await addForm.validateFields()
      const { confirmPassword, ...expenseData } = values
      if (values.password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }
      const response = await addExpense(expenseData)
      setExpenses((prevExpenses: Expense[]) => [...prevExpenses, response])
      message.success('Gasto agregado exitosamente')
    } catch (error: any) {
      console.error('Error adding expense:', error)
      message.error(
        error.response?.data.message || 'Error al agregar el Gasto'
      )
    } finally {
      setVisibleAdd(false)
      addForm.resetFields()
    }
  }
  
  export const handleDelete = (
    record: Expense,
    expenses: Expense[],
    setExpenses: (expenses: Expense[]) => void
  ) => {
    confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres eliminar al Gasto ${record.id}?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteExpense(record.id)
          .then(() => {
            message.success('Gasto eliminado exitosamente')
            const updatedExpenses = expenses.filter((expense) => expense.id !== record.id)
            setExpenses(updatedExpenses)
          })
          .catch((error) => {
            console.error('Error deleting expense:', error)
            message.error('Error al eliminar el Gasto')
          })
      }
    })
  }
  
  export const handleClose = (
    setVisible: (visible: boolean) => void
  ) => {
    setVisible(false)
  }
  
  export const handleCloseEdit = (
    editForm: FormInstance,
    setVisibleEdit: (visibleEdit: boolean) => void
  ) => {
    editForm.resetFields()
    setVisibleEdit(false)
  }
  
  export const handleAdd = (setVisibleAdd: (visibleAdd: boolean) => void) => {
    setVisibleAdd(true)
  }
  
  export const handleAddCancel = (
    setVisibleAdd: (visibleAdd: boolean) => void,
    addForm: FormInstance
  ) => {
    setVisibleAdd(false)
    addForm.resetFields()
  }
  
  export const handleEdit = async (
    record: Expense,
    setEditingExpense: (expense: Expense) => void,
    editForm: FormInstance,
    setVisibleEdit: (visibleEdit: boolean) => void
  ) => {
    try {
      setEditingExpense(record)
      editForm.setFieldsValue(record)
      setVisibleEdit(true)
    } catch (error) {
      console.error('Error al editar el Gasto:', error)
    }
  }
  
  export const filterExpenses = (
    expenses: Expense[],
    searchText: string
  ): Expense[] => {
    return searchText
      ? expenses.filter((expense) =>
          Object.values(expense).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )
      : expenses
  }
  
  export const addKeysToExpenses = (
    expenses: Expense[]
  ): (Expense & { key: string })[] => {
    return expenses.map((expense, index) => ({
      ...expense,
      key: index.toString()
    }))
  }