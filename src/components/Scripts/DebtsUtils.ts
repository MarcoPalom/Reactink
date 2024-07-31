
import { Quotation,Client } from './Interfaces'
import { fetchQuotations, fetchClients } from 'components/Scripts/Apicalls'

export const fetchAndSetClients = async (setClients: React.Dispatch<React.SetStateAction<Client[]>>) => {
  try {
    const response = await fetchClients()
    setClients(response)
  } catch (error) {
    console.error('Error fetching and setting quotations:', error)
  }
}

export const fetchAndSetQuotations = async (setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>) => {
    try {
      const response = await fetchQuotations()
      setQuotations(response)
    } catch (error) {
      console.error('Error fetching and setting quotations:', error)
    }
  }

export const filterQuotations = (
  Quotations: Quotation[],
  searchText: string
): Quotation[] => {
  return searchText
    ? Quotations.filter((Quotation) =>
        Object.values(Quotation).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : Quotations
}

export const addKeysToQuotations = (
  Quotations: Quotation[]
): (Quotation & { key: string })[] => {
  return Quotations.map((Quotation, index) => ({
    ...Quotation,
    key: index.toString()
  }))
}
