import { useParams } from 'react-router-dom'

// @ts-ignore
const ProductDetail = () => {
  const params = useParams()
  return <div>ProductDetail: {params.productId}</div>
}

export default ProductDetail
