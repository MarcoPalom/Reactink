import { addSupplier, addCategory, fetchMaterial, updateMaterial, addMaterial, deleteMaterial, addMaterialSize } from 'components/Scripts/Apicalls'
import { message, Modal,FormInstance  } from 'antd'
import { Material,MaterialSize } from './Interfaces'


const { confirm } = Modal

export const handleSaveMatSize = async (
  MaterialSizeform: FormInstance,
  selectedMaterial: Material | null,
  setVisibleMaterialSize: (visible: boolean) => void
) => {
  try {
    const values = await MaterialSizeform.validateFields();
    const materialSizeData = { ...values, materialId: selectedMaterial?.id };
    await addMaterialSize(materialSizeData);
    setVisibleMaterialSize(false);
    message.success('Rendimiento agregado exitosamente')
    MaterialSizeform.resetFields();
  } catch (error) {
    console.error('Error saving material size:', error);
  }
};

export const handleNewSupplierSubmit = async (
  newSupplier: any,
  setSuppliers: (suppliers: any[]) => void,
  Suppliers: any[],
  setIsAddSupplierModalVisible: (visible: boolean) => void
) => {
  try {
    const response = await addSupplier(newSupplier)
    const createdSupplier = { ...newSupplier, id: response.id }
    setSuppliers([...Suppliers, createdSupplier])
    setIsAddSupplierModalVisible(false)
    message.success('Categoria agregada exitosamente')
  } catch (error) {
    console.error('There was an error adding the Supplier!', error)
  }
}

export const handleNewCategorySubmit = async (
  newCategoryName: string,
  setCategories: (categories: any[]) => void,
  categories: any[],
  setIsAddCategoryModalVisible: (visible: boolean) => void,
  setNewCategoryName: (name: string) => void
) => {
  try {
    const response = await addCategory({ name: newCategoryName });
    setCategories([...categories, response]);
    setIsAddCategoryModalVisible(false);
    setNewCategoryName('');
    message.success('Categoria agregada exitosamente')
  } catch (error) {
    console.error('There was an error adding the category!', error);
  }
};

export const handleView = async (
  id: string,
  setSelectedMaterial: (material: any) => void,
  setVisible: (visible: boolean) => void
) => {
  try {
    const material = await fetchMaterial(id);
    setSelectedMaterial(material);
    setVisible(true);
  } catch (error) {
    console.error('Error fetching Material details:', error);
  }
};

export const handleSave = async (
  editingMaterial: any,
  EditForm: FormInstance,
  Materials: any[],
  setMaterials: (materials: any[]) => void,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    const values = await EditForm.validateFields();
    await updateMaterial(editingMaterial.id, values);
    message.success('Material actualizado exitosamente');
    const updatedMaterials = Materials.map((Material) =>
      Material.id === editingMaterial.id ? { ...Material, ...values } : Material
    );
    setMaterials(updatedMaterials);
    setVisibleEdit(false);
    EditForm.resetFields();
  } catch (error) {
    console.error('Error updating Material:', error);
    message.error('Error al actualizar el Material');
  }
};

export const handleAddSave = async (
  addForm: FormInstance,
  setMaterials: (materials: any[]) => void,
  Materials: any[],
  setVisibleAdd: (visible: boolean) => void
) => {
  try {
    const values = await addForm.validateFields();
    const MaterialData = { ...values };

    const response = await addMaterial(MaterialData);
    setMaterials([...Materials, response]);
    message.success('Material agregado exitosamente');
    setVisibleAdd(false);
    addForm.resetFields();
  } catch (error: any) {
    console.error('Error adding Material:', error);
    message.error(error.response?.data.message || 'Error al agregar el Material');
  }
};

export const handleDeleteMaterial = async (
  id: string,
  Materials: any[],
  setMaterials: (materials: any[]) => void
) => {
  try {
    await deleteMaterial(id);
    message.success('Material eliminado exitosamente');
    const updatedMaterials = Materials.filter((Material) => Material.id !== id);
    setMaterials(updatedMaterials);
  } catch (error) {
    console.error('Error deleting Material:', error);
    message.error('Error al eliminar el Material');
  }
};


export const handleDelete = (
  record: Material,
  Materials: Material[],
  setMaterials: (materials: Material[]) => void
) => {
  confirm({
    title: 'Confirmación de Eliminación',
    content: `¿Estás seguro de que quieres eliminar al Material ${record.name}?`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      handleDeleteMaterial(record.id, Materials, setMaterials);
    }
  });
};

export const handleEdit = async (
  record: Material,
  setEditingMaterial: (material: Material | null) => void,
  EditForm: FormInstance,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    setEditingMaterial(record);
    EditForm.setFieldsValue(record);
    setVisibleEdit(true);
  } catch (error) {
    console.error('Error al editar el Material:', error);
  }
};


export const handleCloseMaterialSize = (
  MaterialSizeform: FormInstance,
  setVisibleMaterialSize: (visible: boolean) => void
) => {
  setVisibleMaterialSize(false);
  MaterialSizeform.resetFields();
};

export const openMaterialSizeModal = (
  material: Material,
  setSelectedMaterial: (material: Material | null) => void,
  setVisibleMaterialSize: (visible: boolean) => void
) => {
  setSelectedMaterial(material);
  setVisibleMaterialSize(true);
};

export const handleAddCancel = (
  setVisibleAdd: (visible: boolean) => void,
  EditForm: FormInstance,
  addForm: FormInstance
) => {
  setVisibleAdd(false);
  EditForm.resetFields();
  addForm.resetFields();
};

export const handleCloseEdit = (
  setVisibleEdit: (visible: boolean) => void,
  EditForm: FormInstance
) => {
  EditForm.resetFields();
  setVisibleEdit(false);
};

export const handleClose = (setVisible: (visible: boolean) => void) => {
  setVisible(false);
};

export const handleAdd = (setVisibleAdd: (visible: boolean) => void) => {
  setVisibleAdd(true);
};

export const filterMaterials = (materials: Material[], searchText: string): Material[] => {
  return searchText
    ? materials.filter((material) =>
        Object.values(material).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : materials;
};

export const addKeysToMaterials = (materials: Material[]): (Material & { key: string })[] => {
  return materials.map((material, index) => ({
    ...material,
    key: index.toString()
  }));
};