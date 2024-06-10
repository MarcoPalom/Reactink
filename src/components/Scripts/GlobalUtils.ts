//Utiles logicos

export const handleClose = (setVisible: any) => {
    setVisible(false);
};

export const handleCloseEdit = (EditForm: any, setVisibleEdit: any) => {
    EditForm.resetFields();
    setVisibleEdit(false);
};

export const handleAdd = (setVisibleAdd: any) => {
    setVisibleAdd(true);
};