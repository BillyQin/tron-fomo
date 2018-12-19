import axios from 'axios'
import qs from 'qs'
// import { baseURL } from '../config'
import Config from '@/../config/config'
import apiUrl from '../config/apiUrl'
import { message } from 'antd'
import { transformDate, responseHandle } from './common'

let api = axios.create({
  baseURL: Config.backend, // baseURL,
  headers: {'Content-Type': 'application/json'},
  responseType: 'json'
})

let token = ''
let access_token = ''

api.defaults.validateStatus = (status) => {
  return true
}

api.interceptors.request.use(config => {
  if (window.projectEnv === 'admin') {
    token = JSON.parse(localStorage.getItem('admin') || '{}')

  } else if (window.projectEnv === 'mobile') {
    // token = JSON.parse(localStorage.getItem('userToken') || '{}')
    token = localStorage.getItem('userToken') || ''
  } else if (window.projectEnv === 'candypc') {
    // token = JSON.parse(localStorage.getItem('userToken') || '{}')
    token = localStorage.getItem('userTokenpc') || ''
  }

  if (token && (config.url !== apiUrl.login)) {
    config.headers.common['Authorization'] = token
  }

  // 去除''选项
  let data = {},params = {}
  for (let key in config.data) {
    if (config.data[key] !== '') {
      data[key] = config.data[key]
    } else if (config.data[key] === 'page') {
      data[key] = parseInt(config.data[key])
    }
  }
  for (let key in config.params) {
    if (config.params[key] !== '') {
      params[key] = config.params[key]
    }
  }
  config.data = JSON.stringify(data)
  config.params = params
  return config
}, error => {
  return Promise.reject(error)
})


api.interceptors.response.use(response => {
  if (response.request.responseURL.includes('item/join/excel')) {
    let decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data))
    // console.log('12: ',decodedString)
    // if (decodedString.length < 100) {
    //   response.data = JSON.parse(decodedString)
    //   return responseHandle(response.data, message)
    // } else {
    //   return response.data
    // }
    return responseHandle(decodedString, message)
  } else {
    return responseHandle(response.data, message)
  }
}, error => {
  return Promise.reject(error)
})

export default api
