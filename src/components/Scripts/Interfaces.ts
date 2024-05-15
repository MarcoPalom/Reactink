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

  export {}
