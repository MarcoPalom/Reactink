import React from 'react'
import { Card, Button } from 'antd'
import Logo from 'assets/img/logo.png'
import Missing from 'assets/img/noUserPhoto.jpg'
import {
  FormDataShirtView,
  FormDataShortView,
} from 'components/Scripts/Interfaces'

type AreaProduct = FormDataShirtView | FormDataShortView

const isShortProduct = (
  product: AreaProduct
): product is FormDataShortView => {
  return 'shortSection' in product
}

interface ProductDetailViewProps {
  products: AreaProduct[]
  client: string | null
  shirtImage: string | null
  shortImage: string | null
  getMaterialName: (id: number) => string
  onValidate: (record: AreaProduct) => void
  title: string
}

const ResponsiveTable: React.FC<{
  dataSource: AreaProduct[]
  onValidate: (record: AreaProduct) => void
}> = ({ dataSource, onValidate }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talla</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observación</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validar</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {dataSource.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">{isShortProduct(item) ? 'Short' : 'Camisa'}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
            <td className="px-6 py-4 whitespace-nowrap">{item.observation}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Button onClick={() => onValidate(item)}>Validar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const ResponsiveCardList: React.FC<{
  dataSource: AreaProduct[]
  onValidate: (record: AreaProduct) => void
}> = ({ dataSource, onValidate }) => (
  <div className="space-y-4">
    {dataSource.map((item) => (
      <Card key={item.id} className="shadow-sm">
        <div className="space-y-2">
          <p><strong>Tipo:</strong> {isShortProduct(item) ? 'Short' : 'Camisa'}</p>
          <p><strong>Talla:</strong> {item.size}</p>
          <p><strong>Cantidad:</strong> {item.quantity}</p>
          <p><strong>Observación:</strong> {item.observation}</p>
          <div>
            <Button onClick={() => onValidate(item)}>Validar</Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
)

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  products,
  client,
  shirtImage,
  shortImage,
  getMaterialName,
  onValidate,
  title,
}) => (
  <Card className="p-4">
    <div>
      <div className="flex justify-center mb-2">
        <img src={Logo} alt="Ink Sports" className="h-8" />
      </div>

      {products.map((product, index) => {
        const productImage = isShortProduct(product) ? shortImage : shirtImage
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-4">
              <p>
                <strong>Cotización Folio:</strong> {product.quotationId}
              </p>
              <p>
                <strong>Cliente:</strong> {client}
              </p>
            </div>

            <h3 className="flex justify-center text-lg leading-6 font-medium text-gray-900 mb-4">
              {title}
            </h3>

            <div className="flex flex-col md:flex-row mb-4">
              <div className="flex justify-center md:w-1/3">
                {productImage ? (
                  <img className="w-64 h-44" src={productImage} alt="Product" />
                ) : (
                  <img
                    className="w-64 h-44 object-cover"
                    src={Missing}
                    alt="missing image"
                  />
                )}
              </div>
              <div className="md:w-2/3 mt-4 md:mt-0 md:pl-4">
                <div className="text-sm text-gray-500 space-y-2">
                  <p>
                    <strong>Tipo:</strong> {isShortProduct(product) ? 'Short' : 'Camisa'}
                  </p>
                  <p>
                    <strong>Disciplina:</strong> {product.discipline}
                  </p>
                  {isShortProduct(product) ? (
                    <>
                      <p>
                        <strong>Tela Short:</strong>{' '}
                        {getMaterialName(product.clothShortId)}
                      </p>
                      <p>
                        <strong>Vista Short:</strong> {product.viewShort}
                      </p>
                      <p>
                        <strong>Sección Short:</strong> {product.shortSection}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Tela espalda:</strong>{' '}
                        {getMaterialName(product.clothBackShirtId)}
                      </p>
                      <p>
                        <strong>Tela Manga:</strong>{' '}
                        {getMaterialName(product.clothSleeveId)}
                      </p>
                      <p>
                        <strong>Tela cuello:</strong>{' '}
                        {getMaterialName(product.clothNecklineId)}
                      </p>
                      <p>
                        <strong>Tela frente:</strong>{' '}
                        {getMaterialName(product.clothFrontShirtId)}
                      </p>
                      <p>
                        <strong>Puño:</strong> {product.cuff}
                      </p>
                      <p>
                        <strong>Tipo Puño:</strong> {product.typeCuff}
                      </p>
                      <p>
                        <strong>Cuello:</strong> {product.neckline}
                      </p>
                      <p>
                        <strong>Tipo Cuello:</strong> {product.typeNeckline}
                      </p>
                      <p>
                        <strong>Tipo de Manga:</strong> {product.sleeveType}
                      </p>
                      <p>
                        <strong>Forma de Manga:</strong>{' '}
                        {product.sleeveShape}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <ResponsiveTable dataSource={[product]} onValidate={onValidate} />
            </div>
            <div className="md:hidden">
              <ResponsiveCardList dataSource={[product]} onValidate={onValidate} />
            </div>
          </div>
        )
      })}
    </div>
  </Card>
)

export default ProductDetailView
