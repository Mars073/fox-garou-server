const IS_EMPTY = /^\s*$/
const IS_UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){4}[0-9a-f]{8}$/i
const IS_USERNAME = /^[a-z0-9_\- ]{2,16}$/
const ALLOWED_ORIGIN = /^https?:\/\/(localhost|fox\.m-leroy\.pro)(:[0-9]{2,4})?/i

const _default = {
  IS_EMPTY,
  IS_UUID,
  IS_USERNAME,
  ALLOWED_ORIGIN
}

export default _default
