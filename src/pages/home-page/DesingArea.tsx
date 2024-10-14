import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Card, Input, Form, Switch, Drawer, message, Upload, Select } from 'antd'
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { FaTshirt } from 'react-icons/fa'
import { GiGoalKeeper } from 'react-icons/gi'
import { Quotation, QuotationDesign } from 'components/Scripts/Interfaces'
import { fetchQuotations, fetchQuotationDesigns, addQuotationDesign, updateQuotationDesign } from 'components/Scripts/Apicalls'

const { Search } = Input
const { Option } = Select

export default function QuotationDesigns() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [designs, setDesigns] = useState<QuotationDesign[]>([])
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<QuotationDesign | null>(null)
  const [isShirtForm, setIsShirtForm] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    loadQuotations()
    loadDesigns()
  }, [])

  const loadQuotations = async () => {
    try {
      const data = await fetchQuotations()
      setQuotations(data)
    } catch (error) {
      console.error('Error al cargar las cotizaciones', error)
      message.error('Error al cargar las cotizaciones')
    }
  }

  const loadDesigns = async () => {
    try {
      const data = await fetchQuotationDesigns()
      setDesigns(data)
    } catch (error) {
      console.error('Error al cargar los diseños', error)
      message.error('Error al cargar los diseños')
    }
  }

  const handleSubmit = async (values: QuotationDesign) => {
    try {
      if (isEditing && selectedDesign) {
        await updateQuotationDesign(selectedDesign.id, values)
        message.success('Diseño actualizado exitosamente')
      } else {
        await addQuotationDesign(values)
        message.success('Diseño añadido exitosamente')
      }
      setVisible(false)
      loadDesigns()
      form.resetFields()
    } catch (error) {
      console.error('Error al guardar el diseño', error)
      message.error('Error al guardar el diseño')
    }
  }

  const columns = [
    { title: 'Folio', dataIndex: 'id', key: 'id' },
    { title: 'Cliente', dataIndex: 'clientId', key: 'clientId' },
    { title: 'Fecha de Recibido', dataIndex: 'dateReceipt', key: 'dateReceipt', render: (date: string) => new Date(date).toLocaleDateString() },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total: number) => `$${total}` },
    {
      title: 'Acción',
      key: 'action',
      render: (text: any, record: Quotation) => (
        <Space size="middle">
          <Button icon={<PlusOutlined />} onClick={() => showDrawer(record, false)}>Añadir Diseño</Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showDrawer(record, true)} 
            disabled={!designs.some(design => design.quotationId === record.id)}
          >
            Editar Diseño
          </Button>
        </Space>
      ),
    },
  ]

  const showDrawer = (quotation: Quotation, editing: boolean) => {
    setSelectedQuotation(quotation)
    const existingDesign = designs.find(design => design.quotationId === quotation.id)
    if (editing && existingDesign) {
      setSelectedDesign(existingDesign)
      form.setFieldsValue(existingDesign)
      setIsShirtForm(!isGoalkeeperShirt(existingDesign))
    } else {
      setSelectedDesign(null)
      form.resetFields()
      form.setFieldsValue({ quotationId: quotation.id })
      setIsShirtForm(true)
    }
    setIsEditing(editing)
    setVisible(true)
  }

  const isGoalkeeperShirt = (values: any) => {
    return values.neckGoalie || values.sleeveGoalie || values.typeShortGoalie
  }

  const toggleFormType = () => {
    setIsShirtForm(!isShirtForm)
    form.resetFields(['neckline', 'sleeveShape', 'typeCuff', 'neckGoalie', 'sleeveGoalie', 'typeShort', 'typeShortGoalie'])
  }

  const renderCommonFields = () => (
    <>
      <Form.Item name="quotationId" label="ID de Cotización" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="observation" label="Observación" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="logo" label="Logo" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="imageReference" label="Referencia de Imagen">
        <Input />
      </Form.Item>
      <Form.Item name="observationDesigner" label="Observación del Diseñador">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="designFront" label="Diseño Frontal">
        <Input />
      </Form.Item>
      <Form.Item name="designBack" label="Diseño Trasero">
        <Input />
      </Form.Item>
      <Form.Item name="designShort" label="Diseño Short">
        <Input />
      </Form.Item>
      <Form.Item name="designCouch" label="Diseño Couch">
        <Input />
      </Form.Item>
      <Form.Item name="designHubby" label="Diseño Hubby">
        <Input />
      </Form.Item>
    </>
  )

  const renderShirtFields = () => (
    <>
      <Form.Item name="neckline" label="Forma del Cuello">
        <Select>
          <Option value="v">Cuello V</Option>
          <Option value="round">Cuello Redondo</Option>
          <Option value="polo">Cuello Polo</Option>
        </Select>
      </Form.Item>
      <Form.Item name="sleeveShape" label="Forma de la Manga">
        <Select>
          <Option value="short">Manga Corta</Option>
          <Option value="long">Manga Larga</Option>
          <Option value="sleeveless">Sin Mangas</Option>
        </Select>
      </Form.Item>
      <Form.Item name="typeCuff" label="Tipo de Puño">
        <Select>
          <Option value="elastic">Elástico</Option>
          <Option value="ribbed">Acanalado</Option>
          <Option value="none">Sin Puño</Option>
        </Select>
      </Form.Item>
    </>
  )

  const renderGoalkeeperShirtFields = () => (
    <>
      <Form.Item name="neckGoalie" label="Cuello del Portero">
        <Select>
          <Option value="high">Cuello Alto</Option>
          <Option value="v">Cuello V</Option>
          <Option value="round">Cuello Redondo</Option>
        </Select>
      </Form.Item>
      <Form.Item name="sleeveGoalie" label="Manga del Portero">
        <Select>
          <Option value="long">Manga Larga</Option>
          <Option value="threequarter">Manga 3/4</Option>
          <Option value="short">Manga Corta</Option>
        </Select>
      </Form.Item>
    </>
  )

  const renderShortFields = () => (
    <>
      <Form.Item name="typeShort" label="Tipo de Short">
        <Select>
          <Option value="regular">Regular</Option>
          <Option value="slim">Ajustado</Option>
          <Option value="loose">Holgado</Option>
        </Select>
      </Form.Item>
      <Form.Item name="typeShortGoalie" label="Tipo de Short del Portero">
        <Select>
          <Option value="padded">Acolchado</Option>
          <Option value="regular">Regular</Option>
          <Option value="long">Largo</Option>
        </Select>
      </Form.Item>
    </>
  )

  return (
    <>
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-bold">Área de Diseño</h4>
      </div>

      <Card>
        <Space className="w-full justify-between mb-4">
          <Search
            placeholder="Buscar cotización..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>

        <Table 
          columns={columns} 
          dataSource={quotations.filter(quotation => 
            quotation.id.toString().includes(searchText) ||
            quotation.clientId.toString().includes(searchText)
          )} 
          rowKey="id" 
        />
      </Card>

      <Drawer
        title={isEditing ? "Editar Diseño" : "Añadir Nuevo Diseño"}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={720}
        extra={
          <Space>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
            <Button onClick={() => form.submit()} type="primary">
              Guardar
            </Button>
          </Space>
        }
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2">
            <FaTshirt className={`w-10 h-10 text-green-500 ${isShirtForm ? 'block' : 'hidden'}`} />
            <GiGoalKeeper className={`w-10 h-10 text-green-500 ${!isShirtForm ? 'block' : 'hidden'}`} />
            <Switch
              checked={isShirtForm}
              onChange={toggleFormType}
              checkedChildren="Normal"
              unCheckedChildren="Portero"
            />
            <span>{isShirtForm ? 'Camisa Normal' : 'Camisa de Portero'}</span>
          </div>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
        >
          {renderCommonFields()}
          {isShirtForm ? renderShirtFields() : renderGoalkeeperShirtFields()}
          {renderShortFields()}
          <Form.Item name="approved" label="Aprobado" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="image" label="Imagen">
            <Upload>
              <Button icon={<UploadOutlined />}>Subir Imagen</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}