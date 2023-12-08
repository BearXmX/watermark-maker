import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
)

window.showCopyright = () => {
  message.success('版权归属-熊明祥（请勿盗用）')
}

window.isPlainObject = target => {
  return Object.prototype.toString.call(target) === '[object Object]'
}

window.isArray = target => {
  return Array.isArray(target)
}
