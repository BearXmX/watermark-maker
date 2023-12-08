import React, { useEffect, useState } from 'react'
import { Button, Row, Space, Tour, TourProps, message } from 'antd'
import ImageWatermark from './components/image-watermark'

import './App.css'
import { PlusOutlined } from '@ant-design/icons'
import MultipleHanderWatermark from './components/image-watermark/multiple-handler'

const makeId = () => {
  return (Math.random() * 100000).toString(16).slice(5)
}

function App() {
  const [canvasIds, setCanvasIds] = useState<string[]>([makeId()])

  const [currentConfigId, setCurrentConfigId] = useState<string>('')

  const [openIntroduce, setOpenIntroduce] = useState<boolean>(false)

  const [openMultiHandler, setOpenMultiHandler] = useState<boolean>(false)

  const steps: TourProps['steps'] = [
    {
      title: '配置水印',
      description: (
        <div>
          <p style={{ marginBottom: 8 }}> 点击该按钮打开抽屉 ={'>'}配置水印（上传你需要处理水印的图片）</p>

          <div className="tour-upload-icon-container" style={{ width: '20%' }}>
            {<PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </div>
      ),
      target: () => document.querySelectorAll('.open-watermark-btn')[0] as HTMLButtonElement,
    },
    {
      title: '导出为图片',
      description: '配置完毕后，点击该按钮将画布内容导出为图片',
      target: () => document.querySelectorAll('.export-watermark-btn')[0] as HTMLButtonElement,
    },
    {
      title: '导出当前画布配置',
      description: '您也可以点击该按钮导出当前画布配置，保留配置方便下次使用',
      target: () => document.querySelectorAll('.download-watermark-setting-btn')[0] as HTMLButtonElement,
    },
    {
      title: '导入配置',
      description: '您也可以点击该按钮导入配置，一键使用历史配置，但是请注意配置数据格式需符合规定，否则将按默认值处理',
      target: () => document.querySelectorAll('.import-watermark-setting-btn')[0] as HTMLButtonElement,
    },
    {
      title: '增加画布',
      description: '您也可以点击该按钮增加画布，处理更多图片',
      target: () => document.querySelectorAll('.insert-canvas-btn')[0] as HTMLButtonElement,
    },
    {
      title: '批量处理',
      description: '您也可以点击该按钮批量处理图片',
      target: () => document.querySelectorAll('.multi-canvas-btn')[0] as HTMLButtonElement,
      nextButtonProps: {
        children: '结束介绍',
      },
    },
  ]

  /*   useEffect(() => {
    document.body.addEventListener('click', function (e) {
      const target = e.target as HTMLElement

      console.log(target)

      console.log(document.getElementById('root')?.contains(target))

      if (document.getElementById('root')?.contains(target)) {
        console.log(target)

        if (target.className.includes('open-watermark-btn')) {
          setCurrentConfigId('')
        } else {
          if (!target.parentElement?.className.includes('open-watermark-btn')) {
            setCurrentConfigId('')
          }
        }
      } else {
        setCurrentConfigId('')
      }
    })
  }, []) */

  return (
    <div className="App">
      <Row justify={'space-between'} style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" className="insert-canvas-btn" onClick={() => setCanvasIds([...canvasIds, makeId()])}>
            增加画布
          </Button>
          <Button
            type="default"
            onClick={() => {
              setCurrentConfigId('')
              setOpenIntroduce(true)
            }}
          >
            使用介绍
          </Button>
        </Space>
        <Space>
          <Button type="primary" className="multi-canvas-btn" onClick={() => setOpenMultiHandler(true)}>
            批量处理
          </Button>
        </Space>
      </Row>

      <Tour open={openIntroduce} onClose={() => setOpenIntroduce(false)} steps={steps} />
      {canvasIds.map((item, index) => {
        return (
          <ImageWatermark
            currentConfigId={currentConfigId}
            key={item}
            index={index}
            id={item}
            del={id => {
              setCanvasIds(canvasIds.filter(canvasId => canvasId !== id))
            }}
            setCurrentConfigId={setCurrentConfigId}
          ></ImageWatermark>
        )
      })}

      {openMultiHandler && <MultipleHanderWatermark setOpenMultiHandler={setOpenMultiHandler}></MultipleHanderWatermark>}
    </div>
  )
}

export default App
