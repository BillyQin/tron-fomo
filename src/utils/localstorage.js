export const storageKey = {
  SHARE_CODE: 'SHARE_CODE'  // 项目分享邀请码
}

export class LocalStorage {
  static set (key, data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }

    return localStorage.setItem(storageKey[key], data)
  }

  static get (key) {
    const data = localStorage.getItem(storageKey[key])
    return data || ''
  }

  static remove (key) {
    return localStorage.removeItem(storageKey[key])
  }
}

