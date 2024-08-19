export interface Employee {
    id: string
    name: string
    surname: string
    email: string
    phone: string
    address: string
    salary: number
    startDate: string
    role: number
    image: string
  }
  
  export interface EmployeeAdd {
    name: string
    surname: string
    password: string
    email: string
    phone: string
    address: string
    salary: number
    startDate: string
    role: number
    image: string
  }

  export interface Client {
    id: string
    name: string
    surname: string
    organization: string
    email: string
    phone: string
  }

  export interface ClientAdd {
    name: string
    surname: string
    organization: string
    email: string
    phone: string
  }

  export interface Material {
    id: string
    name: string
    description: string
    stock: number
    supplierId: string
    categoryId: string
    userId: string
    unitMeasure: string
    dateReceipt: string
    serial: string
    location: string
    image: string
  }
  export interface MaterialSize{
    materialId:string
    size:number
    consumption:number
    performance:number
  }


  export interface MaterialAdd {
    name: string
    description: string
    stock: number
    supplierId: string
    categoryId: string
    userId: string
    unitMeasure: string
    dateReceipt: string
    serial: string
    location: string
    image: string
  }

  export interface Category {
    id: string
    name: string

  }

  export interface CategoryAdd {
    name: string
  }

  export interface Supplier {
    id: string
    name: string
    email: string
    phone: string

  }

  export interface SupplierAdd  {
    name: string
    email: string
    phone: string
  }

  
  export interface Quotation {
    id: number
    dateReceipt: string
    expirationDate: string
    clientId: string
    subtotal:number
    tax:number
    netAmount:number
    advance:number
    total:number

  }

  export interface QuotationAdd  {
    dateReceipt: string
    expirationDate: string
    clientId: string
    subtotal:number
    tax:number
    netAmount:number
    advance:number
    total:number
  }

 export interface QuotationItem {
    quotationId: string;
    description: string;
    quantity: number;
    amount: number;
    tax: number;
    total: number;
  }

  export interface QuotationProduct {
    description: string;
    quantity: number;
    amount: number;
    tax?: number;
    total: number;
  }
  
  export interface QuotationProductMaquila {
    description: string;
    quantity: number;
    price_meter: number;
    meters_impression: number;
    price_unit: number;
    amount: number;
  }

  export interface FormDataShirt {
    productType: boolean;
    discipline: string;
    clothFrontShirtId: string;
    clothBackShirtId: string;
    neckline: string;
    typeNeckline: string;
    clothNecklineId: string;
    sleeveShape: string;
    sleeveType: string;
    clothSleeveId: string;
    cuff: string;
    typeCuff: string;
    clothCuffId: string;
    dtfShirt: string;
    tShirtSection: boolean;
    gender:number;
    quantity:number;
    size:string;
    priceUnit:number;
    tax:number;
    observation:string;
  }

  export interface FormDataShirtView {
    id:number
    productType: boolean;
    discipline: string;
    clothFrontShirtId: string;
    clothBackShirtId: string;
    neckline: string;
    typeNeckline: string;
    clothNecklineId: string;
    sleeveShape: string;
    sleeveType: string;
    clothSleeveId: string;
    cuff: string;
    typeCuff: string;
    clothCuffId: string;
    dtfShirt: string;
    tShirtSection: boolean;
    gender:number;
    quantity:number;
    size:string;
    priceUnit:number;
    tax:number;
    observation:string;
    total:number;
    quotationId:number
  }

  export interface CuttingOrderData{
    dateReceipt:string;
    dueDate:string;
  }

  export interface Props {
    selectedProduct: FormDataShirtView;
    materials: Material[];
  }

  export interface quotationDesigns{
    design:string
    id:number
    quotationId:number
    typeProduct:boolean
  }


  export {}
