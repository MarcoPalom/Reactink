import { useState, useEffect } from 'react'
import { Space, Table, Card, Input, Button, Modal, Form, Upload, message, Carousel } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { QuotationDesign } from 'components/Scripts/Interfaces'
import * as QuotationDesignUtils from 'components/Scripts/QuotationDesignUtils'
import {
  fetchQuotationDesigns,
  fetchQuotationDesign,
  addQuotationDesign,
  updateQuotationDesign,
  uploadDesignFile
} from 'components/Scripts/Apicalls'
import TodayDate from 'components/Scripts/Utils'
import { API_BASE_URL } from 'config/api.config'

const IMG_BASE = `${API_BASE_URL.replace('/api', '')}/api/image/quotation_design`

const LOGO_KEYS = ['logo', 'designFront', 'designBack', 'designShort', 'designCouch', 'designHubby'] as const

const IMAGE_LABELS: Record<string, string> = {
  logo: 'Logo',
  designFront: 'Diseño Frente',
  designBack: 'Diseño Espalda',
  designShort: 'Diseño Short',
  designCouch: 'Diseño Couch',
  designHubby: 'Diseño Hubby',
  imageReference: 'Imagen de Referencia'
}

const DesingList = () => {
  const navigate = useNavigate()
  const [designs, setDesigns] = useState<QuotationDesign[]>([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalDetalles, setModalDetalles] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalAprobar, setModalAprobar] = useState(false)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<QuotationDesign | null>(null)
  const [detailDesign, setDetailDesign] = useState<QuotationDesign | null>(null)
  const [formEdit] = Form.useForm()
  const [formNew] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [logoFiles, setLogoFiles] = useState<(File | null)[]>(Array(6).fill(null))
  const [refFile, setRefFile] = useState<File | null>(null)
  const [logoPreviews, setLogoPreviews] = useState<(string | null)[]>(Array(6).fill(null))
  const [refPreview, setRefPreview] = useState<string | null>(null)

  const filteredDesigns = searchText
    ? designs.filter(
        (d) =>
          String(d.id).includes(searchText) ||
          (d.observation || '').toLowerCase().includes(searchText.toLowerCase())
      )
    : designs
  const dataSource = filteredDesigns.map((d, i) => ({ ...d, key: d.id ?? i }))

  useTokenRenewal(navigate)

  const loadDesigns = async () => {
    setLoading(true)
    try {
      const data = await fetchQuotationDesigns(1, 999)
      setDesigns(Array.isArray(data) ? data : [])
    } catch (e) {
      message.error('Error al cargar la lista de diseños')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDesigns()
  }, [])

  const openDetalles = async (record: QuotationDesign) => {
    setSelectedDesign(record)
    setModalDetalles(true)
    try {
      const full = await fetchQuotationDesign(record.id)
      setDetailDesign(full)
    } catch {
      setDetailDesign(record)
    }
  }

  const openEditar = (record: QuotationDesign) => {
    setSelectedDesign(record)
    formEdit.setFieldsValue({
      observation: record.observation ?? ''
    })
    setModalEditar(true)
  }

  const openAprobar = (record: QuotationDesign) => {
    setSelectedDesign(record)
    setModalAprobar(true)
  }

  const openNuevo = () => {
    formNew.resetFields()
    setSelectedDesign(null)
    // Resetear archivos y previews
    setLogoFiles(Array(6).fill(null))
    setRefFile(null)
    setLogoPreviews(Array(6).fill(null))
    setRefPreview(null)
    setModalNuevo(true)
  }

  const handleApproveOk = async () => {
    if (!selectedDesign) return
    try {
      await updateQuotationDesign(selectedDesign.id, { approved: true })
      message.success('Diseño aprobado')
      setModalAprobar(false)
      setSelectedDesign(null)
      loadDesigns()
    } catch {
      message.error('Error al aprobar el diseño')
    }
  }

  const uploadOne = async (file: File): Promise<string> => {
    const { fileName } = await uploadDesignFile(file)
    return fileName
  }

  const handleEditOk = async () => {
    if (!selectedDesign) return
    const values = await formEdit.validateFields().catch(() => null)
    if (!values) return
    setUploading(true)
    try {
      const payload: Record<string, string | null> = {
        observation: values.observation ?? null
      }
      // Subir logos nuevos o mantener los existentes
      for (let i = 0; i < LOGO_KEYS.length; i++) {
        if (logoFiles[i]) {
          payload[LOGO_KEYS[i]] = await uploadOne(logoFiles[i]!)
        } else if (selectedDesign && (selectedDesign[LOGO_KEYS[i]] as string | null)) {
          payload[LOGO_KEYS[i]] = selectedDesign[LOGO_KEYS[i]] as string
        }
      }
      // Subir imagen de referencia nueva o mantener la existente
      if (refFile) {
        payload.imageReference = await uploadOne(refFile)
      } else if (selectedDesign?.imageReference) {
        payload.imageReference = selectedDesign.imageReference
      }
      await updateQuotationDesign(selectedDesign.id, payload)
      message.success('Diseño actualizado')
      setModalEditar(false)
      setSelectedDesign(null)
      setLogoFiles(Array(6).fill(null))
      setRefFile(null)
      setLogoPreviews(Array(6).fill(null))
      setRefPreview(null)
      loadDesigns()
    } catch (e) {
      message.error('Error al actualizar el diseño')
    } finally {
      setUploading(false)
    }
  }

  const handleNewOk = async () => {
    const values = await formNew.validateFields().catch(() => null)
    if (!values || !values.observation?.trim()) {
      message.warning('Referencias del cliente es requerido')
      return
    }
    setUploading(true)
    try {
      const payload: Record<string, string | number | null> = {
        quotationId: 1,
        observation: values.observation.trim()
      }
      // Subir logos que se hayan seleccionado
      for (let i = 0; i < LOGO_KEYS.length; i++) {
        if (logoFiles[i]) {
          payload[LOGO_KEYS[i]] = await uploadOne(logoFiles[i]!)
        }
      }
      // Subir imagen de referencia si se seleccionó
      if (refFile) {
        payload.imageReference = await uploadOne(refFile)
      }
      await addQuotationDesign(payload)
      message.success('Diseño creado')
      setModalNuevo(false)
      formNew.resetFields()
      setLogoFiles(Array(6).fill(null))
      setRefFile(null)
      setLogoPreviews(Array(6).fill(null))
      setRefPreview(null)
      loadDesigns()
    } catch (e) {
      message.error('Error al crear el diseño')
    } finally {
      setUploading(false)
    }
  }

  const columns = [
    {
      title: 'Folio',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id: number) => id ?? '-'
    },
    {
      title: 'Referencias del Cliente',
      dataIndex: 'observation',
      key: 'observation',
      ellipsis: { showTitle: true },
      render: (t: string) => t || '-'
    },
    {
      title: 'Aprobado',
      key: 'approved',
      width: 130,
      align: 'center' as const,
      render: (_: unknown, r: QuotationDesign) =>
        r.approved ? 'Aprobado' : 'No Aprobado'
    },
    {
      title: 'Estado del Diseño',
      key: 'statusDesign',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, r: QuotationDesign) => (
        <span className="text-orange-600 font-medium">
          {QuotationDesignUtils.getDesignStatusLabel(r)}
        </span>
      )
    },
    {
      title: 'Accion',
      key: 'action',
      width: 140,
      align: 'center' as const,
      render: (_: unknown, record: QuotationDesign) => (
        <Space size="small">
          <Button
            type="text"
            icon={<UnorderedListOutlined />}
            onClick={() => openDetalles(record)}
            title="Ver detalles"
            className="hover:bg-gray-100"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditar(record)}
            title="Editar"
            className="hover:bg-gray-100"
          />
          <Button
            type="text"
            icon={<CheckCircleOutlined />}
            onClick={() => openAprobar(record)}
            title="Aprobar"
            disabled={!!record.approved}
            className={record.approved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Diseño</h4>
          <h6 className="text-sm text-gray-600">Lista de Diseños</h6>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openNuevo}>
          Añadir nuevo diseño
        </Button>
      </div>

      <Card>
        <Space className="mb-4 flex flex-row justify-between flex-wrap">
          <Input
            placeholder="Busqueda..."
            prefix={<SearchOutlined />}
            allowClear
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="text-gray-500 text-sm">
            Ciudad victoria, Tamaulipas a <TodayDate />
          </span>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
          className="w-full border-collapse border border-gray-200"
          rowClassName="hover:bg-gray-50"
        />
      </Card>

      {/* Modal Detalles del Diseño */}
      <Modal
        title="Detalles del Diseño"
        open={modalDetalles}
        onCancel={() => { setModalDetalles(false); setDetailDesign(null) }}
        footer={null}
        width={800}
      >
        {detailDesign && (() => {
          // Recopilar todas las imágenes disponibles
          const allImages: Array<{ url: string; label: string; key: string }> = []
          
          LOGO_KEYS.forEach((key) => {
            if (detailDesign[key]) {
              allImages.push({
                url: `${IMG_BASE}/${detailDesign[key]}`,
                label: IMAGE_LABELS[key],
                key
              })
            }
          })
          
          if (detailDesign.imageReference) {
            allImages.push({
              url: `${IMG_BASE}/${detailDesign.imageReference}`,
              label: IMAGE_LABELS.imageReference,
              key: 'imageReference'
            })
          }

          return (
            <div className="space-y-4">
              {/* Carrusel de imágenes */}
              {allImages.length > 0 ? (
                <div>
                  <p className="font-semibold mb-2">Imágenes del Diseño:</p>
                  <Carousel
                    dots={true}
                    infinite={allImages.length > 1}
                    autoplay={allImages.length > 1}
                    autoplaySpeed={3000}
                    arrows={true}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    {allImages.map((img) => (
                      <div key={img.key} className="text-center">
                        <p className="text-sm font-semibold text-gray-700 mb-2">{img.label}</p>
                        <img
                          src={img.url}
                          alt={img.label}
                          className="max-h-96 mx-auto object-contain rounded border"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No hay imágenes disponibles</p>
                </div>
              )}

              <div>
                <p className="font-semibold">Referencias del Cliente:</p>
                <p className="text-gray-700 bg-gray-50 p-2 rounded">{detailDesign.observation || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Observaciones del Diseñador:</p>
                <p className="text-gray-700 bg-gray-50 p-2 rounded">{detailDesign.observationDesigner || 'No hay observaciones'}</p>
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* Modal Editar Diseño */}
      <Modal
        title="Editar Diseño"
        open={modalEditar}
        onCancel={() => { setModalEditar(false); setSelectedDesign(null) }}
        onOk={handleEditOk}
        okText="OK"
        cancelText="Cancel"
        confirmLoading={uploading}
        width={560}
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item name="observation" label="Referencia del Cliente">
            <Input />
          </Form.Item>
          {LOGO_KEYS.map((key, i) => (
            <Form.Item key={i} label={IMAGE_LABELS[key]}>
              <Upload
                accept="image/png,image/jpeg,image/jpg,image/gif"
                beforeUpload={(file) => {
                  const newFiles = [...logoFiles]
                  newFiles[i] = file
                  setLogoFiles(newFiles)
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const newPreviews = [...logoPreviews]
                    newPreviews[i] = e.target?.result as string
                    setLogoPreviews(newPreviews)
                  }
                  reader.readAsDataURL(file)
                  return false
                }}
                showUploadList={false}
              >
                <Button
                  icon={<CloudUploadOutlined />}
                  className="w-full border-dashed border-2 border-gray-300 rounded-lg py-6 hover:border-blue-400"
                >
                  Click para subir
                </Button>
              </Upload>
              {(logoPreviews[i] || selectedDesign?.[key]) && (
                <div className="mt-2">
                  <img
                    src={logoPreviews[i] || `${IMG_BASE}/${selectedDesign?.[key]}`}
                    alt={IMAGE_LABELS[key]}
                    className="h-20 object-contain border rounded"
                  />
                </div>
              )}
            </Form.Item>
          ))}
          <Form.Item label={IMAGE_LABELS.imageReference}>
            <Upload
              accept="image/png,image/jpeg,image/jpg,image/gif"
              beforeUpload={(file) => {
                setRefFile(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                  setRefPreview(e.target?.result as string)
                }
                reader.readAsDataURL(file)
                return false
              }}
              showUploadList={false}
            >
              <Button
                icon={<CloudUploadOutlined />}
                className="w-full border-dashed border-2 border-gray-300 rounded-lg py-6 hover:border-blue-400"
              >
                Click para subir
              </Button>
            </Upload>
            {(refPreview || selectedDesign?.imageReference) && (
              <div className="mt-2">
                <img
                  src={refPreview || `${IMG_BASE}/${selectedDesign?.imageReference}`}
                  alt="Referencia"
                  className="h-20 object-contain border rounded"
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Aprobar Diseño */}
      <Modal
        title="Aprobar Diseño"
        open={modalAprobar}
        onCancel={() => { setModalAprobar(false); setSelectedDesign(null) }}
        onOk={handleApproveOk}
        okText="OK"
        cancelText="Cancel"
      >
        <p>¿Aprobar este diseño?</p>
      </Modal>

      {/* Modal Añadir Nuevo Diseño */}
      <Modal
        title="Añadir Nuevo Diseño"
        open={modalNuevo}
        onCancel={() => { setModalNuevo(false); formNew.resetFields() }}
        onOk={handleNewOk}
        okText="OK"
        cancelText="Cancel"
        confirmLoading={uploading}
        width={560}
      >
        <Form form={formNew} layout="vertical">
          <Form.Item
            name="observation"
            label="* Referencias del Cliente"
            rules={[{ required: true, message: 'Obligatorio' }]}
          >
            <Input placeholder="Referencias del cliente" />
          </Form.Item>
          {LOGO_KEYS.map((key, i) => (
            <Form.Item key={i} label={IMAGE_LABELS[key]}>
              <Upload
                accept="image/png,image/jpeg,image/jpg,image/gif"
                beforeUpload={(file) => {
                  const newFiles = [...logoFiles]
                  newFiles[i] = file
                  setLogoFiles(newFiles)
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const newPreviews = [...logoPreviews]
                    newPreviews[i] = e.target?.result as string
                    setLogoPreviews(newPreviews)
                  }
                  reader.readAsDataURL(file)
                  return false
                }}
                showUploadList={false}
              >
                <Button
                  icon={<CloudUploadOutlined />}
                  className="w-full border-dashed border-2 border-gray-300 rounded-lg py-6 hover:border-blue-400"
                >
                  Click para subir
                </Button>
              </Upload>
              {logoPreviews[i] && (
                <div className="mt-2">
                  <img
                    src={logoPreviews[i]!}
                    alt={IMAGE_LABELS[key]}
                    className="h-20 object-contain border rounded"
                  />
                </div>
              )}
            </Form.Item>
          ))}
          <Form.Item label={IMAGE_LABELS.imageReference}>
            <Upload
              accept="image/png,image/jpeg,image/jpg,image/gif"
              beforeUpload={(file) => {
                setRefFile(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                  setRefPreview(e.target?.result as string)
                }
                reader.readAsDataURL(file)
                return false
              }}
              showUploadList={false}
            >
              <Button
                icon={<CloudUploadOutlined />}
                className="w-full border-dashed border-2 border-gray-300 rounded-lg py-6 hover:border-blue-400"
              >
                Click para subir
              </Button>
            </Upload>
            {refPreview && (
              <div className="mt-2">
                <img
                  src={refPreview}
                  alt="Referencia"
                  className="h-20 object-contain border rounded"
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default DesingList
