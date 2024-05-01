import { Card, Input, Select, Upload, Button, DatePicker } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const { Dragger } = Upload

interface DataType {
  value: number
  label: string
}

const category: DataType[] = [
  {
    value: 1,
    label: 'Administrador'
  },
  {
    value: 2,
    label: 'Financiero'
  },
  {
    value: 3,
    label: 'Auxiliar'
  }
]

const EmployeDetail = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [errorcamp, setErrorcamp] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {

    const renewToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/');
        }
        const response = await axios.get('http://localhost:3001/api/user/renew-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.setItem('token', response.data.token);

        console.log('Token renovado con éxito:', response.data);
      } catch (error) {
        console.error('Error al renovar el token:', error);
        navigate('/');
      }
    };

    renewToken();
  } , []);
 

  const dataimg = new FormData()
  fileList.forEach((file: any) => {
    dataimg.append('file', file.originFileObj)
  })

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const onRemove = (file: any) => {
    setFileList([])
  }

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    salary: '',
    startDate: '',
    role: 0,
    image: ''
  })

  const validateForm = () => {
    const {
      name,
      surname,
      email,
      password,
      phone,
      address,
      salary,
      startDate,
      role,
    } = formData
    if (
      !name ||
      !surname ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !salary ||
      !startDate ||
      !role
    ) {
      setErrorcamp('Por favor, complete todos los campos')
      setTimeout(() => {
        setErrorcamp('')
      }, 5000)
      return false
    }

    if (password !== confirmPassword) {
      setErrorcamp('Las contraseñas no coinciden')
      setTimeout(() => {
        setErrorcamp('')
      }, 5000)
      return false
    }

    setErrorcamp('')
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log(formData)

    try {
      const responseimg = await axios.post(
        'http://localhost:3001/api/upload/single/user',
        dataimg
      )

      // Se agregó para poder subir la imagen directamente al backend
      formData.image = responseimg.data.fileName;

      if (!validateForm()) return

      const response = await axios.post(
        'http://localhost:3001/api/user/register',
        formData,
        {
          // Faltaban headers para autenticación
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      // Manejar respuestas efectivas
      .then(response => {
          navigate('/personal/empleados')
      })
      // Manejar respuestas de errores
      .catch(error => {
          setErrorcamp('El correo electrónico ya está registrado')
          setTimeout(() => {
            setErrorcamp('')
          }, 10000)
      })

    } catch (error: any) {
        const errorMessage = error.response.data.error
        console.log(error)    

      if (errorMessage.includes('files')) {
        setErrorcamp('Favor de llenar todos los campos')
        setTimeout(() => {
          setErrorcamp('')
        }, 5000)
      }
    
    }
  }
    const handleChange = (name: string, value: any) => {
      setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (info: any) => {
      let fileList = [...info.fileList];
    
      fileList = fileList.slice(-1);
    
      fileList = fileList.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file.originFileObj)
      }));
    
      setFileList(fileList);
    
      if (fileList.length > 0) {
        const image = fileList[0].name;
        setFormData({ ...formData, image });
      }
    
      validateForm(); 
    }

    const handleCancel = () => {
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        salary: '',
        startDate: '',
        role: 0,
        image: ''
      });
      setConfirmPassword('');
      setFileList([]);
      console.log(formData)
    };
  

    return (
      <>
        <h4 className="font-bold text-lg">Personal</h4>
        <h6 className="text-sm mb-4">Añadir Empleado</h6>

        <Card>
          <div className="flex flex-row gap-4">
            <div className="gap-1 columns-2  mb-4">
              <div className="w-3/4 space-y-4">
                <Input
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <Input
                  name="surname"
                  placeholder="Apellido"
                  value={formData.surname}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <Input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <Input.Password
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                <Input.Password
                  placeholder="Repetir contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="w-3/4 space-y-4">
                <Select
                  className="w-full"
                  placeholder="rol"
                  options={category}
                  value={formData.role}
                  onChange={(value) => handleChange('role', value)}
                />
                <Input
                  name="salary"
                  placeholder="Salario"
                  value={formData.salary}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <Input
                  name="phone"
                  placeholder="Telefono"
                  value={formData.phone}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <Input
                  name="address"
                  placeholder="Direccion"
                  value={formData.address}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                ></Input>
                <DatePicker
                  name="startDate"
                  className="w-full"
                  placeholder="Fecha de aceptacion"
                  onChange={(value) => handleChange('startDate', value)}
                />
              </div>
            </div>

            <Dragger
              name='image'
              fileList={fileList}
              onChange={handleFileChange}
              customRequest={customRequest}
              onRemove={onRemove}
              className="h-1/4 w-1/4"
            >
              {fileList.length === 0 ? (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Foto</p>
                  <p className="ant-upload-hint">
                    Da click o arrastra un archivo a esta area para subirlo
                  </p>
                </>
              ) : (
                <img
                  src={fileList[0].preview}
                  alt="Previsualización"
                  className="w-fit h-fit object-contain"
                />
              )}
            </Dragger>
          </div>

          <div className="flex flex-row gap-4">
            <Button
              className=" h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold p-4 items-center "
              onClick={handleSubmit}
            >
              Aceptar
            </Button>
            <Button 
            className=" h-14 w-32 bg-indigo-900 rounded-md text-white text-base font-bold p-4 items-center "
            onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </Card>
        {errorcamp && <h3 className="text-red-500">{errorcamp}</h3>}
      </>
    )
  }
export default EmployeDetail
