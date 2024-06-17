

import { message, Modal } from 'antd';
import { fetchQuotation, updateQuotation, addQuotation, addQuotationProduct, deleteQuotation, addQuotationProductMaquila } from 'components/Scripts/Apicalls'
import { Quotation,QuotationProduct, QuotationProductMaquila} from 'components/Scripts/Interfaces'
import { FormInstance } from 'antd';

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

export const handleAddSave = async (
  addForm: FormInstance, 
  dataSource: any[],
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>,
  setDataSource: React.Dispatch<React.SetStateAction<any[]>>,
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>
) => {
  try {
    const values = await addForm.validateFields();
    const newQuotation = await addQuotation(values);
    const hasQuotationProducts = dataSource.some((item) => 'tax' in item);
    const hasQuotationProductsMaquila = dataSource.some((item) => 'price_meter' in item);

    if (hasQuotationProducts) {
      for (const item of dataSource) {
        if ('tax' in item) {
          const pivotDataProduct: QuotationProduct = {
            description: item.description,
            quantity: item.quantity,
            amount: item.amount,
            tax: item.tax,
            total: item.total,
          };
          console.log(pivotDataProduct)

          await addQuotationProduct({
            ...pivotDataProduct,
            quotationId: newQuotation.id,
          });
        }
      }
    } else if (hasQuotationProductsMaquila) {
      for (const item of dataSource) {
        if ('price_meter' in item) {
          const pivotDataProductMaquila: QuotationProductMaquila = {
            description: item.description,
            quantity: item.quantity,
            meters_impression: item.meters_impression,
            price_unit: item.price_unit,
            price_meter: item.price_meter,
            amount: item.amount,
          };
          console.log(pivotDataProductMaquila)

          await addQuotationProductMaquila({
            ...pivotDataProductMaquila,
            quotationId: newQuotation.id,
          });
        }
      }
    }

    setQuotations((prevQuotations) => [...prevQuotations, newQuotation]);
    message.success('Cotización agregada exitosamente');
    setVisibleAdd(false);
    addForm.resetFields();
    setDataSource([]);
  } catch (error: any) {
    console.error('Error adding Quotation:', error);
    message.error(error.response?.data.message || 'Error al agregar la Cotización');
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

export const handleFieldChange = (value: any, key: string, column: string, dataSource: any[], setDataSource: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [column]: value });
  
      if (column === 'tax' && newData[index].tax > 0) {
        newData[index].total =
          newData[index].amount *
          newData[index].quantity *
          (1 + newData[index].tax / 100);
      } else {
        newData[index].total =
          newData[index].amount * newData[index].quantity;
      }
  
      setDataSource(newData);
    }
  };

  export const handleFieldChangeMaquila = (value: any, key: string, column: string, dataSource: any[], setDataSource: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, [column]: value });

        newData[index].price_meter = 120; 
        newData[index].meters_impression = parseFloat(newData[index].meters_impression) || 0;
        newData[index].quantity = parseFloat(newData[index].quantity) || 0;

        newData[index].price_unit = newData[index].price_meter * newData[index].meters_impression;

        if (isNaN(newData[index].price_unit)) {
            newData[index].price_unit = 0;
        }

        newData[index].amount = newData[index].price_unit * newData[index].quantity;

        if (isNaN(newData[index].amount)) {
            newData[index].amount = 0;
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

export const calculateSubtotalMaquila = (dataSource: any[]) => {
  const newSubtotal = dataSource.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
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
      amount: 0,
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

export const handleFinishMaquila = (addForm: any, dataSource: any[]) => {
  const newSubtotal = calculateSubtotalMaquila(dataSource);
  const newNetAmount = newSubtotal;
  const newTotal = newSubtotal;
  addForm.setFieldsValue({ subtotal: newSubtotal });
  addForm.setFieldsValue({ netAmount: newNetAmount });
  addForm.setFieldsValue({ total: newTotal });
  addForm.setFieldsValue({ tax: 0 });
  addForm.setFieldsValue({ advance: 0 });
};


