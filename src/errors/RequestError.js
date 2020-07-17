export default class RequestError extends Error {

    constructor () {
        super("Requête mal formée")
    }
}
