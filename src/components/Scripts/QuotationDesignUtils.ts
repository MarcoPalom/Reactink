import { QuotationDesign } from './Interfaces'; 
import { fetchQuotationDesigns } from 'components/Scripts/Apicalls'; 


export const fetchAndSetQuotationDesigns = async (
  setQuotationDesigns: React.Dispatch<React.SetStateAction<QuotationDesign[]>>
) => {
  try {
    const response = await fetchQuotationDesigns();
    setQuotationDesigns(response);
  } catch (error) {
    console.error('Error fetching and setting quotation designs:', error);
  }
};

export const filterQuotationDesigns = (
  designs: QuotationDesign[],
  searchText: string
): QuotationDesign[] => {
  return searchText
    ? designs.filter((design) =>
        Object.values(design).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : designs;
};

export const addKeysToQuotationDesigns = (
  designs: QuotationDesign[]
): (QuotationDesign & { key: string })[] => {
  return designs.map((design, index) => ({
    ...design,
    key: index.toString(),
  }));
};
