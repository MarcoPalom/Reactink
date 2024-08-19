import {
  fetchClientDetails,
  updateClient,
  addClient,
  deleteClient,
  fetchClients
} from 'components/Scripts/Apicalls'
import { message } from 'antd'
import { Client } from 'components/Scripts/Interfaces'
import { AxiosError } from 'axios'
import { Modal } from 'antd'
import { FormInstance } from 'antd'

const { confirm } = Modal

export const fetchAndSetClients = async (setClients: React.Dispatch<React.SetStateAction<Client[]>>) => {
  try {
    const response = await fetchClients()
    setClients(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}


export const handleView = async (
  id: string,
  setSelectedClient: (client: Client | null) => void,
  setVisible: (visible: boolean) => void
) => {
  try {
    const clientDetails = await fetchClientDetails(id)
    setSelectedClient(clientDetails)
    setVisible(true)
  } catch (error) {
    console.error('Error fetching Client details:', error)
  }
}

export const handleSave = async (
  EditForm: FormInstance,
  editingClient: Client | null,
  Clients: Client[],
  setClients: (clients: Client[]) => void,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    const values = await EditForm.validateFields()
    if (editingClient) {
      await updateClient(editingClient?.id, values)
      message.success('Cliente actualizado exitosamente')

      const updatedClients = Clients.map((Client: any) =>
        Client.id === editingClient?.id ? { ...Client, ...values } : Client
      )

      setClients(updatedClients)
    } else {
      message.error('No hay cliente para actualizar')
    }
    setVisibleEdit(false)
    EditForm.resetFields()
  } catch (error) {
    console.error('Error updating Client:', error)
    message.error('Error al actualizar el Cliente')
  }
}


export const handleAddSave = async (
  addForm: FormInstance,
  setClients: React.Dispatch<React.SetStateAction<Client[]>>,
  setVisibleAdd: (visible: boolean) => void,
) => {
  try {
    const values = await addForm.validateFields()
    const ClientData = {
      ...values
    }

    const response = await addClient(ClientData)
    setClients((prevClients) => [...prevClients, response])
    message.success('Cliente agregado exitosamente')
    setVisibleAdd(false)
    addForm.resetFields()
  } catch (error) {
    console.error('Error adding Client:', error)
    if (error instanceof AxiosError) {
      message.error(
        error.response?.data.message || 'Error al agregar el Cliente'
      )
    } else {
      message.error('Error desconocido al agregar el Cliente')
    }
  }
}

export const handleDeleteClient = async (
  id: string,
  Clients: Client[],
  setClients: (clents: Client[]) => void
) => {
  try {
    await deleteClient(id)
    message.success('Cliente eliminado exitosamente')

    const updatedClients = Clients.filter((Client: any) => Client.id !== id)
    setClients(updatedClients)
  } catch (error) {
    console.error('Error deleting Client:', error)

    if (error instanceof AxiosError) {
      message.error(
        error.response?.data.message || 'Error al eliminar el Cliente'
      )
    } else {
      message.error('Error desconocido al eliminar el Cliente')
    }
  }
}

export const handleDelete = (record: Client, Clients: Client[], setClients: (clents: Client[]) => void) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar al Cliente ${record.name} ${record.surname}?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      handleDeleteClient(record.id, Clients, setClients)
    }
  })
}


export const handleEdit = async (
  record: Client,
  setEditingClient: (clents: Client) => void,
  EditForm: FormInstance,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    setEditingClient(record)
    EditForm.setFieldsValue(record)
    setVisibleEdit(true)
  } catch (error) {
    console.error('Error al editar el Cliente:', error)
  }
}

export const handleClose = (setVisible: (visible: boolean) => void) => {
  setVisible(false)
}

export const handleCloseEdit = (EditForm: FormInstance, setVisibleEdit: (visibleEdit: boolean) => void) => {
  EditForm.resetFields()
  setVisibleEdit(false)
}

export const handleAdd = (setVisibleAdd: (visibleAdd: boolean) => void) => {
  setVisibleAdd(true)
}

export const handleAddCancel = (
  addForm: FormInstance,
  setVisibleAdd: (visibleAdd: boolean) => void
) => {
  setVisibleAdd(false)
  addForm.resetFields()
}

export const filterClients = (Clients: Client[], searchText: string) => {
  return searchText
    ? Clients.filter((Client) =>
        Object.values(Client).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : Clients
}

export const addKeysToFilteredClients = (filteredClients: any) => {
  return filteredClients.map((Client: any, index: number) => ({
    ...Client,
    key: index.toString()
  }))
}
