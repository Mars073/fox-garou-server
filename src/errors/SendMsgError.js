export default class SendMsgError extends Error {

  constructor () {
      super("Impossible d'envoyer le message")
  }
}
