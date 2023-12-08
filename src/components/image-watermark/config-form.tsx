import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  FormInstance,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Row,
  Slider,
  Space,
  Upload,
  UploadProps,
  message,
} from 'antd'
import { noRepeatPosition, maxOffsetDistance, defaultSetting, maxMarginDistance, maxFontSize, maxRotate } from './instance'
import { useEffect, useRef } from 'react'
import { RcFile } from 'antd/es/upload'
import { debounce } from 'lodash'

type propsType = {
  setting: settingType
  changeSetting: (key: keyof formValueType, value: formValueType[keyof formValueType]) => void
  setSetting: React.Dispatch<React.SetStateAction<settingType>>
  formLayout: FormProps['layout']
  multiple: boolean
}

const ConfigForm: React.FC<propsType> = props => {
  const formInstance = useRef<FormInstance<formValueType>>(null)

  const { setting, changeSetting, setSetting, formLayout, multiple } = props

  const customRequest: UploadProps['customRequest'] = options => {
    const file = options.file as RcFile

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      message.error('请上传png/jpg格式的文件')
      return
    }

    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.onload = function () {
      const base64 = this.result as string

      const image = new Image()

      image.src = base64

      image.title = file.name

      image.onload = function () {
        setSetting({
          ...setting,
          file: base64,
          image,
        })
      }
    }
  }

  const customMultiRequest: UploadProps['customRequest'] = options => {
    const file = options.file as RcFile

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      message.error('请上传png/jpg格式的文件')
      return
    }

    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.onload = function () {
      const base64 = this.result as string

      const image = new Image()

      image.src = base64

      image.title = file.name

      image.onload = function () {
        setSetting(prev => {
          return {
            ...prev,
            file: [base64, ...(prev.file as string[])],
            image: [image, ...(prev.image as HTMLImageElement[])],
          }
        })
      }
    }
  }

  const customRequestImageWater: UploadProps['customRequest'] = options => {
    const file = options.file as RcFile

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      message.error('请上传png/jpg格式的文件')
      return
    }

    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.onload = function () {
      const base64 = this.result as string

      const image = new Image()

      image.src = base64

      image.onload = function () {
        setSetting({
          ...setting,
          imageWatermarkFile: base64,
          imageWatermark: image,
        })
      }
    }
  }

  useEffect(() => {
    formInstance.current?.setFieldsValue(setting)
  }, [setting])

  return (
    <Form
      layout={formLayout}
      ref={formInstance}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={
        {
          ...setting,
        } as formValueType
      }
    >
      <Form.Item label="图片">
        <Space align="start">
          <Upload
            customRequest={multiple ? customMultiRequest : customRequest}
            multiple={multiple}
            showUploadList={false}
            accept=".jpg,.png"
            action={'#'}
          >
            <div className="upload-icon-container">
              {<PlusOutlined />}
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
          <div className="setting-upload-fileList">
            {!!setting.file && typeof setting.file === 'string' && !multiple && (
              <div className="setting-file-preview-container">
                <img className="setting-file-preview" src={setting.file as string}></img>
                <span className="setting-file-remove">
                  <CloseOutlined
                    onClick={() => {
                      setSetting({
                        ...setting,
                        image: null,
                        file: '',
                      })
                    }}
                  />
                </span>
              </div>
            )}
            {Array.isArray(setting.file) && multiple && (
              <>
                {setting.file.map((item, index) => {
                  return (
                    <div className="setting-file-preview-container" key={index}>
                      <img className="setting-file-preview" src={item as string}></img>
                      <span className="setting-file-remove">
                        <CloseOutlined
                          onClick={() => {
                            setSetting({
                              ...setting,
                              image: (setting.image as HTMLImageElement[]).filter((_, i) => i !== index),
                              file: (setting.file as string[]).filter((_, i) => i !== index),
                            })
                          }}
                        />
                      </span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </Space>
      </Form.Item>

      <Form.Item label="水印类型" name={'watermarkType'}>
        <Radio.Group
          onChange={e => {
            changeSetting('watermarkType', e.target.value)
          }}
        >
          <Radio value={1}>单行文本</Radio>
          <Radio value={2}>多行文本</Radio>
          <Radio value={3}>图片水印</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="单行文本" name={'singleLineText'} style={{ display: setting.watermarkType === 1 ? 'block' : 'none' }}>
        <Input
          placeholder="水印文本"
          onChange={e => {
            changeSetting('singleLineText', e.target.value)
          }}
        ></Input>
      </Form.Item>

      <Form.Item
        label="多行文本"
        style={{ display: setting.watermarkType === 2 ? 'block' : 'none', marginBottom: 10 }}
        extra={
          <>
            <Button
              type="link"
              style={{ padding: '4px 0' }}
              onClick={debounce(function () {
                changeSetting('multipleLineText', [...setting.multipleLineText!, { text: '' }])
              }, 500)}
            >
              增加多行文本框
            </Button>
          </>
        }
      >
        {setting.multipleLineText!.map((item, index) => {
          return (
            <Form.Item key={index} style={{ marginBottom: 8 }}>
              <Space>
                <Input
                  placeholder={`第${index + 1}行水印文本`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newMultipleLineText = setting.multipleLineText?.map((textItem, textIndex) => {
                      return {
                        ...textItem,
                        text: index === textIndex ? e.target.value : textItem.text,
                      }
                    })
                    changeSetting('multipleLineText', newMultipleLineText)
                  }}
                  value={item.text}
                ></Input>
                {setting.multipleLineText?.length! > 1 && (
                  <Button
                    type="link"
                    style={{ padding: '10px 0' }}
                    onClick={debounce(function () {
                      changeSetting(
                        'multipleLineText',
                        setting.multipleLineText?.filter((_, btnIndex) => {
                          return btnIndex !== index
                        })
                      )
                    }, 500)}
                  >
                    删除
                  </Button>
                )}
              </Space>
            </Form.Item>
          )
        })}
      </Form.Item>

      <Form.Item label="对齐方式" name="multipleLineAlignType" style={{ display: setting.watermarkType === 2 ? 'block' : 'none' }}>
        <Radio.Group
          onChange={e => {
            changeSetting('multipleLineAlignType', e.target.value)
          }}
        >
          <Radio value={1}>左对齐</Radio>
          <Radio value={2}>居中对齐</Radio>
          <Radio value={3}>右对齐</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="字号" name={'fontSize'} style={{ display: setting.watermarkType !== 3 ? 'block' : 'none' }}>
        <InputNumber
          step={1}
          precision={0}
          min={1}
          max={maxFontSize}
          onChange={e => {
            changeSetting('fontSize', e as number)
          }}
        ></InputNumber>
      </Form.Item>

      <Form.Item label="颜色" name={'color'} style={{ display: setting.watermarkType !== 3 ? 'block' : 'none' }}>
        <ColorPicker
          format="rgb"
          onChange={e => {
            changeSetting('color', e.toRgb())
          }}
        />
      </Form.Item>

      <Form.Item label="图片水印" style={{ display: setting.watermarkType === 3 ? 'block' : 'none' }}>
        <Space align="end">
          <Upload customRequest={customRequestImageWater} showUploadList={false} accept=".jpg,.png">
            <div className="upload-watermark-container">
              {<PlusOutlined />}
              <div style={{ marginTop: '-5px' }}>上传</div>
            </div>
          </Upload>
          {!!setting.imageWatermarkFile && <img className="setting-watermark-image-preview" src={setting.imageWatermarkFile} alt="" />}
          {!!setting.imageWatermarkFile && (
            <Button
              type="link"
              onClick={() => {
                setSetting({
                  ...setting,
                  imageWatermarkFile: '',
                  imageWatermark: null,
                })
              }}
            >
              清除
            </Button>
          )}
        </Space>
      </Form.Item>

      <Form.Item label="是否铺满" name={'repeat'}>
        <Radio.Group
          onChange={e => {
            changeSetting('repeat', e.target.value)
          }}
        >
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Radio.Group>
      </Form.Item>
      {
        <Form.Item label="位置" name={'position'} style={{ display: !setting.repeat ? 'block' : 'none' }}>
          <Checkbox.Group
            onChange={e => {
              changeSetting('position', e as postionType[])
            }}
          >
            <Row>
              {noRepeatPosition.map(item => {
                return (
                  <Col span={8} key={item.value}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                )
              })}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      }
      <>
        <Form.Item label="旋转角度" name={'rotate'}>
          <Slider
            range
            min={-maxRotate}
            max={maxRotate}
            defaultValue={[0]}
            onChange={debounce(function (e: number[]) {
              changeSetting('rotate', e)
            }, 500)}
            tooltip={{
              placement: 'left',
            }}
          />
        </Form.Item>
        <Form.Item label="右间距" name={'marginRight'}>
          <Slider
            range
            min={0}
            max={maxMarginDistance}
            defaultValue={[0]}
            onChange={debounce(function (e: number[]) {
              changeSetting('marginRight', e)
            }, 500)}
            tooltip={{
              placement: 'left',
            }}
          />
        </Form.Item>
        <Form.Item label="下间距" name={'marginBottom'}>
          <Slider
            range
            min={0}
            max={maxMarginDistance}
            defaultValue={[0]}
            onChange={debounce(function (e: number[]) {
              changeSetting('marginBottom', e)
            }, 500)}
            tooltip={{
              placement: 'left',
            }}
          />
        </Form.Item>

        <Form.Item label="x轴平移" name={'offsetX'}>
          <Slider
            range
            min={-maxOffsetDistance}
            max={maxOffsetDistance}
            defaultValue={[0]}
            onChange={debounce(function (e: number[]) {
              changeSetting('offsetX', e)
            }, 500)}
            tooltip={{
              placement: 'left',
            }}
          />
        </Form.Item>

        <Form.Item label="y轴平移" name={'offsetY'}>
          <Slider
            range
            min={-maxOffsetDistance}
            max={maxOffsetDistance}
            defaultValue={[0]}
            onChange={debounce(function (e: number[]) {
              changeSetting('offsetY', e)
            }, 500)}
            tooltip={{
              placement: 'left',
            }}
          />
        </Form.Item>

        <Form.Item label="导出格式" name={'ext'}>
          <Radio.Group
            onChange={e => {
              changeSetting('ext', e.target.value)
            }}
          >
            <Radio value={'default'}>默认</Radio>
            <Radio value={'png'}>png</Radio>
            <Radio value={'jpg'}>jpg</Radio>
          </Radio.Group>
        </Form.Item>
      </>
    </Form>
  )
}

export default ConfigForm
