import { UploadProps, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { omit } from 'lodash'

export const maxMarginDistance = 999
export const maxOffsetDistance = maxMarginDistance * 2
export const maxFontSize = 99
export const maxRotate = 360

export const defaultSetting: settingType = {
  image: null,
  file: '',
  watermarkType: 1,
  multipleLineText: [{ text: '第一行水印啊' }, { text: '第二行水印啊啊' }],
  multipleLineAlignType: 1,
  singleLineText: '默认水印',
  rotate: [0],
  color: {
    a: 0.2,
    b: 0,
    g: 0,
    r: 0,
  },
  fontSize: 20,
  repeat: 1,
  position: [1] as postionType[],
  marginRight: [0],
  marginBottom: [0],
  ext: 'default',
  offsetX: [0],
  offsetY: [0],
  imageWatermark: null,
  imageWatermarkFile: '',
}

export const noRepeatPosition: { label: string; value: postionType }[] = [
  {
    label: '左上',
    value: 1,
  },
  {
    label: '中上',
    value: 2,
  },
  {
    label: '右上',
    value: 3,
  },
  {
    label: '左中',
    value: 4,
  },
  {
    label: '中心',
    value: 5,
  },
  {
    label: '右中',
    value: 6,
  },
  {
    label: '左下',
    value: 7,
  },
  {
    label: '中下',
    value: 8,
  },
  {
    label: '右下',
    value: 9,
  },
]

export const validateStrategy = {
  watermarkType: (importSetting: settingType) => {
    return [1, 2, 3].includes(importSetting.watermarkType as number) ? importSetting.watermarkType : defaultSetting.watermarkType
  },
  multipleLineText: (importSetting: settingType) => {
    return window.isArray(importSetting.multipleLineText)
      ? importSetting.multipleLineText?.filter(item => window.isPlainObject(item)).filter(item => typeof item.text === 'string')
      : defaultSetting.multipleLineText
  },
  multipleLineAlignType: (importSetting: settingType) => {
    return [1, 2, 3].includes(importSetting.multipleLineAlignType as number)
      ? importSetting.multipleLineAlignType
      : defaultSetting.multipleLineAlignType
  },
  singleLineText: (importSetting: settingType) => {
    return typeof importSetting.singleLineText === 'string' ? importSetting.singleLineText : defaultSetting.singleLineText
  },
  rotate: (importSetting: settingType) => {
    return window.isArray(importSetting.rotate)
      ? typeof importSetting.rotate![0] === 'number' && importSetting.rotate![0] >= -maxRotate && importSetting.rotate![0] <= maxRotate
        ? importSetting.rotate?.filter((item, index) => index === 0)
        : defaultSetting.rotate
      : defaultSetting.rotate
  },
  color: (importSetting: settingType) => {
    if (!window.isPlainObject(importSetting.color)) {
      return defaultSetting.color
    }

    const color: settingType['color'] = {
      a:
        typeof importSetting.color?.a === 'number' && importSetting.color?.a >= 0 && importSetting.color?.a <= 1
          ? importSetting.color?.a
          : (defaultSetting.color?.a as number),
      r:
        typeof importSetting.color?.r === 'number' && importSetting.color?.r >= 0 && importSetting.color?.r <= 255
          ? importSetting.color?.r
          : (defaultSetting.color?.r as number),
      g:
        typeof importSetting.color?.g === 'number' && importSetting.color?.g >= 0 && importSetting.color?.r <= 255
          ? importSetting.color?.g
          : (defaultSetting.color?.g as number),
      b:
        typeof importSetting.color?.b === 'number' && importSetting.color?.b >= 0 && importSetting.color?.b <= 255
          ? importSetting.color?.b
          : (defaultSetting.color?.b as number),
    }

    return color
  },
  fontSize: (importSetting: settingType) => {
    return typeof importSetting.fontSize === 'number' && importSetting.fontSize >= 1 && importSetting.fontSize <= maxFontSize
      ? importSetting.fontSize
      : defaultSetting.fontSize
  },
  repeat: (importSetting: settingType) => {
    return [0, 1].includes(importSetting.repeat as number) ? importSetting.repeat : defaultSetting.repeat
  },
  position: (importSetting: settingType) => {
    return window.isArray(importSetting.position)
      ? importSetting.position?.filter(item => [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(item))
      : defaultSetting.position
  },
  ext: (importSetting: settingType) => {
    return ['default', 'png', 'jpg'].includes(importSetting.ext!) ? importSetting.ext : defaultSetting.position
  },
  marginRight: (importSetting: settingType) => {
    return window.isArray(importSetting.marginRight)
      ? typeof importSetting.marginRight![0] === 'number' && importSetting.marginRight![0] >= 0 && importSetting.marginRight![0] <= maxMarginDistance
        ? importSetting.marginRight?.filter((item, index) => index === 0)
        : defaultSetting.marginRight
      : defaultSetting.marginRight
  },
  marginBottom: (importSetting: settingType) => {
    return window.isArray(importSetting.marginBottom)
      ? typeof importSetting.marginBottom![0] === 'number' &&
        importSetting.marginBottom![0] >= 0 &&
        importSetting.marginBottom![0] <= maxMarginDistance
        ? importSetting.marginBottom?.filter((item, index) => index === 0)
        : defaultSetting.marginBottom
      : defaultSetting.marginBottom
  },
  offsetX: (importSetting: settingType) => {
    return window.isArray(importSetting.offsetX)
      ? typeof importSetting.offsetX![0] === 'number' &&
        importSetting.offsetX![0] >= -maxOffsetDistance &&
        importSetting.offsetX![0] <= maxOffsetDistance
        ? importSetting.offsetX?.filter((item, index) => index === 0)
        : defaultSetting.offsetX
      : defaultSetting.offsetX
  },
  offsetY: (importSetting: settingType) => {
    return window.isArray(importSetting.offsetY)
      ? typeof importSetting.offsetY![0] === 'number' &&
        importSetting.offsetY![0] >= -maxOffsetDistance &&
        importSetting.offsetY![0] <= maxOffsetDistance
        ? importSetting.offsetY?.filter((item, index) => index === 0)
        : defaultSetting.offsetY
      : defaultSetting.offsetY
  },
}

export const drawAction = (
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D | null,
  setting: settingType,
  settingImage: HTMLImageElement
) => {
  if (!settingImage) {
    canvas.current!.width = 0
    canvas.current!.height = 0
    return
  }

  if (!settingImage!.width || !settingImage!.height) {
    message.error('图片尺寸异常，请上传其他图片')
    return
  }

  // 绘制图片
  canvas.current!.width = settingImage!.width
  canvas.current!.height = settingImage!.height

  const canvasWidth = canvas.current!.width

  const canvasHeight = canvas.current!.height

  if (!ctx) return

  ctx!.drawImage(settingImage!, 0, 0)

  // 公共部分配置
  const marginRight = setting.marginRight![0]

  const marginBottom = setting.marginBottom![0]

  ctx!.font = `${setting.fontSize}px Arial`

  ctx!.rotate((setting.rotate![0] || 0 * Math.PI) / 180)

  ctx!.fillStyle = `rgba(${setting.color?.r},${setting.color?.g},${setting.color?.b},${setting.color?.a})`

  ctx?.translate(setting.offsetX![0], setting.offsetY![0])

  // X轴绘制几张画布
  // const multipleX = Math.ceil(Math.abs(setting.offsetX![0]) / canvasWidth || 1) + (setting.offsetX![0] % canvasWidth > canvasWidth / 2 ? 2 : 1)

  // Y轴绘制几张画布
  // const multipleY = Math.ceil(Math.abs(setting.offsetY![0]) / canvasHeight || 1) + (setting.offsetY![0] % canvasHeight > canvasHeight / 2 ? 2 : 1)

  // 初始X轴点位
  const initX = 0

  // -----------------特殊部分------------------

  // 绘制单行文本水印
  if (setting.watermarkType === 1) {
    const watermarkBlockWidth = ctx?.measureText(setting.singleLineText!).width!

    if (!watermarkBlockWidth) return

    const watermarkBlockHeight = setting.fontSize!

    const xExtra = Math.ceil(Math.abs(setting.offsetX![0]) / (watermarkBlockWidth + setting.marginRight![0]))

    const yExtra = Math.ceil(Math.abs(setting.offsetY![0]) / (watermarkBlockHeight + setting.marginBottom![0]))

    if (setting.repeat) {
      // 一张画布x轴绘制的文字数量
      const xCount = Math.ceil(canvasWidth / watermarkBlockWidth!)

      // 一张画布Y轴绘制的文字数量
      const yCount = Math.ceil(canvasHeight / watermarkBlockHeight)

      for (let i = 0 - xCount + (0 - xExtra); i <= xCount + xExtra; i++) {
        const x = i === 0 ? initX : (watermarkBlockWidth + marginRight) * i

        for (let k = 0 - yCount + (0 - yExtra); k <= yCount + yExtra; k++) {
          const y = k === 0 ? watermarkBlockHeight : (watermarkBlockHeight + marginBottom) * k + watermarkBlockHeight

          ctx!.fillText(setting.singleLineText!, x, y)
        }
      }
    } else {
      const goTop = 5

      const midX = canvasWidth / 2 - watermarkBlockWidth / 2 + marginRight

      const rX = canvasWidth - watermarkBlockWidth + marginRight * 2

      const midY = canvasHeight / 2 + setting.fontSize! / 2 + marginBottom - goTop

      const bY = canvasHeight + marginBottom * 2 - goTop

      const positionMap: Record<postionType, [number, number]> = {
        1: [initX, watermarkBlockHeight],
        2: [midX, watermarkBlockHeight],
        3: [rX, watermarkBlockHeight],
        4: [initX, midY],
        5: [midX, midY],
        6: [rX, midY],
        7: [initX, bY],
        8: [midX, bY],
        9: [rX, bY],
      }

      setting.position?.forEach((item: postionType) => {
        ctx!.fillText(setting.singleLineText!, ...positionMap[item])
      })
    }
  }

  // 绘制多行文本水印
  if (setting.watermarkType === 2) {
    // 每一个水印块的宽度取决最大的那一行文本宽度
    const watermarkBlockWidth = Math.max(...setting.multipleLineText!.map(item => ctx?.measureText(item.text).width!))

    if (!watermarkBlockWidth) return

    // 每一个水印块的高度为字号 * 行数
    const watermarkBlockHeight = setting.fontSize! * setting.multipleLineText?.length!

    const xExtra = Math.ceil(Math.abs(setting.offsetX![0]) / (watermarkBlockWidth + setting.marginRight![0]))

    const yExtra = Math.ceil(Math.abs(setting.offsetY![0]) / (watermarkBlockHeight + setting.marginBottom![0]))

    if (setting.repeat === 1) {
      // 一张画布x轴绘制的文字数量
      const xCount = Math.ceil(canvasWidth / watermarkBlockWidth!)

      // 一张画布Y轴绘制的文字数量
      const yCount = Math.ceil(canvasHeight / watermarkBlockHeight!)

      for (let i = 0 - xCount + (0 - xExtra); i <= xCount + xExtra; i++) {
        const x = i === 0 ? initX : (watermarkBlockWidth + marginRight) * i

        for (let k = 0 - yCount + (0 - yExtra); k <= yCount + yExtra; k++) {
          const blockGap = k * (watermarkBlockHeight + marginBottom)

          setting.multipleLineText?.forEach((textItem, index) => {
            const paddingLeft =
              setting.multipleLineAlignType === 1
                ? 0
                : (watermarkBlockWidth - ctx?.measureText(textItem.text).width!) / (setting.multipleLineAlignType === 2 ? 2 : 1)

            const everyLineTextSelfPosition = (index + 1) * setting.fontSize!

            const y = k === 0 ? everyLineTextSelfPosition : blockGap + everyLineTextSelfPosition

            ctx!.fillText(textItem.text, x + paddingLeft, y)
          })
        }
      }
    } else {
      const goTop = 5

      const midX = canvasWidth / 2 - watermarkBlockWidth / 2 + marginRight

      const rX = canvasWidth - watermarkBlockWidth + marginRight * 2

      const positionMap: Record<postionType, [number, (index: number, length: number) => number]> = {
        1: [initX, index => index * setting.fontSize!],
        2: [midX, index => index * setting.fontSize!],
        3: [rX, index => index * setting.fontSize!],
        4: [initX, index => index * setting.fontSize! + canvasHeight / 2 + marginBottom - watermarkBlockHeight / 2 - goTop],
        5: [midX, index => index * setting.fontSize! + canvasHeight / 2 + marginBottom - watermarkBlockHeight / 2 - goTop],
        6: [rX, index => index * setting.fontSize! + canvasHeight / 2 + marginBottom - watermarkBlockHeight / 2 - goTop],
        7: [initX, (index, length) => canvasHeight - (length - index) * setting.fontSize! + marginBottom * 2 - goTop],
        8: [midX, (index, length) => canvasHeight - (length - index) * setting.fontSize! + marginBottom * 2 - goTop],
        9: [rX, (index, length) => canvasHeight - (length - index) * setting.fontSize! + marginBottom * 2 - goTop],
      }

      setting.position?.forEach((item: postionType) => {
        setting.multipleLineText?.forEach((textItem, textIndex) => {
          const paddingLeft =
            setting.multipleLineAlignType === 1
              ? 0
              : (watermarkBlockWidth - ctx?.measureText(textItem.text).width!) / (setting.multipleLineAlignType === 2 ? 2 : 1)

          ctx!.fillText(textItem.text!, positionMap[item][0] + paddingLeft, positionMap[item][1](textIndex + 1, setting.multipleLineText?.length!))
        })
      })
    }
  }

  // 绘制图片水印
  if (setting.watermarkType === 3) {
    if (!setting.imageWatermark) return

    const imageWatermakerWidth = setting.imageWatermark.width

    const imageWatermakerHeight = setting.imageWatermark.height

    if (!imageWatermakerWidth || !imageWatermakerHeight) {
      message.error('图片尺寸异常，请上传其他图片')
      return
    }

    const xExtra = Math.ceil(Math.abs(setting.offsetX![0]) / (imageWatermakerWidth + setting.marginRight![0]))

    const yExtra = Math.ceil(Math.abs(setting.offsetY![0]) / (imageWatermakerHeight + setting.marginBottom![0]))

    if (setting.repeat === 1) {
      // 一张画布x轴绘制的文字数量
      const xCount = Math.ceil(canvasWidth / imageWatermakerWidth!)

      // 一张画布Y轴绘制的文字数量
      const yCount = Math.ceil(canvasHeight / imageWatermakerHeight)

      for (let i = 0 - xCount + (0 - xExtra); i <= xCount + xExtra; i++) {
        const x = i === 0 ? initX : (imageWatermakerWidth + marginRight) * i

        for (let k = 0 - yCount + (0 - yExtra); k <= yCount + yExtra; k++) {
          const y = k === 0 ? 0 : (imageWatermakerHeight + marginBottom) * k

          ctx!.drawImage(setting.imageWatermark!, x, y)
        }
      }
    } else {
      const goTop = 5

      const midX = canvasWidth / 2 - imageWatermakerWidth / 2 + marginRight

      const rX = canvasWidth - imageWatermakerHeight + marginRight * 2

      const midY = canvasHeight / 2 - goTop + marginBottom - imageWatermakerHeight / 2

      const bY = canvasHeight - imageWatermakerHeight + marginBottom * 2

      const positionMap: Record<postionType, [number, number]> = {
        1: [initX, 0],
        2: [midX, 0],
        3: [rX, 0],
        4: [initX, midY],
        5: [midX, midY],
        6: [rX, midY],
        7: [initX, bY],
        8: [midX, bY],
        9: [rX, bY],
      }

      setting.position?.forEach((item: postionType) => {
        ctx!.drawImage(setting.imageWatermark!, ...positionMap[item])
      })
    }
  }
}

export const importSettingAction = (
  options: Parameters<NonNullable<UploadProps['customRequest']>>['0'],
  setting: settingType,
  setSetting: React.Dispatch<React.SetStateAction<settingType>>
) => {
  const file = options.file as RcFile

  if (!['application/json'].includes(file.type)) {
    message.error('请上传json格式的文件')
    return
  }

  const fileReader = new FileReader()

  fileReader.readAsText(file)

  fileReader.onload = function () {
    const importSetting = JSON.parse(this.result as string) as settingType

    if (!window.isPlainObject(importSetting)) {
      message.error('导入配置文件内容格式有误')
      return
    }

    const validateSetting = {} as settingType

    validateSetting.watermarkType = validateStrategy.watermarkType(importSetting) as settingType['watermarkType']

    validateSetting.multipleLineText = validateStrategy.multipleLineText(importSetting) as settingType['multipleLineText']

    validateSetting.multipleLineAlignType = validateStrategy.multipleLineAlignType(importSetting) as settingType['multipleLineAlignType']

    validateSetting.singleLineText = validateStrategy.singleLineText(importSetting) as settingType['singleLineText']

    validateSetting.rotate = validateStrategy.rotate(importSetting) as settingType['rotate']

    validateSetting.fontSize = validateStrategy.fontSize(importSetting) as settingType['fontSize']

    validateSetting.repeat = validateStrategy.repeat(importSetting) as settingType['repeat']

    validateSetting.position = validateStrategy.position(importSetting) as settingType['position']

    validateSetting.ext = validateStrategy.ext(importSetting) as settingType['ext']

    validateSetting.color = validateStrategy.color(importSetting) as settingType['color']

    validateSetting.marginRight = validateStrategy.marginRight(importSetting) as settingType['marginRight']

    validateSetting.marginBottom = validateStrategy.marginBottom(importSetting) as settingType['marginBottom']

    validateSetting.offsetX = validateStrategy.offsetX(importSetting) as settingType['offsetX']

    validateSetting.offsetY = validateStrategy.offsetY(importSetting) as settingType['offsetY']

    const image = new Image()

    image.src = typeof importSetting.imageWatermarkFile! === 'string' ? importSetting.imageWatermarkFile : ''

    image.onload = function () {
      setSetting({
        ...setting,
        ...validateSetting,
        imageWatermarkFile: importSetting.imageWatermarkFile,
        imageWatermark: image,
      })
    }

    image.onerror = function () {
      setSetting({
        ...setting,
        ...validateSetting,
        imageWatermarkFile: '',
        imageWatermark: null,
      })
    }
  }
}

export const downloadSettingAction = (setting: settingType) => {
  const json = document.createElement('a')
  json.download = '水印配置.json'
  json.href = 'data:text/plain,' + JSON.stringify(omit(setting, ['image', 'file', 'imageWatermark']))
  json.click()
  json.remove()
}

export const changeSettingAction = (
  key: keyof formValueType,
  value: formValueType[keyof formValueType],
  setting: settingType,
  setSetting: React.Dispatch<React.SetStateAction<settingType>>
) => {
  if (key === 'repeat') {
    setSetting({
      ...setting,
      [key]: value as 0 | 1,
      rotate: !!value ? defaultSetting.rotate : [0],
      marginBottom: !!value ? defaultSetting.marginBottom : [0],
      marginRight: !!value ? defaultSetting.marginRight : [0],
      offsetX: !!value ? defaultSetting.offsetX : [0],
      offsetY: !!value ? defaultSetting.offsetY : [0],
    })
    return
  }

  setSetting({
    ...setting,
    [key]: value,
  })
}
