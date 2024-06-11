

import { message, Modal } from 'antd';
import { fetchQuotation, updateQuotation, addQuotation, addQuotationProduct, deleteQuotation } from 'components/Scripts/Apicalls'

const { confirm } = Modal;

//utils

export const filterQuotations = (Quotations: any[], searchText: string) => {
  return searchText
    ? Quotations.filter((Quotation) =>
        Quotation.id.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : Quotations;
};

export const addKeysToQuotations = (Quotations: any[]) => {
  return Quotations.map((Quotation, index) => ({
    ...Quotation,
    key: index.toString()
  }));
};

//handlers de cotizacion

export const handleView = async (id: string, setSelectedQuotation: any, setVisible: any) => {
  try {
    const data = await fetchQuotation(id);
    console.log(data);
    setSelectedQuotation(data);
    setVisible(true);
  } catch (error) {
    console.error('Error fetching Quotation details:', error);
  }
};

export const handleSave = async (EditForm: any, editingQuotation: any, Quotations: any, setQuotations: any, setVisibleEdit: any) => {
  try {
    const values = await EditForm.validateFields();
    const updatedQuotation = await updateQuotation(editingQuotation.id, values);
    message.success('Cotizacion actualizado exitosamente');
    const updatedQuotations = Quotations.map((Quotation: any) =>
      Quotation.id === editingQuotation.id ? { ...Quotation, ...values } : Quotation
    );
    setQuotations(updatedQuotations);
    setVisibleEdit(false);
    EditForm.resetFields();
  } catch (error) {
    console.error('Error updating Quotation:', error);
    message.error('Error al actualizar la Cotizacion');
  }
};

export const handleAddSave = async (addForm: any, dataSource: any, setQuotations: any, setVisibleAdd: any) => {
  try {
    const values = await addForm.validateFields();
    if (values.password !== values.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const newQuotation = await addQuotation(values);
    for (const item of dataSource) {
      const pivotDataProduct = {
        quotationId: newQuotation.id,
        description: item.description,
        quantity: item.quantity,
        amount: item.unitPrice,
        tax: item.tax,
        total: item.total,
      };
      console.log(pivotDataProduct);
      await addQuotationProduct(pivotDataProduct);
    }

    setQuotations((prevQuotations: any) => [...prevQuotations, newQuotation]);
    message.success('Cotizacion agregado exitosamente');
    setVisibleAdd(false);
    addForm.resetFields();
  } catch (error: any) {
    console.error('Error adding Quotation:', error);
    message.error(error.response?.data.message || 'Error al agregar la Cotizacion');
  }
};

export const handleDelete = (record: any, deletequotation: any, Quotations: any, setQuotations: any) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar la cotizacion?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      await deletequotation(record.id);
      const updatedQuotations = Quotations.filter(
        (Quotation: any) => Quotation.id !== record.id
      );
      setQuotations(updatedQuotations);
    },
  });
};

export const handleEdit = (record: any, setEditingQuotation: any, EditForm: any, setVisibleEdit: any) => {
  try {
    setEditingQuotation(record);
    EditForm.setFieldsValue(record);
    setVisibleEdit(true);
  } catch (error) {
    console.error('Error al editar la Cotizacion:', error);
  }
};

//Funciones Matematicas calcular cotizaciones

export const handleFieldChange = (value: any, key: string, column: string, dataSource: any[], setDataSource: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [column]: value });
  
      if (column === 'tax' && newData[index].tax > 0) {
        newData[index].total =
          newData[index].unitPrice *
          newData[index].quantity *
          (1 + newData[index].tax / 100);
      } else {
        newData[index].total =
          newData[index].unitPrice * newData[index].quantity;
      }
  
      setDataSource(newData);
    }
  };

  export const calculateSubtotal = (dataSource: any[]) => {
    const newSubtotal = dataSource.reduce(
        (acc, item) => acc + parseFloat(item.total || 0),
        0
    );
    return newSubtotal;
};
  
  export const calculateTaxAndNetAmount = (addForm: any) => {
    const subtotal = addForm.getFieldValue('subtotal') || 0;
    const taxPercentage = addForm.getFieldValue('tax') || 0;
  
    if (isNaN(subtotal) || isNaN(taxPercentage)) {
      return 0;
    }
  
    const taxAmount = (subtotal * taxPercentage) / 100;
    const newNetAmount = subtotal + taxAmount;
    return newNetAmount;
  };
  
  export const calculateTotal = (addForm: any) => {
    const netAmount = addForm.getFieldValue('netAmount') || 0;
    const advance = addForm.getFieldValue('advance') || 0;
  
    if (isNaN(netAmount) || isNaN(advance)) {
      return 0;
    }
    const newTotal = netAmount - advance;
    return newTotal;
  };



//Funciones Tabla añadir cotizacion botones

export const handleAddRow = (count: number,setCount: any, setDataSource: any, dataSource: any[]) => {
    const newRow = {
      key: count,
      description: '',
      unitPrice: 0,
      quantity: 0,
      total: 0
    };
    setDataSource([...dataSource, newRow]);
    setCount(count + 1);
  };
  
  export const handleEmpty = (confirm: any, setDataSource: any) => {
    confirm({
      title: 'Confirmación de Eliminación',
      content: `¿Estás seguro de que quieres limpiar la tabla?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setDataSource([]);
      }
    });
  };
  
  export const handleFinish = (addForm: any, dataSource: any[]) => {
    const newSubtotal = calculateSubtotal(dataSource);
    const newNetAmount = newSubtotal;
    const newTotal = newSubtotal;
    addForm.setFieldsValue({ subtotal: newSubtotal });
    addForm.setFieldsValue({ netAmount: newNetAmount });
    addForm.setFieldsValue({ total: newTotal });
    addForm.setFieldsValue({ tax: 0 });
    addForm.setFieldsValue({ advance: 0 });
};