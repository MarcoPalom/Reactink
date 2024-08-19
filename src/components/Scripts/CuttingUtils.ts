import { fetchOrders,fetchOrder,fetchQuotationOrder,fetchMaterials,fetchQuotations,fetchImage} from 'components/Scripts/Apicalls'
import { CuttingOrderData,FormDataShirtView,Quotation,Material,quotationDesigns } from 'components/Scripts/Interfaces'


export const fetchAndSetOrders = async (setOrders: React.Dispatch<React.SetStateAction<CuttingOrderData[]>>) => {
    try {
      const response = await fetchOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error fetching and setting quotations:', error)
    }
  }

  export const fetchAndSetQuotations = async (setDesigns: React.Dispatch<React.SetStateAction<quotationDesigns[]>>) => {
    try {
      const response = await fetchQuotations();
      const allDesigns = response.map((quotation: any) => quotation.quotationDesigns).flat();
      setDesigns(allDesigns);
    } catch (error) {
      console.error('Error fetching and setting quotations:', error);
    }
  };
  
  export const fetchAndSetMaterials = async (setMaterials: React.Dispatch<React.SetStateAction<Material[]>>) => {
    try {
      const response = await fetchMaterials();
      setMaterials(response);
    } catch (error) {
      console.error('Error fetching and setting materials:', error);
    }
  };

  export const handleSelectChange = async (
    value: number,
    quotationProducts: FormDataShirtView[],
    designs: quotationDesigns[],
    setSelectedProduct: React.Dispatch<React.SetStateAction<FormDataShirtView | null>>,
    setImage: (imageUrl: string) => void 
  ) => {
    const product = quotationProducts.find((product) => product.id === value);
    const productIndex = quotationProducts.findIndex((product) => product.id === value);
  
    if (productIndex !== -1) {
      const correspondingDesign = designs[productIndex]?.design;
      setSelectedProduct(product || null);
      const imageExtension = 'quotation_shirt'
      const imageName = correspondingDesign
      if(imageName!=null){
        const img = await fetchImage(imageName, imageExtension)
        const imgURL = URL.createObjectURL(img)
        setImage(imgURL)
      }
    }
  };
  
  export const handleView = async (
    id: number,
    setQuotationProducts: (products: FormDataShirtView[]) => void,
    setVisible: (visible: boolean) => void,
    setCuttingOrder: (order: Quotation[]) => void 
  ) => {
    try {
      
      const products = await fetchOrder(id);
      const cuttingOrder = await fetchQuotationOrder(id.toString());
      setQuotationProducts(products);
      setCuttingOrder(cuttingOrder);
      setVisible(true);
    } catch (error) {
      console.error('Error handling view:', error);
    }
  };


  export const filterOrders = (
    Orders: CuttingOrderData[],
    searchText: string
  ): CuttingOrderData[] => {
    return searchText
      ? Orders.filter((Orders) =>
          Object.values(Orders).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )
      : Orders
  }
  
  export const addKeysToOrders = (
    Orders: CuttingOrderData[]
  ): (CuttingOrderData & { key: string })[] => {
    return Orders.map((Order, index) => ({
      ...Order,
      key: index.toString()
    }))
  }
  