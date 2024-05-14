import { useEffect, useMemo, useRef, useState } from 'react'
import { Col, Row, Card, Button, message, Space, Drawer, Radio, Upload, Dropdown, MenuProps } from 'antd'
import ConfigForm from './config-form'

import { changeSettingAction, defaultSetting, downloadSettingAction, drawAction, importSettingAction } from './instance'
import { download } from '../../utils'
import { DrawerProps, UploadProps } from 'antd/lib'

import './index.css'

type propsType = {
  index: number
  id: string
  del: (id: string) => void
  currentConfigId: string
  setCurrentConfigId: React.Dispatch<React.SetStateAction<string>>
}

const ImageWatermark: React.FC<propsType> = props => {
  const { index, id, del, currentConfigId, setCurrentConfigId } = props

  const canvas = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  const [setting, setSetting] = useState<settingType>(defaultSetting)

  const [drawerPlacement, setDrawerPlacement] = useState<DrawerProps['placement']>('right')

  const exportCanvas = () => {
    if (!setting.image) {
      message.error('请上传文件')
      return
    }
    const base64 = canvas.current?.toDataURL('image/png')

    const settingImage = setting.image as HTMLImageElement

    download({
      href: base64,
      name: setting.ext === 'default' ? settingImage.title : settingImage!.title.slice(undefined, -4) + `.${setting.ext}`,
    })
  }

  const drawImage = () => {
    const settingImage = setting.image as HTMLImageElement

    drawAction(canvas, ctx, setting, settingImage)
  }

  const changeSetting = function (key: keyof formValueType, value: formValueType[keyof formValueType]) {
    changeSettingAction(key, value, setting, setSetting)
  }

  const downloadSetting = () => {
    downloadSettingAction(setting)
  }

  const importSetting: UploadProps['customRequest'] = options => {
    importSettingAction(options, setting, setSetting)
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <Button type="dashed" className="export-watermark-btn" onClick={exportCanvas}>
          导出为图片
        </Button>
      ),
      key: '1',
    },
    {
      label: (
        <Button type="dashed" className="download-watermark-setting-btn" onClick={downloadSetting}>
          导出当前画布配置
        </Button>
      ),
      key: '2',
    },
    {
      label: (
        <Upload customRequest={importSetting} showUploadList={false} accept=".json">
          <Button type="dashed" className="import-watermark-setting-btn">
            导入配置
          </Button>
        </Upload>
      ),
      key: '3',
    },
  ]

  const menuProps = {
    items,
  }

  useEffect(() => {
    drawImage()
  }, [setting])

  useEffect(() => {
    if (canvas.current) {
      setCtx(canvas.current?.getContext('2d')!)
    }
  }, [canvas.current])

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={24}>
        <Card
          title={`画布（${index + 1}）`}
          extra={
            <Space size={16}>
              {index !== 0 && (
                <Button type="link" danger onClick={() => del(id)}>
                  删除画布
                </Button>
              )}

              <Space className="mobile-btn-group">
                <Dropdown.Button
                  menu={menuProps}
                  type="primary"
                  className="mobile-open-watermark-btn"
                  onClick={() => {
                    setCurrentConfigId(id)
                  }}
                >
                  配置水印
                </Dropdown.Button>
              </Space>

              <Space className="pc-btn-group">
                <Button type="dashed" className="export-watermark-btn" onClick={exportCanvas}>
                  导出为图片
                </Button>
                <Button type="dashed" className="download-watermark-setting-btn" onClick={downloadSetting}>
                  导出当前画布配置
                </Button>
                <Upload customRequest={importSetting} showUploadList={false} accept=".json">
                  <Button type="dashed" className="import-watermark-setting-btn">
                    导入配置
                  </Button>
                </Upload>
                <Button
                  className="open-watermark-btn"
                  type="primary"
                  onClick={() => {
                    setCurrentConfigId(id)
                  }}
                >
                  配置水印
                </Button>
              </Space>
            </Space>
          }
          style={{ height: '100%' }}
        >
          <div className="canvas-container">
            {!setting.file && <p className="canvas-container-tips">请先上传图片</p>}
            <canvas style={{ display: !!setting.file ? 'block' : 'none' }} ref={canvas}></canvas>
          </div>
        </Card>
      </Col>
      <Drawer
        className="watermark-config-drawer"
        placement={drawerPlacement}
        title={'  配置水印' + `（${index + 1}）`}
        open={currentConfigId === id}
        width={450}
        onClose={() => {
          setCurrentConfigId('')
        }}
        mask={false}
        destroyOnClose={true}
        extra={
          <Row justify={'space-between'}>
            <Button type="link" danger onClick={() => setSetting(defaultSetting)} style={{ padding: 0 }}>
              清空配置
            </Button>
          </Row>
        }
        footer={
          <Row justify={'space-between'}>
            <Radio.Group
              options={[
                { label: '上', value: 'top' },
                { label: '下', value: 'bottom' },
                { label: '左', value: 'left' },
                { label: '右', value: 'right' },
              ]}
              onChange={e => {
                setDrawerPlacement(e.target.value)
              }}
              value={drawerPlacement}
              optionType="button"
              buttonStyle="solid"
            />
            <Button type="default" onClick={() => setCurrentConfigId('')}>
              关闭配置
            </Button>
          </Row>
        }
      >
        <ConfigForm multiple={false} formLayout="horizontal" setting={setting} setSetting={setSetting} changeSetting={changeSetting}></ConfigForm>
      </Drawer>
    </Row>
  )
}

export default ImageWatermark
