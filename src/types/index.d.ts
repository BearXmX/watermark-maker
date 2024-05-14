declare type postionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

declare type formValueType = {
  singleLineText?: string
  rotate?: number[]
  color?: {
    r: number
    g: number
    b: number
    a: number
  }
  fontSize?: number
  repeat?: 0 | 1
  marginRight?: number[]
  marginBottom?: number[]
  position?: postionType[]
  ext?: 'default' | 'png' | 'jpg'
  offsetX?: number[]
  offsetY?: number[]
  watermarkType?: 1 | 2 | 3
  multipleLineText?: { text: string }[]
  multipleLineAlignType?: 1 | 2 | 3
}

declare type settingType = {
  file: string | string[]
  image: HTMLImageElement | null | HTMLImageElement[]
  imageWatermark: HTMLImageElement | null
  imageWatermarkFile?: string
} & formValueType

declare interface Window {
  showCopyright: () => void
  isPlainObject: (target: any) => boolean
  isArray: (target: any) => boolean
}

declare module 'file-saver'
