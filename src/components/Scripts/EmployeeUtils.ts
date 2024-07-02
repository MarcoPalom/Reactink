import {
  fetchEmployeeDetails,
  updateEmployee,
  addEmployee,
  deleteEmployee
} from './Apicalls'
import { message, Modal } from 'antd'
import { Employee } from './Interfaces'

const { confirm } = Modal;


export const handleView = async (
  id: string,
  setSelectedEmployee: any,
  setVisible: (visible: boolean) => void
) => {
  try {
    const employeeDetails = await fetchEmployeeDetails(id)
    setSelectedEmployee(employeeDetails)
    setVisible(true)
  } catch (error) {
    console.error('Error fetching employee details:', error)
  }
}

export const handleSave = async (
  EditForm: any,
  editingEmployee: any,
  employees: any[],
  setEmployees: (employees: any[]) => void,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    const values = await EditForm.validateFields()
    const response = await updateEmployee(editingEmployee?.id, values)

    message.success('Empleado actualizado exitosamente')
    const updatedEmployees = employees.map((employee) =>
      employee.id === editingEmployee?.id
        ? { ...employee, ...values }
        : employee
    )
    setEmployees(updatedEmployees)
    setVisibleEdit(false)
    EditForm.resetFields()
  } catch (error) {
    console.error('Error updating employee:', error)
    message.error('Error al actualizar el empleado')
  }
}

export const handleAddSave = async (
  addForm: any,
  setEmployees: (employees: (prevEmployees: Employee[]) => Employee[]) => void,
  setVisibleAdd: (visible: boolean) => void
) => {
  try {
    const values = await addForm.validateFields()
    if (values.password !== values.confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }
    const employeeData = {
      ...values
    }
    const response = await addEmployee(employeeData)
    setEmployees((prevEmployees: any) => [...prevEmployees, response])
    message.success('Empleado agregado exitosamente')
    setVisibleAdd(false)
    addForm.resetFields()
  } catch (error: any) {
    console.error('Error adding employee:', error)
    message.error(
      error.response?.data.message || 'Error al agregar el empleado'
    )
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
        deleteUser(record.id, employees, setEmployees);
      },
    });
  };

  export const handleClose = (
    setVisible: (visible: boolean) => void
  ) => {
    setVisible(false);
  };
  
  export const handleCloseEdit = (
    EditForm: any,
    setVisibleEdit: (visible: boolean) => void
  ) => {
    EditForm.resetFields();
    setVisibleEdit(false);
  };
  
  export const handleAdd = (
    setVisibleAdd: (visible: boolean) => void
  ) => {
    setVisibleAdd(true);
  };
  
  export const handleAddCancel = (
    setVisibleAdd: (visible: boolean) => void,
    EditForm: any,
    addForm: any
  ) => {
    setVisibleAdd(false);
    EditForm.resetFields();
    addForm.resetFields();
  };
  
  export const handleEdit = async (
    record: Employee,
    setEditingEmployee: (employee: Employee) => void,
    EditForm: any,
    setVisibleEdit: (visible: boolean) => void
  ) => {
    try {
      setEditingEmployee(record);
      EditForm.setFieldsValue(record);
      setVisibleEdit(true);
    } catch (error) {
      console.error('Error al editar el empleado:', error);
    }
  };

  export const filterEmployees = (employees: Employee[], searchText: string): Employee[] => {
    return searchText
      ? employees.filter((employee) =>
          Object.values(employee).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )
      : employees;
  };
  
  export const addKeysToEmployees = (employees: Employee[]): (Employee & { key: string })[] => {
    return employees.map((employee, index) => ({
      ...employee,
      key: index.toString()
    }));
  };