export default class Dispatcher {
  action = 'default'
  payload = {}

  constructor (action, playload = undefined) {
    this.action = action
    this.payload = playload
  }
}
