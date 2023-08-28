// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage

function storageAvailable (type) {
  let storage
  try {
    storage = window[type]
    const x = '_'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
// everything except Firefox
(e.code === 22 ||
// Firefox
e.code === 1014 ||
// test name field too, because code might not be present
// everything except Firefox
e.name === 'QuotaExceededError' ||
// Firefox
e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
// acknowledge QuotaExceededError only if there's something already stored
storage &&
storage.length !== 0
    )
  }
}

function checkLocalStorage () {
  if (!storageAvailable('localStorage')) {
    throw new Error('Storage API Unavailable')
  }
}

const { success, failure } = {
  success: 'OK',
  failure: 'FAIL'
}

export const ocallay = {
  size () {
    checkLocalStorage()
    return localStorage.length
  },

  set (key, value) {
    checkLocalStorage()
    localStorage.setItem(key, value)
    if (localStorage.getItem(key)) {
      return success
    } else {
      throw new Error(failure)
    }
  },

  get (key) {
    checkLocalStorage()
    return localStorage.getItem(key)
  },

  delete (key) {
    checkLocalStorage()
    localStorage.removeItem(key)
    if (!localStorage.getItem(key)) {
      return success
    } else {
      throw new Error(failure)
    }
  },

  clear () {
    checkLocalStorage()
    localStorage.clear()
    if (localStorage.length === 0) {
      return success
    } else {
      throw new Error(failure)
    }
  },

  has (key) {
    checkLocalStorage()
    return localStorage.getItem(key)
  },

  export (key) {
    checkLocalStorage()
    const result = { ...localStorage }
    return result
  }
}
