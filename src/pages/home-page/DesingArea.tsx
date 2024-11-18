import React, { useState } from 'react'
import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { Upload, Button, Radio, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { UploadChangeParam } from 'antd/lib/upload'

const DesignArea: React.FC = () => {
  const navigate = useNavigate()
  useTokenRenewal(navigate)

  const [uploadType, setUploadType] = useState<'design' | 'logo' | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{
    design?: string
    logo?: string
  }>({})

  const handleFileChange = (info: UploadChangeParam) => {
    const fileList = [...info.fileList]
    setFile(fileList[0]?.originFileObj as File)
    if (fileList[0]?.originFileObj) {
      message.success(`Archivo ${fileList[0].name} cargado exitosamente`)
    } else {
      message.error('No se pudo cargar el archivo. Intenta nuevamente.')
    }
  }

  const handleTypeChange = (e: any) => {
    setUploadType(e.target.value)
    setFile(null)
  }

  const uploadImage = async (
    file: File,
    uploadType: 'logo' | 'imageReference'
  ): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadType', uploadType)

    try {
      const response = await axios.post(
        'http://62.72.51.60/upload/single/quotation-desing',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data.fileName
    } catch (error) {
      console.error('Error al subir la imagen:', error)
      message.error('Error al subir el archivo. Por favor, intenta nuevamente.')
      throw error
    }
  }

  const handleUpload = async () => {
    if (!file || !uploadType) {
      message.error(
        'Por favor selecciona un tipo y un archivo antes de enviar.'
      )
      return
    }

    if (uploadedFiles[uploadType]) {
      message.error(
        `Ya has subido un archivo para ${uploadType === 'design' ? 'el diseño' : 'el logo'}.`
      )
      return
    }

    try {
      const uploadedFileName = await uploadImage(
        file,
        uploadType === 'design' ? 'imageReference' : 'logo'
      )

      setUploadedFiles((prev) => ({
        ...prev,
        [uploadType]: uploadedFileName
      }))

      const quotationDesignData = {
        logo: uploadType === 'logo' ? uploadedFileName : null,
        designReference: uploadType === 'design' ? uploadedFileName : null
      }

      console.log(quotationDesignData)

      await axios.post(
        'http://62.72.51.60/api/quotation-design',
        quotationDesignData
      )

      message.success(
        `¡Archivo de ${uploadType === 'design' ? 'diseño' : 'logo'} subido y asociado exitosamente!`
      )
    } catch (error) {
      console.error('Error en la carga o asociación:', error)
      message.error(
        'Hubo un error al subir y asociar el archivo. Intenta nuevamente.'
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-black mb-6">Panel de Carga</h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-black font-medium mb-2">
            Selecciona qué deseas subir
          </label>
          <Radio.Group
            onChange={handleTypeChange}
            value={uploadType}
            className="w-full"
          >
            <Radio.Button value="design" className="w-1/2 text-center">
              Subir Diseño
            </Radio.Button>
            <Radio.Button value="logo" className="w-1/2 text-center">
              Subir Logo
            </Radio.Button>
          </Radio.Group>
        </div>

        {uploadType && (
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">
              {uploadType === 'design' ? 'Subir Diseño' : 'Subir Logo'}
            </label>
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button
                icon={<UploadOutlined />}
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                Seleccionar Archivo
              </Button>
            </Upload>
          </div>
        )}

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!file}
          className="w-full bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Enviar
        </Button>
      </div>

      <div className="mt-4">
        {uploadedFiles.design && (
          <p className="text-sm text-gray-600">
            Diseño subido:{' '}
            <span className="font-bold">{uploadedFiles.design}</span>
          </p>
        )}
        {uploadedFiles.logo && (
          <p className="text-sm text-gray-600">
            Logo subido: <span className="font-bold">{uploadedFiles.logo}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default DesignArea
