import { saveDataType } from '../config'
import queryString from 'query-string'

export default {
  save (history, data, type = saveDataType) {
    let location = history.location
    if (type === 'query') {
      let search = queryString.parse(location.search)
      history.push(location.pathname + '?' + queryString.stringify({
        ...search,
        ...data
      }))
    } else {
      localStorage.setItem(location.pathname, JSON.stringify({
        ...JSON.parse(localStorage.getItem(location.pathname)),
        ...data
      }))
    }
  },
  get (history, type = saveDataType) {
    if (type === 'query') {
      return queryString.parse(history.location.search)
    } else {
      let pageData = JSON.parse(localStorage.getItem(history.location.pathname))
      return pageData
    }
  },
  clear (history, data, type = saveDataType) {
    let location = history.location
    if (type === 'query') {
      history.push(location.pathname + '?' + queryString.stringify({
        ...data
      }))
    } else {
      localStorage.setItem(location.pathname, JSON.stringify({
        ...data
      }))
    }
  }
}
