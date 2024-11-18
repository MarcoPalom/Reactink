import { useState, useEffect } from 'react';
import { Space, Table, Card, Input } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import useTokenRenewal from 'components/Scripts/useTokenRenewal';
import { useNavigate } from 'react-router-dom';
import { QuotationDesign } from '../../../components/Scripts/Interfaces'; // Define esta interfaz con `folio` y `logo`.
import * as QuotationDesignUtils from '../../../components/Scripts/QuotationDesignUtils'; // Crea un módulo para manejar las operaciones.
import { generatePDF } from 'components/Scripts/Utils';
import Logo from 'assets/img/logo.png';
import TodayDate from '../../../components/Scripts/Utils';

const { Search } = Input;

const QuotationDesignList = () => {
  const navigate = useNavigate();
  const [quotationDesigns, setQuotationDesigns] = useState<QuotationDesign[]>([]);
  const [searchText, setSearchText] = useState('');
  const filteredDesigns = QuotationDesignUtils.filterQuotationDesigns(
    quotationDesigns,
    searchText
  );
  const filteredDesignsWithKeys = QuotationDesignUtils.addKeysToQuotationDesigns(
    filteredDesigns
  );

  useTokenRenewal(navigate);

  useEffect(() => {
    QuotationDesignUtils.fetchAndSetQuotationDesigns(setQuotationDesigns);
  }, []);

  const columns = [
    {
      title: 'Folio',
      dataIndex: 'folio',
      key: 'folio'
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        logo ? (
          <img src={`http://62.72.51.60/${logo}`} alt="Logo" className="h-10" />
        ) : (
          'No disponible'
        )
      )
    }
  ];

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Diseños de Cotizaciones</h4>
          <h6 className="text-sm">Lista de Logos y Folios</h6>
        </div>
      </div>

      <Card>
        <Space className="mb-4 flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <Search
              placeholder="Buscar por folio..."
              className="w-44"
              onSearch={(value) => setSearchText(value)}
            />
          </div>
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined
              className="text-red-500"
              onClick={() => generatePDF()}
            />
          </div>
        </Space>
        <div id="PDFtable">
          <div className="mt-5 flex justify-between mb-5">
            <img src={Logo} alt="Ink Sports" className="h-10" />
            <h1 className="text-end">
              Ciudad Victoria, Tamaulipas a <TodayDate />
            </h1>
          </div>
          <Table
            className="w-full border-collapse border border-gray-200"
            columns={columns}
            dataSource={filteredDesignsWithKeys}
          />
        </div>
      </Card>
    </>
  );
};

export default QuotationDesignList;
