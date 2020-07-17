export default class CredentialsError extends Error {
  constructor () {
    super("Credentials violation")
  }
}
