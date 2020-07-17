import { v4 as uuidv4 } from 'uuid'
import Token from '../utils/Token'
import Euler from './Euler'

export default class Player {
  #socket = {}
  name = 'no name'
  #uuid = ''
  #token = ''
  #rotation = new Euler(0, 0, 0)

  constructor (socket, name) {
    this.#socket = socket
    this.name = name
    this.#uuid = uuidv4()
    this.#token = Token.generate(512)
  }

  get id () {
    return this.#uuid
  }

  set rotation(euler) {
    this.#rotation.x = euler.x % Math.PI
    this.#rotation.y = euler.y % Math.PI
    this.#rotation.z = euler.z % Math.PI
  }

  get rotation () {
    return this.#rotation
  }

  get webSocket () {
    return this.#socket
  }

  get privateToken () {
    return this.#token
  }

  kick () {
    if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.close()
    }
  }

  toJSON (withToken = false) {
    const obj = {
      name: this.name,
      uuid: this.#uuid,
      rotation: this.#rotation
    }
    if (withToken === true) {
      obj.private_token = this.#token
    }
    return JSON.stringify(obj)
  }
}
