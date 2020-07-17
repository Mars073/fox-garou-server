export default class BadUsernameError extends Error {
  constructor () {
    super("Le nom d'utilisateur contient des caractères non-autorisés")
  }
}
