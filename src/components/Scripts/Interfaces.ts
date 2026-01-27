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
    id: number
    name: string
    description: string
    stock: number
    supplierId: string
    categoryId: string
    userId: string
    unitMeasure: string
    dateReceipt: string | null; 
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
    id: number;
    dateReceipt: string;
    expirationDate: string;
    clientId: number; 
    client: Client; 
    subtotal: number;
    tax: number;
    netAmount: number;
    advance: number;
    total: number;
    inProduction: boolean; 
    key: string; 
    quotationDesigns: quotationDesigns[]; 
    quotationProduct: QuotationProduct[]; 
    quotationProductMaquila: QuotationProductMaquila[]; 
    quotationProductShirts: FormDataShirt[]; 
    quotationProductShorts: any[]; 
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
    id?:number
    key?:number
    quotationId : number
    description: string;
    quantity: number;
    amount: number;
    tax?: number;
    total: number;
  }

  export interface QuotationProductMaquila {
    id?:number
    quotationId : number
    description: string;
    quantity: number;
    price_meter?: number;
    meters_impression?: number;
    price_unit?: number;
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

  export interface FormDataShort {
    productType?: number;
    discipline: string;
    clothShortId: number;
    clothViewId : number;
    viewShort: string;
    dtfShort: string;
    shortSection: string;
    gender: number;
    quantity: number;
    size: string;
    observation:string;
  }

  export interface FormDataShirtView {
    id:number
    productType: boolean;
    discipline: string;
    clothFrontShirtId: number;
    clothBackShirtId: number;
    neckline: string;
    typeNeckline: string;
    clothNecklineId: number;
    sleeveShape: string;
    sleeveType: string;
    clothSleeveId: number;
    cuff: string;
    typeCuff: string;
    clothCuffId: number;
    dtfShirt: string;
    tShirtSection: boolean;
    gender:number;
    quantity:string;
    size:string;
    priceUnit:number;
    tax:number;
    observation:string;
    total:number;
    quotationId:number;
    cuttingArea?:number;
    printingArea?:number;
    sublimationArea?:number;
    sewingArea?:number;
    ironingArea?:number;
    finishingArea?:number;
  }


  export interface FormDataShortView {
    id:number
    productType: boolean;
    discipline: string;
    viewShort: string;
    dtfShort: string;
    shortSection: string;
    size: string;
    gender: string;
    observation: string;
    clothShortId: number;
    quantity:number;
    quotationId:number;
    cuttingArea?:number;
    printingArea?:number;
    sublimationArea?:number;
    sewingArea?:number;
    ironingArea?:number;
    finishingArea?:number;
  }

  export interface Expense {
    id: number;
    concept: string;
    total: number;
    bank: string | null;
    dateExpense: string;
    userId: number | null;
    materialId: number | null;
  }

  export interface CuttingOrderData{
    id:number
    quotationId:number;
    dateReceipt:string;
    quotation: Quotation
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

  export interface MaterialRends {
    id: number
    materialId: number
    size: string
    consumption: number
    performance: number
    status?: boolean
  }

  export interface QuotationDesign {
    id: number;
    quotationId: number;
    cuttingOrderId?: number | null;
    observation?: string | null;
    logo?: string | null;
    imageReference?: string | null;
    observationDesigner?: string | null;
    designFront?: string | null;
    designBack?: string | null;
    designShort?: string | null;
    designCouch?: string | null;
    designHubby?: string | null;
    neckline?: string | null;
    sleeveShape?: string | null;
    typeCuff?: string | null;
    neckGoalie?: string | null;
    sleeveGoalie?: string | null;
    typeShort?: string | null;
    typeShortGoalie?: string | null;
    approved?: boolean | null;
    status?: boolean;
    quotation?: { id: number; client?: { name?: string; surname?: string; organization?: string } };
  }


  export {}
