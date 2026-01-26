import {
  fetchEmployeeDetails,
  updateEmployee,
  addEmployee,
  deleteEmployee,
  fetchImage,
  fetchEmployees
} from './Apicalls'
import { message, Modal } from 'antd'
import { Employee } from './Interfaces'
import axios from 'axios'
import { API_BASE_URL } from 'config/api.config'
import { FormInstance } from 'antd'

const { confirm } = Modal

export const fetchAndSetEmployees = async (
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
) => {
  try {
    const response = await fetchEmployees()
    setEmployees(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const roleMapping: Record<number, string> = {
  1: 'Administrador',
  2: 'Financiero',
  3: 'Auxiliar',
  4: 'Diseño',
  5: 'Corte',
  6: 'Impresion',
  7: 'Sublimado',
  8: 'Costura',
  9: 'Planchado',
  10: 'Acabado'
}

export const handleView = async (
  id: string,
  setSelectedEmployee: (employee: Employee | null) => void,
  setVisible: (visible: boolean) => void,
  setImage: (imageUrl: string) => void
) => {
  try {
    const employeeDetails = await fetchEmployeeDetails(id)
    const imageExtension = 'user'
    const imageName = employeeDetails.image
    if (imageName != null) {
      const img = await fetchImage(imageName, imageExtension)
      const imgURL = URL.createObjectURL(img)
      setImage(imgURL)
    }

    setSelectedEmployee({ ...employeeDetails })
    setVisible(true)
  } catch (error) {
    console.error('Error fetching employee details:', error)
  }
}

export const handleSave = async (
  editForm: FormInstance,
  editingEmployee: Employee | null,
  employees: Employee[],
  setEmployees: (employees: Employee[]) => void,
  setVisibleEdit: (visible: boolean) => void,
  file: File | null,
  setFile: (file: File | null) => void
) => {
  try {
    let imageFileName: string | null = null
    if (file) {
      try {
        imageFileName = await uploadImage(file)
        message.success('Imagen subida exitosamente')
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        message.error('Error al subir la imagen')
      }
    }
    const values = await editForm.validateFields()
    const updatedEmployeeData: Partial<Employee> = {
      ...values,
      ...(imageFileName ? { image: imageFileName } : {})
    }
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, updatedEmployeeData)
      message.success('Empleado actualizado exitosamente')

      const updatedEmployees = employees.map((employee: Employee) =>
        employee.id === editingEmployee.id
          ? { ...employee, ...updatedEmployeeData }
          : employee
      )

      setEmployees(updatedEmployees)
    } else {
      message.error('No hay empleado para actualizar')
    }
  } catch (error) {
    console.error('Error al actualizar el empleado:', error)
    message.error('Error al actualizar el empleado')
  } finally {
    setVisibleEdit(false)
    editForm.resetFields()
    setFile(null)
  }
}

export const handleAddSave = async (
  addForm: FormInstance,
  setEmployees: (employees: (prevEmployees: Employee[]) => Employee[]) => void,
  setVisibleAdd: (visible: boolean) => void,
  file: File | null,
  setFile: (file: File | null) => void
) => {
  try {
    const values = await addForm.validateFields()
    const { confirmPassword, ...employeeData } = values
    if (values.password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }
    let imageFileName: string | null = null
    if (file) {
      try {
        imageFileName = await uploadImage(file)
        message.success('Imagen subida exitosamente')
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        message.error('Error al subir la imagen')
      }
    }
    const employeeDataWithImage = {
      ...employeeData,
      ...(imageFileName ? { image: imageFileName } : {})
    }
    const response = await addEmployee(employeeDataWithImage)
    setEmployees((prevEmployees: Employee[]) => [...prevEmployees, response])
    message.success('Empleado agregado exitosamente')
  } catch (error: any) {
    console.error('Error adding employee:', error)
    message.error(
      error.response?.data.message || 'Error al agregar el empleado'
    )
  } finally {
    setVisibleAdd(false)
    addForm.resetFields()
    setFile(null)
  }
}

export const deleteUser = async (
  id: string,
  employees: Employee[],
  setEmployees: (employees: Employee[]) => void
) => {
  try {
    await deleteEmployee(id)
    message.success('Empleado eliminado exitosamente')
    const updatedEmployees = employees.filter((employee) => employee.id !== id)
    setEmployees(updatedEmployees)
  } catch (error) {
    console.error('Error deleting employee:', error)
    message.error('Error al eliminar el empleado')
  }
}

export const handleDelete = (
  record: Employee,
  employees: Employee[],
  setEmployees: (employees: Employee[]) => void
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar al empleado ${record.name} ${record.surname}?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      deleteUser(record.id, employees, setEmployees)
    }
  })
}

export const handleClose = (
  setVisible: (visible: boolean) => void,
  setImage: (image: string | null) => void
) => {
  setVisible(false)
  setImage(null)
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
  record: Employee,
  setEditingEmployee: (employee: Employee) => void,
  editForm: FormInstance,
  setVisibleEdit: (visibleEdit: boolean) => void
) => {
  try {
    setEditingEmployee(record)
    editForm.setFieldsValue(record)
    setVisibleEdit(true)
  } catch (error) {
    console.error('Error al editar el empleado:', error)
  }
}

export const filterEmployees = (
  employees: Employee[],
  searchText: string
): Employee[] => {
  return searchText
    ? employees.filter((employee) =>
        Object.values(employee).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : employees
}

export const addKeysToEmployees = (
  employees: Employee[]
): (Employee & { key: string })[] => {
  return employees.map((employee, index) => ({
    ...employee,
    key: index.toString()
  }))
}

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload/single/user`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.fileName
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    throw error
  }
}
