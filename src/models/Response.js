export default class Response {
  #type = 'error'
  data = {}

  constructor (type, data = {}) {
    this.type = type
    this.data = data
  }

  set type (type) {
    if (typeof type === 'string' && type.length > 0) {
      this.#type = type
    } else {
      throw new TypeError()
    }
  }

  get type () {
    return this.#type
  }

  toJSON () {
    return JSON.stringify({
      type: this.#type,
      data: this.data
    })
  }
}
