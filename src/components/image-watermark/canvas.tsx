import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { drawAction } from './instance'

type PropsType = {
  setting: settingType
  index: number
}

const Canvas: React.FC<PropsType> = props => {
  const { setting, index } = props

  const canvas = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  const drawImage = () => {
    const settingImage = (setting.image as HTMLImageElement[])[index]

    drawAction(canvas, ctx, setting, settingImage)
  }

  useEffect(() => {
    drawImage()
  }, [setting])

  useEffect(() => {
    if (canvas.current) {
      setCtx(canvas.current?.getContext('2d')!)
      drawImage()
    }
  }, [canvas.current])

  return (
    <div className="multiple-canvas-content">
      {!!(setting.image as HTMLImageElement[])[index] && <canvas className="multiple-canvas-item" style={{ display: 'block' }} ref={canvas}></canvas>}
    </div>
  )
}

export default Canvas
