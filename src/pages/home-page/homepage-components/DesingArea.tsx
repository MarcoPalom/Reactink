import React, { useState } from 'react'
import { Button, Drawer, Form, Input, Card } from 'antd'
import { UploadOutlined, EditOutlined } from '@ant-design/icons'
import Missing from 'assets/img/noUserPhoto.jpg'
import Shirt from 'assets/img/deportiva.jpg'
import Logoshirt from 'assets/img/america.png'

const DesignArea = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const showDrawer = () => {
    setDrawerVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  const handleSubmit = (values: any) => {
    console.log('Formulario enviado:', values)
    closeDrawer()
  }

  return (
    <div>
      <h1 className="mt-2 mb-4 font-semibold leading-6 text-gray-900 text-lg">
        Área de Diseño
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="lg:col-span-1 flex flex-col justify-between">
    <Card
      className="mb-6 shadow-md h-80 lg:h-80"
      title={
        <span className="leading-6 font-medium text-sm">
          Último diseño / Referencia
        </span>
      }
    >
      <div className="flex justify-center items-center">
        <img src={Shirt} alt={Missing} className="w-72 h-48 mb-5" />
      </div>
    </Card>

    <Card
      className="shadow-md h-80 lg:h-80" 
      title={
        <span className="leading-6 font-medium text-sm">
          Último logo / Referencia
        </span>
      }
    >
      <div className="flex justify-center items-center">
        <img src={Logoshirt} alt={Missing} className="w-72 h-48 mb-5" />
      </div>
    </Card>
  </div>

  {/* Tercera Card (Acciones) */}
  <div className="lg:col-span-1 flex justify-center items-center lg:h-auto">
    <Card
      className="shadow-md lg:h-80 w-full" 
      title={<span className="leading-6 font-medium text-sm">Acciones</span>}
    >
      <Button
        onClick={showDrawer}
        className="mb-4 w-full h-24 border-2 border-purple-300 rounded-md shadow-md flex flex-col justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex space-x-4">
            <div className="bg-red-500 rounded-full p-4 mb-2 flex items-center justify-center">
              <UploadOutlined className="text-white text-2xl" />
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">Subir un diseño</div>
              <div className="text-sm text-violet-400">primer paso</div>
            </div>
          </div>
        </div>
      </Button>

      <Button
        onClick={showDrawer}
        className="mb-4 w-full h-24 border-2 border-purple-300 rounded-md shadow-md flex flex-col justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex space-x-9">
            <div className="bg-red-500 rounded-full p-4 mb-2 flex items-center justify-center">
              <EditOutlined className="text-white text-2xl" />
            </div>

            <div className="text-center">
              <div className="text-xl font-semibold">Editar diseño</div>
              <div className="text-sm text-violet-400">Remplazar el actual</div>
            </div>
          </div>
        </div>
      </Button>
    </Card>
  </div>
</div>


      <Drawer
        title="Formulario de Diseño"
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={500}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Observación" name="observation">
            <Input.TextArea rows={4} placeholder="Escribe una observación" />
          </Form.Item>

          <Form.Item label="Logo" name="logo">
            <Input placeholder="Nombre del logo" />
          </Form.Item>

          <Form.Item label="Referencia de Imagen" name="imageReference">
            <Input placeholder="Nombre de la imagen de referencia" />
          </Form.Item>

          <Form.Item
            label="Observación del Diseñador"
            name="observationDesigner"
          >
            <Input.TextArea
              rows={4}
              placeholder="Escribe observaciones del diseñador"
            />
          </Form.Item>

          <Form.Item label="Diseño Frontal" name="designFront">
            <Input placeholder="Diseño frontal" />
          </Form.Item>

          <Form.Item label="Diseño Trasero" name="designBack">
            <Input placeholder="Diseño trasero" />
          </Form.Item>

          <Form.Item label="Diseño Shorts" name="designShort">
            <Input placeholder="Diseño de shorts" />
          </Form.Item>

          <Form.Item label="Diseño Couch" name="designCouch">
            <Input placeholder="Diseño couch" />
          </Form.Item>

          <Form.Item label="Diseño Hubby" name="designHubby">
            <Input placeholder="Diseño hubby" />
          </Form.Item>

          <Form.Item label="Forma del Cuello" name="neckline">
            <Input placeholder="Forma del cuello" />
          </Form.Item>

          <Form.Item label="Forma de la Manga" name="sleeveShape">
            <Input placeholder="Forma de la manga" />
          </Form.Item>

          <Form.Item label="Tipo de Puño" name="typeCuff">
            <Input placeholder="Tipo de puño" />
          </Form.Item>

          <Form.Item label="Cuello del Portero" name="neckGoalie">
            <Input placeholder="Cuello del portero" />
          </Form.Item>

          <Form.Item label="Manga del Portero" name="sleeveGoalie">
            <Input placeholder="Manga del portero" />
          </Form.Item>

          <Form.Item label="Tipo de Shorts" name="typeShort">
            <Input placeholder="Tipo de shorts" />
          </Form.Item>

          <Form.Item label="Tipo de Shorts del Portero" name="typeShortGoalie">
            <Input placeholder="Tipo de shorts del portero" />
          </Form.Item>

          <Form.Item label="Aprobado" name="approved" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default DesignArea
