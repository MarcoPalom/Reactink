import useTokenRenewal from 'components/Scripts/useTokenRenewal'
import { useNavigate } from 'react-router-dom'
import { Space, Card, Steps, Divider, Progress as AntdProgress } from 'antd'
import {
  FilePdfOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState } from 'react'

const Production = () => {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  useTokenRenewal(navigate)

  const onChange = (value: number) => {
    console.log('onChange:', value)
    setCurrent(value)
  }

  const steps = [
    {
      title: 'Diseño',
      description: 'Completado',
      progress: [
        { percent: 100, status: 'Actividad 1', size: 'small' },
        { percent: 100, status: 'Actividad 2', size: 'small' },
        { percent: 100, status: 'Actividad 3', size: 'small' },
        { percent: 100, status: 'Actividad 4', size: 'small' }
    
    ],
      icon: <CheckOutlined className="text-green-500" />
    },
    {
      title: 'Corte',
      description: 'Completado',
      progress: [
        { percent: 100, status: 'Actividad 1', size:"small"},
        { percent: 100, status: 'Actividad 2', size: 'small' },
        { percent: 100, status: 'Actividad 3', size: 'small' },
        { percent: 100, status: 'Actividad 4', size: 'small' }
    ],
      icon: <CheckOutlined className="text-green-500" />
    },
    {
      title: 'Impresion',
      description: 'Completado',
      progress: [{ percent: 100, status: 'success' }],
      icon: <CheckOutlined className="text-green-500" />
    },
    {
      title: 'Sublimado',
      description: 'En proceso',
      progress: [
        { percent: 30, status: 'normal' },
        { percent: 50, status: 'active' },
        { percent: 70, status: 'exception' },
        { percent: 100, status: 'success' }
      ],
      icon: <LoadingOutlined className="text-yellow-500" />
    },
    {
      title: 'Costura',
      description: 'Pendiente',
      progress: [],
      icon: <CloseOutlined className="text-red-500" />
    },
    {
      title: 'Acabado',
      description: 'Pendiente',
      progress: [],
      icon: <CloseOutlined className="text-red-500" />
    }
  ]

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">Produccion</h4>
          <h6 className="text-sm">Administrar produccion</h6>
        </div>
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

        <Steps
          current={current}
          onChange={onChange}
          items={steps.map((step, index) => ({
            ...step,
            status:
              index === current
                ? 'process'
                : index < current
                  ? 'finish'
                  : 'wait'
          }))}
        />

        <Divider />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className={index === current ? '' : 'hidden'}>
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
        </div>
      </Card>
    </>
  )
}

export default Production
