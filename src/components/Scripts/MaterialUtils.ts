import {
  addSupplier,
  addCategory,
  fetchMaterial,
  updateMaterial,
  addMaterial,
  deleteMaterial,
  addMaterialSize,
  fetchImage,
  fetchMaterials,
  fetchCategories,
  fetchSuppliers,
  fetchEmployees,
  fetchSizes
} from 'components/Scripts/Apicalls'
import { message, Modal, FormInstance } from 'antd'
import {
  Material,
  Supplier,
  SupplierAdd,
  Category,
  Employee,
  MaterialRends
} from './Interfaces'
import axios from 'axios'


const { confirm } = Modal

export const sizes: string[] = [
  '6', '8', '10', '12', '14', '16', '18', 'CH', 'M', 'G', 'XG', 'XXG', 'XXXG', '4XG'
];

export const fetchAndSetData = async (
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>,
  setUserName: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const [materials, categories, suppliers, users] = await Promise.all([
      fetchMaterials(),
      fetchCategories(),
      fetchSuppliers(),
      fetchEmployees()
    ])

    const enrichedMaterials = materials.map((material: Material) => ({
      ...material,
      categoryName: categories.find(
        (category: Category) => category.id === material.categoryId
      )?.name,
      supplierName: suppliers.find(
        (supplier: Supplier) => supplier.id === material.supplierId
      )?.name,
      userName: users.find((user: Employee) => user.id === material.userId)
        ?.name
    }))

    setMaterials(enrichedMaterials)
    setCategories(categories)
    setSuppliers(suppliers)
    setUserName(users[0]?.name || '')
  } catch (error) {
    console.error('Error fetching and setting data:', error)
  }
}

export const handleNewSupplierSubmit = async (
  newSupplier: SupplierAdd,
  setSuppliers: (suppliers: Supplier[]) => void,
  Suppliers: Supplier[],
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
  setCategories: (categories: Category[]) => void,
  categories: Category[],
  setIsAddCategoryModalVisible: (visible: boolean) => void,
  setNewCategoryName: (name: string) => void
) => {
  try {
    const response = await addCategory({ name: newCategoryName })
    setCategories([...categories, response])
    setIsAddCategoryModalVisible(false)
    setNewCategoryName('')
    message.success('Categoria agregada exitosamente')
  } catch (error) {
    console.error('There was an error adding the category!', error)
  }
}

export const handleView = async (
  id: string,
  setSelectedMaterial: (material: Material) => void,
  setVisible: (visible: boolean) => void,
  setImage: (imageUrl: string) => void
) => {
  try {
    const material = await fetchMaterial(id)
    const imageExtension = 'material'
    const imageName = material.image
    if (imageName != null) {
      const img = await fetchImage(imageName, imageExtension)
      const imgURL = URL.createObjectURL(img)
      setImage(imgURL)
    }
    setSelectedMaterial(material)
    setVisible(true)
  } catch (error) {
    console.error('Error fetching Material details:', error)
  }
}

export const handleSave = async (
  editingMaterial: Material | null,
  EditForm: FormInstance,
  Materials: Material[],
  setMaterials: (materials: Material[]) => void,
  setVisibleEdit: (visible: boolean) => void,
  file: File | null
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
        return
      }
    } else {
      console.warn('No se seleccionó ninguna imagen para subir.')
    }
    const values = await EditForm.validateFields()
    const updatedMaterialData = {
      ...values,
      ...(imageFileName ? { image: imageFileName } : {})
    }
    if (editingMaterial) {
      await updateMaterial(editingMaterial.id, updatedMaterialData)
      message.success('Material actualizado exitosamente')
      const updatedMaterials = Materials.map((material: Material) =>
        material.id === editingMaterial.id
          ? { ...material, ...updatedMaterialData }
          : material
      )
      setMaterials(updatedMaterials)
    } else {
      message.error('No hay empleado para actualizar')
    }
  } catch (error) {
    console.error('Error al actualizar el Material:', error)
    message.error('Error al actualizar el Material')
  } finally {
    setVisibleEdit(false)
    EditForm.resetFields()
  }
}

export const handleAddSave = async (
  addForm: FormInstance,
  setMaterials: (materials: Material[]) => void,
  Materials: Material[],
  setVisibleAdd: (visibleAdd: boolean) => void,
  file: File | null,
  setFile: (file: File | null) => void
) => {
  try {
    const values = await addForm.validateFields()
    let imageFileName: string | null = null
    if (file) {
      try {
        imageFileName = await uploadImage(file)
        message.success('Imagen subida exitosamente')
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        message.error('Error al subir la imagen')
        return
      }
    }

    const materialData = {
      ...values,
      ...(imageFileName ? { image: imageFileName } : {})
    }
    const response = await addMaterial(materialData)
    setMaterials([...Materials, response])
    message.success('Material agregado exitosamente')
  } catch (error: any) {
    console.error('Error al agregar el Material:', error)
    message.error(
      error.response?.data.message || 'Error al agregar el Material'
    )
  } finally {
    setVisibleAdd(false)
    addForm.resetFields()
    setFile(null)
  }
}

export const handleDeleteMaterial = async (
  id: number,
  Materials: Material[],
  setMaterials: (materials: Material[]) => void
) => {
  try {
    await deleteMaterial(id)
    message.success('Material eliminado exitosamente')
    const updatedMaterials = Materials.filter((Material) => Material.id !== id)
    setMaterials(updatedMaterials)
  } catch (error) {
    console.error('Error deleting Material:', error)
    message.error('Error al eliminar el Material')
  }
}

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
      handleDeleteMaterial(record.id, Materials, setMaterials)
    }
  })
}

export const handleEdit = async (
  record: Material,
  setEditingMaterial: (material: Material | null) => void,
  EditForm: FormInstance,
  setVisibleEdit: (visible: boolean) => void
) => {
  try {
    const formattedRecord = {
      ...record,
      dateReceipt: record.dateReceipt ? record.dateReceipt.split('T')[0] : null,
    }
    setEditingMaterial(formattedRecord)
    EditForm.setFieldsValue(formattedRecord)
    setVisibleEdit(true)
  } catch (error) {
    console.error('Error al editar el Material:', error)
  }
}

export const handleSaveMatSize = async (
  MaterialSizeform: FormInstance,
  selectedMaterial: Material | null,
  setVisibleMaterialSize: (visible: boolean) => void,
  materialRends: MaterialRends[] | null, 
  setMaterialRends: (materialRends: MaterialRends[]) => void,
  setUsedSizes: (usedSizes: string[]) => void 
) => {
  try {
    const values = await MaterialSizeform.validateFields();
    const materialSizeData = { ...values, materialId: selectedMaterial?.id };
    const newMaterialSize = await addMaterialSize(materialSizeData);
    setVisibleMaterialSize(false);
    message.success('Rendimiento agregado exitosamente');
    MaterialSizeform.resetFields();
    const updatedMaterialRends = materialRends
      ? [...materialRends, newMaterialSize]
      : [newMaterialSize];
    setMaterialRends(updatedMaterialRends);
    
  } catch (error) {
    console.error('Error saving material size:', error);
  } finally {
    if (selectedMaterial) {
      try {
        const fetchedsizes = await fetchSizes(selectedMaterial.id);
        const usedSizes = fetchedsizes.map((size: MaterialRends) => size.size);
        setUsedSizes(usedSizes);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    }
    setVisibleMaterialSize(true);
  }
};

export const handleCloseMaterialSize = (
  MaterialSizeform: FormInstance,
  setVisibleMaterialSize: (visible: boolean) => void
) => {
  setVisibleMaterialSize(false)
  MaterialSizeform.resetFields()
}

export const openMaterialSizeModal = async (
  setVisibleMaterialSize: (visible: boolean) => void
) => {
  setVisibleMaterialSize(true)
}
 
export const openMaterialRends = async (
  record: Material,
  setVisibleMaterialRen: (visible: boolean) => void,
  setMaterialRends: (materialRends: MaterialRends[] | null) => void,
  setSelectedMaterial: (material: Material) => void, 
  setUsedSizes: (usedSizes: string[]) => void 
) => {
  setSelectedMaterial(record) 
  setVisibleMaterialRen(true)
  try {
    const fetchedsizes = await fetchSizes(record.id)
    setMaterialRends(fetchedsizes)
    const usedSizes = fetchedsizes.map((size: MaterialRends) => size.size)
    setUsedSizes(usedSizes)
  } catch (error) {
    console.error('Error fetching sizes:', error)
  }
}

export const handleAddCancel = (
  setVisibleAdd: (visible: boolean) => void,
  EditForm: FormInstance,
  addForm: FormInstance
) => {
  setVisibleAdd(false)
  EditForm.resetFields()
  addForm.resetFields()
}

export const handleCloseEdit = (
  setVisibleEdit: (visible: boolean) => void,
  EditForm: FormInstance
) => {
  EditForm.resetFields()
  setVisibleEdit(false)
}

export const handleClose = (
  setVisible: (visible: boolean) => void,
  setImage: (image: string | null) => void
) => {
  setVisible(false)
  setImage(null)
}

export const handleAdd = (setVisibleAdd: (visible: boolean) => void) => {
  setVisibleAdd(true)
}

export const filterMaterials = (
  materials: Material[],
  searchText: string
): Material[] => {
  return searchText
    ? materials.filter((material) =>
        Object.values(material).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : materials
}

export const addKeysToMaterials = (
  materials: Material[]
): (Material & { key: string })[] => {
  return materials.map((material, index) => ({
    ...material,
    key: index.toString()
  }))
}

export const getAvailableSizes = (usedSizes: string[]): string[] => {
  return sizes.filter(size => !usedSizes.includes(size));
};

export const getSupplierName = (id: string, suppliers: Supplier[]): string => {
  const supplier = suppliers.find(supplier => supplier.id === id);
  return supplier ? supplier.name : 'Desconocido';
};

export const getCategoryName = (id: string, categories: Category[]): string => {
  const category = categories.find(category => category.id === id);
  return category ? category.name : 'Desconocido';
};

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      'http://62.72.51.60/api/upload/single/material',
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
