import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { Space, Card, Steps, Divider, Progress as AntdProgress, message, Select } from 'antd'
import {
  FilePdfOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'

const Production = () => {
  const [current, setCurrent] = useState(0);
  const [orders, setOrders] = useState([]); // Almacenar pedidos
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Almacenar la orden seleccionada
  const [quotation, setQuotation] = useState<any>(null); // Almacenar la cotización
  const [activeProducts, setActiveProducts] = useState<any[]>([]); // Almacenar los productos activos (Shirts o Shorts)
  const navigate = useNavigate();
  useTokenRenewal(navigate);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      getQuotation(selectedOrder.quotationId);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (quotation) {
      // Combina los productos de camisetas y shorts si existen
      const shirts = quotation.quotationProductShirts || [];
      const shorts = quotation.quotationProductShorts || [];
      const allProducts = [...shirts, ...shorts]; // Combinar los productos
      setActiveProducts(allProducts);
    }
  }, [quotation]);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  const getOrders = async () => {
    try {
      const res = await fetch("http://62.72.51.60/api/cutting-order", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log(data);

      if (!data) {
        message.error("Error al obtener los pedidos");
      } else {
        setOrders(data);
      }

      return data;
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const getQuotation = async (id: number) => {
    try {
      const res = await fetch(`http://62.72.51.60/api/quotation/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log(data);

      if (data) {
        setQuotation(data); // Guardar la cotización en el estado
      } else {
        message.error("Error al obtener la cotización");
      }
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  // Definir los steps dinámicamente para cada producto
  const getSteps = (product: any) => [
    {
      title: "Corte",
      description: product?.cuttingArea 
      ? `Talla: ${product.size}, Cantidad: ${product.quantity}`
      : "Pendiente",
      icon: product?.cuttingArea ? (
        <CheckOutlined className="text-green-500" />
      ) : (
        <CloseOutlined className="text-red-500" />
      ),
      progress: product?.cuttingArea ? [{ percent: 100, status: "success" }] : [],
    },
    {
      title: "Impresión",
      description: product?.printingArea
      ? `Talla: ${product.size}, Cantidad: ${product.quantity}`
      : "Pendiente",
      icon: product?.printingArea ? (
        <CheckOutlined className="text-green-500" />
      ) : (
        <CloseOutlined className="text-red-500" />
      ),
      progress: product?.printingArea ? [{ percent: 100, status: "success" }] : [],
    },
    {
      title: "Sublimado",
      description: product?.sublimationArea
      ? `Talla: ${product.size}, Cantidad: ${product.quantity}`
      : "Pendiente",
      icon: product?.sublimationArea ? (
        <CheckOutlined className="text-green-500" />
      ) : (
        <CloseOutlined className="text-red-500" />
      ),
      progress: product?.sublimationArea ? [{ percent: 100, status: "success" }] : [],
    },
    {
      title: "Costura",
      description: product?.sewingArea
      ? `Talla: ${product.size}, Cantidad: ${product.quantity}`
      : "Pendiente",
      icon: product?.sewingArea ? (
        <CheckOutlined className="text-green-500" />
      ) : (
        <CloseOutlined className="text-red-500" />
      ),
      progress: product?.sewingArea ? [{ percent: 100, status: "success" }] : [],
    },
    {
      title: "Acabado",
      description: product?.finishingArea
      ? `Talla: ${product.size}, Cantidad: ${product.quantity}`
      : "Pendiente",
      icon: product?.finishingArea ? (
        <CheckOutlined className="text-green-500" />
      ) : (
        <CloseOutlined className="text-red-500" />
      ),
      progress: product?.finishingArea ? [{ percent: 100, status: "success" }] : [],
    },
  ];

  // Manejar el cambio de orden seleccionada
  const handleOrderChange = (orderId: number) => {
    const selected = orders.find((order: any) => order.id === orderId);
    setSelectedOrder(selected);
  };

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Producción</h4>
          <h6 className="text-sm">Administrar producción</h6>
        </div>

        {/* Select para los pedidos */}
        <Select
          style={{ width: 200 }} // Ancho del select
          placeholder="Selecciona un pedido"
          onChange={handleOrderChange} // Manejar el cambio del select
        >
          {orders.map((order: any) => (
            <Select.Option key={order.id} value={order.id}>
              {"Orden No: " + order.id}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Card>
        <Space
          style={{ marginBottom: 16 }}
          className="flex flex-row justify-between"
        >
          <div className="flex flex-row gap-4 text-lg">
            <FilePdfOutlined className="text-red-500" />
          </div>
        </Space>

        {/* Contenido dinámico basado en la orden seleccionada */}
        {selectedOrder ? (
          <>
            <h3>{`ID de la Orden: ${selectedOrder.id}`}</h3>

            {activeProducts.map((product, productIndex) => (
              <div key={productIndex}>
                <h4>{`Producto ${productIndex + 1}`}</h4>

                <Steps
                  current={current}
                  onChange={onChange}
                  items={getSteps(product).map((step, index) => ({
                    ...step,
                    status:
                      index === current
                        ? "process"
                        : index < current
                        ? "finish"
                        : "wait",
                  }))}
                />

                <Divider />

                {/*<div className="space-y-4">
                  {getSteps(product).map((step, index) => (
                    <div key={index} className={index === current ? "" : "hidden"}>
                      <p>{step.icon}</p>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      {step.progress.length > 0 && (
                        <div className="space-y-2">
                          {step.progress.map((item, progressIndex) => (
                            <div key={progressIndex}>
                              <p>{item.status}</p>
                              <AntdProgress percent={item.percent} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>*/}
              </div>
            ))}
          </>
        ) : (
          <p>Selecciona una orden para ver los detalles.</p>
        )}
      </Card>
    </>
  );
};

export default Production;
