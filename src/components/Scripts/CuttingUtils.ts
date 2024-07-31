import { fetchOrders,fetchOrder} from 'components/Scripts/Apicalls'
import { CuttingOrderData,FormDataShirt,FormDataShirtView } from 'components/Scripts/Interfaces'

export const fetchAndSetOrders = async (setOrders: React.Dispatch<React.SetStateAction<CuttingOrderData[]>>) => {
    try {
      const response = await fetchOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error fetching and setting quotations:', error)
    }
  }
  export const handleView = async (
    id: number,
    setQuotationProducts: (products: FormDataShirtView[]) => void,
    setVisible: (visible: boolean) => void
  ) => {
    try {
      const products = await fetchOrder(id);
      console.log('Products:', products); 
      setQuotationProducts(products);
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
  