export default class UsedUsernameError extends Error {
  constructor () {
    super("Ce nom d'utilisateur est déjà utilisé")
  }
}
