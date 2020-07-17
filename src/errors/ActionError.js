export default class ActionError extends Error {

    constructor () {
        super("Action non reconnue")
    }
}
