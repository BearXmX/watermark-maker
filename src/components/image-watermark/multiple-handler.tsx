import { useState } from 'react'
import { Button, Card, Col, Drawer, Modal, Row, Space, Upload, UploadProps, message } from 'antd'
import { changeSettingAction, defaultSetting, downloadSettingAction, importSettingAction } from './instance'
import ConfigForm from './config-form'
import Canvas from './canvas'
import JsZip from 'jszip'
import { saveAs } from 'file-saver'

type propsType = {
  setOpenMultiHandler: React.Dispatch<React.SetStateAction<boolean>>
}

const MultipleHanderWatermark: React.FC<propsType> = props => {
  const { setOpenMultiHandler } = props

  const [setting, setSetting] = useState<settingType>({ ...defaultSetting, image: [], file: [] })

  const [showConfig, setShowConfig] = useState<boolean>(false)

  const changeSetting = function (key: keyof formValueType, value: formValueType[keyof formValueType]) {
    changeSettingAction(key, value, setting, setSetting)
  }

  const importSetting: UploadProps['customRequest'] = options => {
    importSettingAction(options, setting, setSetting)
  }

  const downloadSetting = () => {
    downloadSettingAction(setting)
  }

  const downloadAll = () => {
    const canvas = document.querySelectorAll('.multiple-canvas-item') as NodeListOf<HTMLCanvasElement>

    if (!Array.from(canvas).length) {
      message.error('请上传文件')
      return
    }

    const zip = new JsZip()

    Array.from(canvas).forEach((item, index) => {
      const base64 = item?.toDataURL('image/png')

      const settingImage = (setting.image as HTMLImageElement[])[index] as HTMLImageElement

      zip.file(
        `${setting.ext === 'default' ? settingImage.title : settingImage!.title.slice(undefined, -4) + `.${setting.ext}`}`,
        base64.split(',')[1],
        { base64: true }
      )
    })

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, '图片压缩包')
    })
  }

  return (
    <Modal
      width={1920}
      centered
      title="批量处理"
      styles={{
        body: {
          backgroundColor: '#eff0f8',
          padding: '2px 2px',
          height: 770,
          overflow: 'auto',
        },
      }}
      open={true}
      onCancel={() => {
        setOpenMultiHandler(false)
        setShowConfig(false)
      }}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <Row>
        <Col lg={24} span={24}>
          <Card
            title="画布"
            bodyStyle={{ overflow: 'auto', height: 708 }}
            extra={
              <Space>
                <Button
                  type="default"
                  onClick={() => {
                    downloadAll()
                  }}
                >
                  导出所有
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    setShowConfig(true)
                  }}
                >
                  配置水印
                </Button>
              </Space>
            }
          >
            {!(setting.image as HTMLImageElement[]).length && <div className="multiple-canvas-empty">请先上传图片</div>}
            <div className="multiple-canvas-container">
              {(setting.file as string[]).map((item, index) => {
                return <Canvas setting={setting} index={index} key={index}></Canvas>
              })}
            </div>
          </Card>
        </Col>
      </Row>

      <Drawer open={showConfig} title="配置" onClose={() => setShowConfig(false)} placement={'top'}>
        <Card
          extra={
            <Space>
              <Button
                type="link"
                danger
                onClick={() => {
                  setSetting({ ...defaultSetting, image: [], file: [] })
                }}
              >
                清空配置
              </Button>
              <Button type="dashed" size="small" className="download-watermark-setting-btn" onClick={downloadSetting}>
                导出当前配置
              </Button>
              <Upload customRequest={importSetting} showUploadList={false} accept=".json">
                <Button type="dashed" size="small" className="multi-download-watermark-setting-btn">
                  导入配置
                </Button>
              </Upload>
            </Space>
          }
        >
          <ConfigForm multiple={true} formLayout="horizontal" setting={setting} setSetting={setSetting} changeSetting={changeSetting}></ConfigForm>
        </Card>
      </Drawer>
    </Modal>
  )
}

export default MultipleHanderWatermark
