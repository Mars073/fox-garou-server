import Regex from '../utils/Regex'

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000'

export default class Request {
  player = DEFAULT_UUID
  action = 'no action'
  token = ''
  data = {}

  static check(request) {
    return request.action && !Regex.IS_EMPTY.test(request.action) &&
      request.player && request.player !== DEFAULT_UUID && Regex.IS_UUID.test(request.player)
  }
}
