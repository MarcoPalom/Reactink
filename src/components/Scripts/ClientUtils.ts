import {fetchClientDetails,updateClient,addClient,deleteClient} from 'components/Scripts/Apicalls'
import { message } from 'antd';
import {Client} from  'components/Scripts/Interfaces'
import { AxiosError } from 'axios';
import { Modal } from 'antd';


const { confirm } = Modal;

export const handleView = async (id:string, setSelectedClient:any, setVisible:any) => {
    try {
      const clientDetails = await fetchClientDetails(id);
      setSelectedClient(clientDetails);
      setVisible(true);
    } catch (error) {
      console.error('Error fetching Client details:', error);
    }
  };



export const handleSave = async (EditForm:any, editingClient:any, Clients:any, setClients:any, setVisibleEdit:any) => {
  try {
    const values = await EditForm.validateFields();
    await updateClient(editingClient?.id, values);
    message.success('Cliente actualizado exitosamente');

    const updatedClients = Clients.map((Client:any) =>
      Client.id === editingClient?.id ? { ...Client, ...values } : Client
    );

    setClients(updatedClients);
    setVisibleEdit(false);
    EditForm.resetFields();
  } catch (error) {
    console.error('Error updating Client:', error);
    message.error('Error al actualizar el Cliente');
  }
};

export const handleAddSave = async (addForm:any, setClients:any, setVisibleAdd:any) => {
    try {
      const values = await addForm.validateFields();
      const ClientData = {
        ...values
      };
  
      const response = await addClient(ClientData);
      setClients((prevClients:any) => [...prevClients, response]);
      message.success('Cliente agregado exitosamente');
      setVisibleAdd(false);
      addForm.resetFields();
    } catch (error) {
        console.error('Error adding Client:', error);
        if (error instanceof AxiosError) {
          message.error(
            error.response?.data.message || 'Error al agregar el Cliente'
          );
        } else {
          message.error('Error desconocido al agregar el Cliente');
        }
      }
    };

    export const handleDeleteClient = async (id:string, Clients:any, setClients:any) => {
        try {
          await deleteClient(id);
          message.success('Cliente eliminado exitosamente');
          
          const updatedClients = Clients.filter((Client:any) => Client.id !== id);
          setClients(updatedClients);
        } catch (error) {
          console.error('Error deleting Client:', error);
          
          if (error instanceof AxiosError) {
            message.error(error.response?.data.message || 'Error al eliminar el Cliente');
          } else {
            message.error('Error desconocido al eliminar el Cliente');
          }
        }
      };


      export const handleDelete = (record:any, Clients:any, setClients:any) => {
        confirm({
          title: 'Confirmación de Eliminación',
          content: `¿Estás seguro de que quieres eliminar al Cliente ${record.name} ${record.surname}?`,
          okText: 'Eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            handleDeleteClient(record.id, Clients, setClients);
          },
        });
      };

      export const handleEdit = async (record:any, setEditingClient:any, EditForm:any, setVisibleEdit:any) => {
        try {
          setEditingClient(record);
          EditForm.setFieldsValue(record);
          setVisibleEdit(true);
        } catch (error) {
          console.error('Error al editar el Cliente:', error);
        }
      };


      export const handleClose = (setVisible:any) => {
        setVisible(false);
      };

      export const handleCloseEdit = (EditForm:any, setVisibleEdit:any) => {
        EditForm.resetFields();
        setVisibleEdit(false);
      };

      export const handleAdd = (setVisibleAdd:any) => {
        setVisibleAdd(true);
      };

      export const handleAddCancel = (EditForm:any, addForm:any, setVisibleAdd:any) => {
        setVisibleAdd(false);
        EditForm.resetFields();
        addForm.resetFields();
      };

      export const filterClients = (Clients:any, searchText:any) => {
        return searchText
          ? Clients.filter((Client:any) =>
              Object.values(Client).some(
                (value) =>
                  typeof value === 'string' &&
                  value.toLowerCase().includes(searchText.toLowerCase())
              )
            )
          : Clients;
      };

      export const addKeysToFilteredClients = (filteredClients:any) => {
        return filteredClients.map((Client:any, index:number) => ({
          ...Client,
          key: index.toString(),
        }));
      };