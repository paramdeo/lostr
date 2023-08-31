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

export function LoStr({ logging } = { logging: false }) {
  this.logging = logging
}

LoStr.prototype.size = function() {
  checkLocalStorage()
  try {
    return localStorage.length
  } catch (err) {
    throw new Error(err)
  } finally {
    console.log(this.logging) // todo add logging etc.
  }
}

LoStr.prototype.set = function(key, value) {
  checkLocalStorage()
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    throw new Error(err)
  } finally {
    return localStorage.getItem(key) !== undefined ? success : failure
  }
}

LoStr.prototype.get = function(key) {
  checkLocalStorage()
  return localStorage.getItem(key) ?? failure
}

LoStr.prototype.delete = function(key) {
  checkLocalStorage()
  try {
    localStorage.removeItem(key)
  } catch (err) {
    throw new Error(err)
  } finally {
    return localStorage.getItem(key) ? failure : success
  }
}

LoStr.prototype.clear = function() {
  checkLocalStorage()
  try {
    localStorage.clear()
  } catch (err) {
    throw new Error(err)
  } finally {
    return localStorage.length === 0 ? success : failure
  }
}

LoStr.prototype.has = function(key) {
  checkLocalStorage()
  try {
    let item = localStorage.getItem(key)
    return item === undefined
  } catch (err) {
    throw new Error(err)
  }
}

LoStr.prototype.export = function() {
  checkLocalStorage()
  try {
    return { ...JSON.parse(JSON.stringify(localStorage)) }
  } catch (err) {
    throw new Error(err)
  }
}
