import { QuotationDesign } from './Interfaces';
import { fetchQuotationDesigns } from 'components/Scripts/Apicalls';

export const fetchAndSetQuotationDesigns = async (
  setQuotationDesigns: React.Dispatch<React.SetStateAction<QuotationDesign[]>>
) => {
  try {
    const response = await fetchQuotationDesigns(1, 999);
    setQuotationDesigns(Array.isArray(response) ? response : []);
  } catch (error) {
    console.error('Error fetching and setting quotation designs:', error);
    throw error;
  }
};

export const getDesignStatusLabel = (design: QuotationDesign): string => {
  if (design.approved) return 'Aprobado';
  if (design.designFront || design.designBack) return 'Diseño Enviado';
  return 'En Proceso';
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
