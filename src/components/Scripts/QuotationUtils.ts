


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